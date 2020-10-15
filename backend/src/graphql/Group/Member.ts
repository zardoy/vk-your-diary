import { ForbiddenError } from "apollo-server-express";
import { resolve } from "path";

import { enumType, objectType } from "@nexus/schema";

import { deleteOneObjectFromDatabase, throwIfNoGroupAccess } from "../../helpers";

export default [
    objectType({
        name: "GroupMember",
        definition(t) {
            t.model("Member")
                .userId()
                .isModerator()
                .joinDate();
            t.string("fullName", {
                nullable: true
            });
            t.URL("avatar_50", {
                nullable: true
            });
        }
    }),
    enumType({
        name: "AcessLevel",
        members: ["MEMBER", "MODERATOR", "OWNER"]
    }),
    objectType({
        name: "GroupQuery",
        definition(t) {
            t.field("acessLevel", {
                type: "AcessLevel",
                async resolve({ groupId }, _args, { prisma, userId }) {
                    await throwIfNoGroupAccess({ groupId, userId, prisma, level: "member" });
                    const group = (await prisma.group.findOne({
                        where: {
                            id: groupId
                        },
                        select: {
                            ownerId: true,
                            isModerated: true
                        }
                    }))!;
                    if (group.ownerId === userId) return "OWNER";
                    if (!group.isModerated) return "MODERATOR";
                    const groupMember = (await prisma.member.findOne({
                        where: {
                            groupId_userId: {
                                groupId,
                                userId
                            }
                        },
                        select: {
                            isModerator: true
                        }
                    }))!;
                    return groupMember.isModerator ? "MODERATOR" : "MEMBER";
                }
            });
            t.string("inviteToken", {
                nullable: true,
                async resolve({ groupId }, _args, { prisma, userId }) {
                    await throwIfNoGroupAccess({ userId, groupId, prisma, level: "member" });
                    return (await prisma.group.findOne({
                        where: {
                            id: groupId
                        },
                        select: {
                            inviteToken: true
                        }
                    }))!.inviteToken;
                }
            });
            t.field("members", {
                type: "GroupMember",
                list: [true],
                // nullable: true, todo make owner possible to hide that
                async resolve({ groupId }, _args, { prisma, userId, vkIo }) {
                    await throwIfNoGroupAccess({ groupId, userId, prisma, level: "member" });
                    const group = (await prisma.group.findOne({ where: { id: groupId } }))!;
                    const userMembers = await prisma.member.findMany({
                        where: {
                            groupId
                        },
                        select: {
                            userId: true,
                            isModerator: true,
                            joinDate: true
                        }
                    });
                    const usersAdditionalData = await vkIo.api.users.get({
                        fields: ["photo_50"],
                        user_ids: userMembers.map(({ userId }) => userId.toString())
                    });
                    return userMembers.map((user) => {
                        const userFromApi = usersAdditionalData.find(({ id }) => id === user.userId);
                        return {
                            ...user,
                            // todo isModerated logic
                            isModerator: group.isModerated && user.isModerator,
                            fullName: userFromApi && `${userFromApi.first_name} ${userFromApi.last_name}`,
                            avatar_50: userFromApi?.photo_50
                        };
                    });
                }
            });
            t.string("description", {
                async resolve({ groupId }, _args, { prisma, userId }) {
                    await throwIfNoGroupAccess({ groupId, userId, prisma, level: "member" });
                    return (await prisma.group.findOne({
                        where: {
                            id: groupId
                        },
                        select: {
                            description: true
                        }
                    }))!.description;
                }
            });
        }
    }),
    objectType({
        name: "GroupMutation",
        definition(t) {
            t.field("leaveForever", {
                type: "Boolean",
                async resolve({ groupId }, _args, { prisma, userId }) {
                    await throwIfNoGroupAccess({ groupId, userId, prisma, level: "member" });
                    const groupMembersCount = await prisma.member.count({
                        where: {
                            groupId
                        }
                    });
                    if (groupMembersCount > 1) {
                        const group = (await prisma.group.findOne({
                            where: { id: groupId },
                            select: { ownerId: true }
                        }))!;
                        if (group.ownerId === userId) throw new ForbiddenError(`You need to transfer owner first.`);
                        // todo-high use prisma's delete
                        deleteOneObjectFromDatabase({
                            prisma,
                            itemName: "member",
                            expectedAction: "become a member",
                            query: {
                                query: `DELETE FROM "Member" WHERE "groupId" = $1 AND "userId" = $2`,
                                params: [groupId, userId]
                            }
                        });
                    } else {
                        deleteOneObjectFromDatabase({
                            prisma,
                            itemName: "group",
                            query: {
                                query: `DELETE FROM "Group" WHERE "id" = $1`,
                                params: [groupId]
                            }
                        });
                    }
                    return true;
                }
            });
        }
    })
];