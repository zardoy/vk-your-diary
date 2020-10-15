import { VK } from "vk-io";

import { PrismaClient } from "@prisma/client";

export type Context = {
    userId: number,
    prisma: PrismaClient,
    vkIo: VK;
};