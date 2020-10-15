import { ApolloError, ForbiddenError } from "apollo-server-express";

import { PrismaClient } from "@prisma/client";

const NOT_A_MEMBER_ERROR_MESSAGE = ` not a member of this group.`;

export const errorMessages = {
    delete: {
        zero: (itemName: string, expectedAction?: string) =>
            `There is no ${itemName} to remove! Probably, you already removed it or you didn't ${expectedAction || "create it before"}.`,
        moreThanOne: (itemName: string) => `Congrats! You just removed more than one ${itemName}!`,
    }
};

interface Query {
    query: string,
    params: any[];
};

export const deleteOneObjectFromDatabase = async ({ prisma, query, itemName, expectedAction }: { prisma: PrismaClient; query: Query; itemName: string; expectedAction?: string; }) => {
    let deleteCount = await prisma.$executeRaw(query.query, ...query.params);
    if (deleteCount === 0) throw new ApolloError(errorMessages.delete.zero(itemName, expectedAction));
    if (deleteCount > 1) throw new ApolloError(errorMessages.delete.moreThanOne(itemName));
    return true;
};

export const throwIfNoGroupAccess = async (
    // groupId - always id of THIS group
    { groupId, userId, prisma, level, who }:
        { groupId: number; userId: number; prisma: PrismaClient, level: "member" | "moderator" | "owner", who?: string; }
): Promise<void> => {
    if (!who) who = "You are";
    if (level === "owner") {
        const ownersGroup = await prisma.group.findOne({
            where: {
                id: groupId
            },
            select: {
                ownerId: true
            }
        });
        if (!ownersGroup || ownersGroup.ownerId !== userId) throw new ForbiddenError(`${who} not an owner of this group.`);
    } else {
        const joinedUserEntry = await prisma.member.findOne({
            where: {
                groupId_userId: {
                    userId,
                    groupId
                }
            },
            select: {
                isModerator: true
            }
        });
        if (!joinedUserEntry) throw new ForbiddenError(who + NOT_A_MEMBER_ERROR_MESSAGE);
        if (level === "moderator") {
            if (joinedUserEntry.isModerator) return;
            const usersGroup = (await prisma.group.findOne({
                where: {
                    id: groupId
                },
                select: {
                    isModerated: true
                }
            }))!;
            if (usersGroup.isModerated) throw new ForbiddenError(`${who} not a moderator of this group.`);
        }
    }
};