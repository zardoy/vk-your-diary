import { gql, useApolloClient, useReactiveVar } from "@apollo/client";

import { GetGroupAcessLevel, GetGroupAcessLevelVariables } from "./__generated__/GetGroupAcessLevel";
import { selectedGroupIdVar } from "./localState";

export const useGroupAcessLevel = () => {
    const selectedGroupId = useReactiveVar(selectedGroupIdVar);
    const apolloClient = useApolloClient();
    return apolloClient.readQuery<GetGroupAcessLevel, GetGroupAcessLevelVariables>({
        query: gql`
            query GetGroupAcessLevel($groupId: Int!) {
                group(id: $groupId) {
                    acessLevel
                }
            }
        `,
        variables: {
            groupId: selectedGroupId
        }
    })?.group.acessLevel;
};