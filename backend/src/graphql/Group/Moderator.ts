import { ForbiddenError, UserInputError } from "apollo-server-express";
import { v1 as uuidv1 } from "uuid";

import { arg, extendType, inputObjectType, intArg, objectType, stringArg } from "@nexus/schema";

import { NexusGenTypes } from "../../generated/schema-types";
import { deleteOneObjectFromDatabase, throwIfNoGroupAccess } from "../../helpers";

type NexusContext = NexusGenTypes["context"];

export default [
    extendType({
        type: "GroupMutation",
        definition(t) {
            t.field("homework", {
                type: "HomeworkMutation",
                resolve: ({ groupId }) => ({ groupId })
            });
            t.string("generateNewInviteToken", {
                description: "Returns a new token",
                async resolve({ groupId }, _args, { prisma, userId }) {
                    await throwIfNoGroupAccess({ groupId, userId, prisma, level: "moderator" });
                    const group = (await prisma.group.findOne({
                        where: { id: groupId }
                    }))!;
                    if (group.inviteToken === null) throw new ForbiddenError("Invite link disabled by the owner.");
                    return (await prisma.group.update({
                        where: {
                            id: groupId
                        },
                        data: {
                            inviteToken: uuidv1()
                        }
                    })).inviteToken!;
                }
            });
            t.boolean("kickMember", {
                description: "Only owner can kick moderators",
                args: {
                    memberUserIdToKick: arg({ type: "BigInt" })
                },
                async resolve({ groupId }, { memberUserIdToKick }, { prisma, userId }) {
                    await throwIfNoGroupAccess({ groupId, userId, prisma, level: "moderator" });
                    const group = (await prisma.group.findOne({
                        where: {
                            id: groupId
                        },
                        select: {
                            ownerId: true,
                            isModerated: true,
                            members: true
                        }
                    }))!;
                    if (memberUserIdToKick === group.ownerId) throw new ForbiddenError(`Can't kick group owner.`);
                    const foundMemberToKick = group.members.find(({ userId: userIdInGroup }) => userIdInGroup === memberUserIdToKick);
                    if (!foundMemberToKick) throw new ForbiddenError(`User to kick is not a member of this group.`);
                    if (userId !== group.ownerId) {
                        if (!group.isModerated) throw new ForbiddenError("Only owner can kick members in free groups.");
                        if (foundMemberToKick.isModerator) throw new ForbiddenError(`Only owner can kick group moderators.`);
                    }
                    deleteOneObjectFromDatabase({
                        prisma,
                        itemName: "member",
                        query: {
                            query: `DELETE FROM "Member" WHERE "groupId" = $1 AND "userId" = $2`,
                            params: [groupId, memberUserIdToKick]
                        }
                    });
                    return true;
                }
            });
        }
    }),
    inputObjectType({
        name: "NewHomeworkInput",
        definition(t) {
            t.nonEmptyString("subject", { nullable: true });
            t.nonEmptyString("text", { nullable: true });
            t.date("date", { nullable: true });
        }
    }),
    extendType({
        type: "GroupMutation",
        definition(t) {
            t.boolean("updateDescription", {
                args: {
                    description: stringArg()
                },
                async resolve({ groupId }, { description }, { prisma, userId }) {
                    await throwIfNoGroupAccess({ groupId, userId, prisma, level: "moderator" });
                    await prisma.group.update({
                        where: {
                            id: groupId
                        },
                        data: {
                            description
                        }
                    });
                    return true;
                }
            });
        }
    }),
    objectType({
        name: "HomeworkMutation",
        definition(t) {
            t.int("add", {
                // todo use ID instead of Int
                args: {
                    subject: arg({ type: "NonEmptyString" }),
                    text: arg({ type: "NonEmptyString" }),
                    date: arg({ type: "Date" })
                    // filesId: schema.
                },
                async resolve({ groupId }, { subject, text, date: clientDate }, { prisma, userId }) {
                    await throwIfNoGroupAccess({ groupId, userId, prisma, level: "moderator" });
                    const date = new Date(clientDate);
                    if (!isFinite(date.getTime())) throw new UserInputError(`Invalid date.`);
                    if (+date < new Date().getTime()) throw new ForbiddenError(`Can't add homework to a previous date.`);
                    return (await prisma.homework.create({
                        data: {
                            dedicatedGroup: { connect: { id: groupId } },
                            subject,
                            text,
                            givedTo: date
                        },
                        select: {
                            id: true
                        }
                    })).id;
                }
            });
            t.boolean("remove", {
                args: {
                    homeworkId: intArg()
                },
                async resolve({ groupId }, { homeworkId }, { prisma, userId }) {
                    await throwIfNoGroupAccess({ groupId, userId, prisma, level: "moderator" });
                    await throwIfNoHomeworkInGroup({ groupId, homeworkId, prisma });
                    deleteOneObjectFromDatabase({
                        prisma,
                        itemName: "homework",
                        query: {
                            query: `DELETE FROM "Homework" WHERE "id" = $1`,
                            params: [homeworkId]
                        }
                    });
                    return true;
                }
            });
            t.boolean("edit", {
                args: {
                    homeworkId: intArg(),
                    newData: arg({ type: "NewHomeworkInput" })
                },
                async resolve({ groupId }, { homeworkId, newData: { subject, date, text } }, { prisma, userId }) {
                    if (!date && !subject && !text) throw new UserInputError(`One of the arg in new data must be defined`);
                    await throwIfNoGroupAccess({ groupId, userId, prisma, level: "moderator" });
                    await throwIfNoHomeworkInGroup({ groupId, homeworkId, prisma });
                    const dedicatedHomework = (await prisma.homework.findOne({
                        where: {
                            id: homeworkId
                        },
                        select: {
                            givedTo: true
                        }
                    }))!;
                    if (dedicatedHomework.givedTo.setDate(dedicatedHomework.givedTo.getDate() - 1) < new Date().getTime())
                        throw new ForbiddenError("You can't edit archived task");
                    if (date && +new Date(date) < new Date().getTime()) throw new ForbiddenError("Can't write homework to a previous date.");
                    await prisma.homework.update({
                        where: { id: homeworkId },
                        data: {
                            subject: subject ?? undefined,
                            text: text ?? undefined,
                            givedTo: date ?? undefined
                        }
                    });
                    return true;
                }
            });
        }
    })
];

const throwIfNoHomeworkInGroup = async ({ groupId, prisma, homeworkId }: { groupId: number; prisma: NexusContext["prisma"]; homeworkId: number; }) => {
    const homework = await prisma.homework.findOne({
        where: {
            id: homeworkId
        },
        select: { groupId: true }
    });
    if (!homework || homework.groupId !== groupId) throw new ForbiddenError(`This homework doesn't exist in that group.`);
};
