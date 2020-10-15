// this file contains general groups logic
// all other files are splitted by access level

import { intArg, mutationField, queryField } from "@nexus/schema";

export default [
    queryField("group", {
        type: "GroupQuery",
        args: {
            id: intArg()
        },
        resolve(_root, { id }) {
            return { groupId: id };
        }
    }),
    mutationField("group", {
        type: "GroupMutation",
        args: {
            id: intArg()
        },
        async resolve(_root, { id }) {
            return { groupId: id };
        }
    })
];
