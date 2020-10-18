import {
    BigIntResolver,
    DateResolver,
    NonEmptyStringResolver,
    NonNegativeIntResolver,
    URLResolver,
    UUIDResolver
} from "graphql-scalars";
import { nexusPrisma } from "nexus-plugin-prisma";
import * as path from "path";

import { asNexusMethod, connectionPlugin, makeSchema } from "@nexus/schema";

import * as types from "./graphql";

const customScalars = {
    userId: asNexusMethod(BigIntResolver, "userId"),
    date: asNexusMethod(DateResolver, "date"),
    uuid: asNexusMethod(UUIDResolver, "UUID"),
    // todo unsupported
    // void: asNexusMethod(VoidResolver, "void"),
    nonEmptyString: asNexusMethod(NonEmptyStringResolver, "nonEmptyString"),
    nonNegativeInt: asNexusMethod(NonNegativeIntResolver, "nonNegativeInt"),
    url: asNexusMethod(URLResolver, "URL")
};


export const schema = makeSchema({
    typegenAutoConfig: {
        sources: [
            {
                source: require.resolve("./context"),
                alias: "NexusContext",
            },
            {
                source: require.resolve(".prisma/client/index.d.ts"),
                alias: "prisma"
            },
            {
                source: require.resolve("./rootTypes"),
                alias: "RootTypes"
            }
        ],
        contextType: "NexusContext.Context"
    },
    outputs: {
        schema: path.join(__dirname, "../api.graphql"),
        typegen: path.join(__dirname, "./__generated__/schema-types.d.ts")
    },
    nonNullDefaults: {
        input: true,
        output: true
    },
    types: {
        ...types,
        ...customScalars
    },
    plugins: [
        nexusPrisma({
            paginationStrategy: "prisma",
        }),
        connectionPlugin({

        })
    ]
});