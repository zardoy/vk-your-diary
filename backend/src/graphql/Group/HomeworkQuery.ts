import { UserInputError } from "apollo-server-express";

import { arg, extendType, objectType } from "@nexus/schema";

import { throwIfNoGroupAccess } from "../../helpers";

export default [
    extendType({
        type: "GroupQuery",
        definition(t) {
            t.field("homework", {
                type: "HomeworkQuery",
                resolve: ({ groupId }) => ({ groupId })
            });
            t.field("knownSubjects", {
                type: "NonEmptyString",
                list: [true],
                async resolve({ groupId }, _args, { prisma, userId }) {
                    await throwIfNoGroupAccess({ groupId, userId, prisma, level: "member" });
                    return (await prisma.homework.findMany({
                        where: {
                            groupId
                        },
                        select: {
                            subject: true
                        },
                        distinct: "subject"
                    })).map(({ subject }) => subject);
                }
            });
        }
    }),
    objectType({
        name: "HomeworkQuery",
        definition(t) {
            t.field("byDay", {
                type: "Homework",
                list: [true],
                args: {
                    date: arg({ type: "Date" })
                },
                async resolve({ groupId }, { date: clientDate }, { prisma, userId }) {
                    await throwIfNoGroupAccess({ groupId, userId, prisma, level: "member" });
                    const date = new Date(clientDate);
                    if (isNaN(date.getTime())) throw new UserInputError("Invalid date.");
                    return await prisma.homework.findMany({
                        where: {
                            groupId: groupId,
                            givedTo: date
                        }
                    });
                }
            });
        }
    }),
    objectType({
        name: "Homework",
        definition(t) {
            // t.id("id", {
            //     resolve: ({ id }) => encodeIdType("HOMEWORK", id),
            // });
            t.model
                .id()
                .subject()
                .text()
                .createdBy()
                .updatedAt()
                .attachedFiles();
        }
    }),
    objectType({
        name: "File",
        definition(t) {
            // t.id("id", {
            //     resolve: ({ fileId }) => encodeIdType("FILE", fileId)
            // });
            t.model
                .id()
                .addedByUserId()
                .fileLink();
        }
    })
];