import { ForbiddenError, UserInputError } from "apollo-server-express";
import { v1 as uuidv1 } from "uuid";
import { VK } from "vk-io";

import { arg, booleanArg, mutationField, objectType, queryField, stringArg } from "@nexus/schema";
import { PrismaClient } from "@prisma/client";

const JOINED_GROUPS_LIMIT = 20;
const GROUP_MEMBERS_LIMIT = 100;

const lengthLimits = {
    groupName: 50,
    groupDescription: 300
};

export default [
    queryField("joinedGroups", {
        type: "JoinedGroup",
        list: [true],
        async resolve(_root, _args, { prisma, userId, vkIo }) {
            const joinedGroups = (await prisma.member.findMany({
                where: {
                    userId
                },
                include: {
                    dedicatedGroup: true
                }
            })).map(({ isModerator, dedicatedGroup: { id, name, isModerated, ownerId } }) => {
                return {
                    id,
                    name,
                    ownerId,
                    isModerator: isModerated && isModerator,
                    membersCount: -1,
                    ownerAvatar_50: null as null | string
                };
            });
            if (!joinedGroups.length) return [];

            const userSmallAvatars = await (async () => {
                try {
                    return await getUserAvatars_50(joinedGroups.map(({ ownerId }) => ownerId), vkIo);
                } catch (err) {
                    // todo log err
                    return {};
                }
            })();
            try {
            } catch (err) {
                const userSmallAvatars = 3;
            }
            for (let i in joinedGroups) {
                joinedGroups[i].ownerAvatar_50 = userSmallAvatars[joinedGroups[i].ownerId];
                joinedGroups[i].membersCount = await prisma.member.count({
                    where: {
                        groupId: joinedGroups[i].id
                    }
                });
            }
            return joinedGroups;
        }
    }),
    objectType({
        name: "JoinedGroup",
        definition(t) {
            t.model("Group")
                .id({
                    // resolve: ({ id }) => encodeIdType("JOINED_GROUP", id)
                })
                .name();
            t.userId("ownerId");
            t.boolean("isModerator", {
                description: "Always false if group isn't moderated"
            });
            t.nonNegativeInt("membersCount");
            t.URL("ownerAvatar_50", {
                nullable: true
            });
        }
    }),
    objectType({
        name: "FoundGroupForJoin",
        definition(t) {
            t.string("name");
        }
    }),
    mutationField("findGroup", {
        type: "FoundGroupForJoin",
        args: {
            inviteToken: arg({ type: "NonEmptyString" })
        },
        async resolve(_root, { inviteToken }, { prisma, userId }) {
            const foundGroup = await findGroupToJoin({ prisma, userId, inviteToken });
            return foundGroup;
        }
    }),
    mutationField("joinGroup", {
        type: "Boolean",
        args: {
            inviteToken: arg({ type: "NonEmptyString" })
        },
        async resolve(_root, { inviteToken }, { prisma, userId }, { fieldNodes }) {
            const foundGroup = await findGroupToJoin({ prisma, userId, inviteToken });
            await prisma.member.create({
                data: {
                    dedicatedGroup: { connect: { id: foundGroup.id } },
                    userId,
                    //todo default settings
                    trackHomeworkCompletion: false,
                    shareHomeworkCompletion: false
                }
            });
            return true;
        }
    }),
    objectType({
        name: "CreatedGroup",
        definition(t) {
            t.model("Group")
                .id()
                .inviteToken();
            t.URL("avatar_50", {
                nullable: true
            });
        }
    }),
    mutationField("createGroup", {
        type: "CreatedGroup",
        description: "Return an invite token, if appropriate arg is true.",
        args: {
            name: arg({ type: "NonEmptyString" }),
            moderated: booleanArg(),
            description: stringArg({ description: "Required but can be empty" }),
            enableInviteLink: booleanArg()
        },
        async resolve(_root, { name, moderated, description, enableInviteLink }, { prisma, userId, vkIo }) {
            // todo
            if (name.length > lengthLimits.groupName) throw new UserInputError(`Group name is too large.`);
            if (description.length > lengthLimits.groupDescription) throw new UserInputError(`Group description is too large.`);
            if (
                (await prisma.member.count({
                    where: {
                        userId
                    }
                })) >= JOINED_GROUPS_LIMIT
            ) {
                throw new ForbiddenError(`You have exceeded the groups limit (${JOINED_GROUPS_LIMIT}).`);
            }
            const createdGroup = await prisma.group.create({
                data: {
                    isModerated: moderated,
                    name,
                    ownerId: userId,
                    description,
                    inviteToken: enableInviteLink ? uuidv1() : null,
                    members: {
                        create: [{
                            trackHomeworkCompletion: false,
                            shareHomeworkCompletion: false,
                            userId,
                            isModerator: true
                        }]
                    }
                },
                select: {
                    id: true,
                    inviteToken: true
                }
            });
            return {
                ...createdGroup,
                avatar_50: (await getUserAvatars_50([userId], vkIo))[userId]
            };
        }
    })
];

const findGroupToJoin = async ({ inviteToken, prisma, userId }: { inviteToken: string, prisma: PrismaClient, userId: number; }) => {
    const dedicatedGroup = (await prisma.group.findMany({
        where: {
            inviteToken
        }
    }))[0];
    if (!dedicatedGroup) throw new UserInputError("Invalid token.");
    if (
        await prisma.member.findOne({
            where: {
                groupId_userId: { groupId: dedicatedGroup.id, userId }
            }
        })
    ) {
        throw new UserInputError(`You has already joined this group.`);
    }
    if (
        (await prisma.member.count({
            where: {
                userId
            }
        })) >= JOINED_GROUPS_LIMIT
    ) {
        throw new ForbiddenError(`You have exceeded the groups limit (${JOINED_GROUPS_LIMIT}).`);
    }
    if (
        (await prisma.member.count({
            where: {
                groupId: dedicatedGroup.id
            }
        })) >= GROUP_MEMBERS_LIMIT
    ) {
        throw new ForbiddenError(`The group has exceeded the limit of members (${GROUP_MEMBERS_LIMIT}).`);
    }
    return dedicatedGroup;
};

const getUserAvatars_50 = async (userIds: number[], vkIo: VK): Promise<{ [userId: string]: string | null; }> => {
    const userAvatarsFromVk = await vkIo.api.users.get({
        user_ids: userIds.map(id => id.toString()),
        fields: ["photo_50"]
    });
    return userAvatarsFromVk.reduce((prevObj, { photo_50, id: userId }) => {
        return { ...prevObj, [userId]: photo_50 || null };
    }, {} as Record<string, string | null>);
};