import { v1 as uuidv1 } from "uuid";

import { arg, booleanArg, extendType, stringArg } from "@nexus/schema";

import { throwIfNoGroupAccess } from "../../helpers";

export default [
    extendType({
        type: "GroupMutation",
        definition(t) {
            t.boolean("transferOwner", {
                // todo
                description: "This action will preserve moderator status to the user and will give moderator s to the new owner as well.",
                args: {
                    newOwnerId: arg({ type: "BigInt" })
                },
                async resolve({ groupId }, { newOwnerId }, { prisma, userId }) {
                    await throwIfNoGroupAccess({ groupId, userId, prisma, level: "owner" });
                    await throwIfNoGroupAccess({ groupId, userId: newOwnerId, prisma, level: "member", who: "New owner" });
                    await prisma.group.update({
                        where: {
                            id: groupId
                        },
                        data: {
                            ownerId: newOwnerId,
                            members: {
                                update: {
                                    where: {
                                        groupId_userId: { groupId, userId: newOwnerId },
                                    },
                                    data: {
                                        isModerator: true
                                    }
                                }
                            }
                        }
                    });
                    return true;
                }
            });
            t.boolean("setInviteLinkStatus", {
                args: {
                    enabled: booleanArg()
                },
                async resolve({ groupId }, { enabled: inviteLinkEnabled }, { prisma, userId }) {
                    await throwIfNoGroupAccess({ groupId, userId, prisma, level: "moderator" });
                    const group = (await prisma.group.findOne({
                        where: {
                            id: groupId
                        }
                    }))!;
                    if (
                        (inviteLinkEnabled && group.inviteToken !== null) ||
                        (!inviteLinkEnabled && group.inviteToken === null)
                    ) {
                        return true;
                    }
                    await prisma.group.update({
                        where: {
                            id: groupId
                        },
                        data: {
                            inviteToken: inviteLinkEnabled ? uuidv1() : null
                        }
                    });
                    return true;
                }
            });
            t.field("changeName", {
                type: "Boolean",
                args: {
                    name: stringArg()
                },
                async resolve({ groupId }, { name }, { prisma, userId }) {
                    await throwIfNoGroupAccess({ groupId, userId, prisma, level: "owner" });
                    await prisma.group.update({
                        where: {
                            id: groupId
                        },
                        data: {
                            name
                        }
                    });
                    return true;
                }
            });
            // t.boolean("changeWallpapers", {
            //     args: 
            // })
        }
    })
];
