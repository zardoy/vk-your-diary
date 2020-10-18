import { useCallback } from "react";

import { ApolloCache, gql, Reference, useMutation, useQuery } from "@apollo/client";
import { vkGetParam } from "@zardoy/vk-params";

import { JoinedGroups } from "../__generated__/JoinedGroups";
import { JOINED_GROUPS_QUERY } from "../MainRouter";
import { LeaveGroup, LeaveGroupVariables } from "./__generated__/LeaveGroup";
import { TransferOwnerAndLeaveGroup, TransferOwnerAndLeaveGroupVariables } from "./__generated__/TransferOwnerAndLeaveGroup";
import { useAppDialogContext } from "./MyApolloProvider";

// todo пересмотреть все error strategy

const LEAVE_GROUP_MUTATION = gql`
    mutation LeaveGroup($groupId: Int!) {
        group(id: $groupId) {
            leaveForever
        }
    }
`;

const TRANSFER_OWNER_AND_LEAVE_GROUP_MUTATION = gql`
    mutation TransferOwnerAndLeaveGroup($groupId: Int!, $newOwnerId: BigInt!) {
        group(id: $groupId) {
            transferOwner(newOwnerId: $newOwnerId)
            leaveForever
        }
    }
`;

const removeGroupFromCache = (cache: ApolloCache<any>, { context }: { context?: any; }) => {
    console.log(context);
    if (!context || !context.id) throw new TypeError(`Id must be passed to context in this operation!`);
    const idToRemove = context.id;
    cache.modify({
        fields: {
            joinedGroups(existingGroupsRef: Reference[], { readField }) {
                return existingGroupsRef.filter(groupRef => readField("id", groupRef) !== idToRemove);
            }
        }
    });
};

export const useLeaveGroupMutation = () => {
    const { data: joinedGroupsData } = useQuery<JoinedGroups>(JOINED_GROUPS_QUERY);

    const [transferOwnerAndLeaveGroupMutate] = useMutation<TransferOwnerAndLeaveGroup, TransferOwnerAndLeaveGroupVariables>(TRANSFER_OWNER_AND_LEAVE_GROUP_MUTATION, {
        update: removeGroupFromCache,
        context: {
            loaderText: "Передача владельца и выход из группы..."
        }
    });

    const [leaveGroupMutate] = useMutation<LeaveGroup, LeaveGroupVariables>(LEAVE_GROUP_MUTATION, {
        update: (cache, { context }) => { console.log(context); },
        context: {
            loaderText: "Выход из группы..."
        }
    });

    const { addDialog } = useAppDialogContext();

    return useCallback((groupId: number) => {
        const leavingGroup = joinedGroupsData!.joinedGroups.find(({ id }) => id === groupId)!;
        const leaveConfirmHandle = () => leaveGroupMutate({ variables: { groupId }, context: { id: groupId } });
        if (leavingGroup.membersCount === 1) {
            addDialog({
                // todo super dangerous
                type: "destruction",
                title: "Подтвердите действие",
                message: "Покинув группу, она удалится безвозвратно, включая все данные и ДЗ",
                confirmText: "Покинуть группу",
                confirmHandler: leaveConfirmHandle
            });
        } else if (+leavingGroup.ownerId === vkGetParam("user_id")) {
            // transferOwnerAndLeaveGroupMutate({
            //     variables: {
            //         groupId,
            //         newOwnerId: selectedOwnerId.toString()
            //     }
            // });
        } else {
            addDialog({
                type: "destruction",
                title: "Подтвердите действие",
                message: "Покинув группу, вы больше не сможете в неё вернуться без её пригласительной ссылки",
                confirmText: "Покинуть группу",
                confirmHandler: leaveConfirmHandle
            });
        }
    }, [leaveGroupMutate, transferOwnerAndLeaveGroupMutate, addDialog, joinedGroupsData]);
};