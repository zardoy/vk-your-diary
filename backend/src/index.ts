import { ApolloServer, AuthenticationError } from "apollo-server-express";
import * as crypto from "crypto";
import * as dotenv from "dotenv";
import createExpress from "express";
import * as path from "path";
import { URLSearchParams } from "url";
import { VK } from "vk-io";

import { PrismaClient } from "@prisma/client";

import { schema } from "./schema";

dotenv.config({
    path: path.resolve(__dirname, "../prisma/.env")
});

[
    "VK_SECRET_KEY",
    "VK_SERVICE_TOKEN"
].map(environmentVariable => {
    if (!process.env[environmentVariable]) throw new TypeError(`Environment variable ${environmentVariable} is not provided.`);
});

if (process.env.NODE_ENV === "production" && !process.env.CORS_FRONTEND_DOMAIN) {
    throw new TypeError(`Environment variable CORS_FRONTEND_DOMAIN is not provided in prod.`);
}

// todo ERRORS

const prisma = new PrismaClient();

const vkIo = new VK({
    token: process.env.VK_SERVICE_TOKEN!,
    apiTimeout: 3000
});

const apollo = new ApolloServer({
    schema,
    context: ({ req }) => {
        //todo not safe
        if (process.env.NODE_ENV === "test" || process.env.NODE_ENV === "development") {
            return {
                userId: +(process.env.TEST_USER_ID || 35039),
                prisma,
                vkIo
            };
        };

        if (!req.headers.authorization) throw new AuthenticationError(`Authorization header must be defined in production!`);

        const vkParams = new URLSearchParams(req.headers.authorization);

        const SIGN_SECRET_URL_PARAM = vkParams.get("sign");
        vkParams.forEach((_paramValue: any, paramKey: string) => {
            if (!paramKey.startsWith("vk_")) vkParams.delete(paramKey);
        });
        vkParams.sort();

        const paramsHash = crypto
            .createHmac("sha256", process.env.VK_SECRET_KEY!)
            .update(vkParams.toString())
            .digest()
            .toString("base64")
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=$/, "");

        if (paramsHash !== SIGN_SECRET_URL_PARAM) throw new AuthenticationError(`Wrong sign param.`);

        const userId = +vkParams.get("user_id")!;
        if (!isFinite(userId)) throw new AuthenticationError(`user_id param is not a number: ${userId}`);

        return {
            userId,
            prisma,
            vkIo
        };
    }
});

const express = createExpress();
apollo.applyMiddleware({
    app: express,
    cors: process.env.NODE_ENV === "production" ? {
        origin: process.env.CORS_FRONTEND_DOMAIN,
        allowedHeaders: "authorization"
    } : undefined
});

const { PORT = 4000 } = process.env;

express.listen(PORT, () =>
    process.env.NODE_ENV === "development" && console.log(`🚀 GraphQL service ready at http://localhost:${PORT}/graphql`)
);