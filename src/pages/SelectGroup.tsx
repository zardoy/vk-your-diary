import { add, addCircle, enter, people } from "ionicons/icons";
import React, { useCallback, useRef, useState } from "react";

import { gql, useMutation, useQuery } from "@apollo/client";
import { RefresherEventDetail } from "@ionic/core";
import {
    IonActionSheet,
    IonAvatar,
    IonButton,
    IonContent,
    IonHeader,
    IonIcon,
    IonItem,
    IonItemOption,
    IonItemOptions,
    IonItemSliding,
    IonLabel,
    IonList,
    IonNote,
    IonPage,
    IonRefresher,
    IonRefresherContent,
    IonTitle,
    IonToolbar,
    useIonRouter
} from "@ionic/react";
import { vkGetParam } from "@zardoy/vk-params";

import { selectedGroupIdVar } from "../apollo/cache";
import { useAppDialogContext } from "../apollo/MyApolloProvider";
import { vkTapticEvent } from "../lib/vk-taptic-control";
import URLS from "../URLS";
import { GetJoinedGroups } from "./__generated__/GetJoinedGroups";
import { LeaveGroup, LeaveGroupVariables } from "./__generated__/LeaveGroup";
import { TransferOwnerAndLeaveGroup, TransferOwnerAndLeaveGroupVariables } from "./__generated__/TransferOwnerAndLeaveGroup";

// todo
const GROUP_LIMIT = 20;

const JOINED_GROUP_QUERY = gql`
    query GetJoinedGroups {
        joinedGroups {
            id
            name
            membersCount
            ownerId
            ownerSmallAvatar
        }
}
`;
const LEAVE_GROUP_MUTATION = gql`
    mutation LeaveGroup($groupId: Int!) {
        group(id: $groupId) {
            leaveForever
        }
    }
`;

const TRANSFER_OWNER_AND_LEAVE_GROUP_MUTATION = gql`
    mutation TransferOwnerAndLeaveGroup($groupId: Int!, $newOwnerId: String!) {
        group(id: $groupId) {
            transferOwner(newOwnerId: $newOwnerId)
            leaveForever
        }
    }
`;

interface Props {
}

let SelectGroup: React.FC<Props> = () => {
    const router = useIonRouter();
    const { addDialog } = useAppDialogContext();

    // STATE
    const [openAddGroupMenu, setOpenAddGroupMenu] = useState(false);

    /* PTR - Pull To Refresh */
    const PTRCompleteCallback = useRef(null as null | (() => void));

    const { data: joinedGroupsData, refetch: refetchGroups } = useQuery<GetJoinedGroups>(JOINED_GROUP_QUERY, {
        notifyOnNetworkStatusChange: true,
        onCompleted() {
            PTRCompleteCallback.current && PTRCompleteCallback.current();
            PTRCompleteCallback.current = null;
        },
        context: {
            loaderText: "Загрузка групп..."
        }
    });

    const [transferOwnerAndLeaveGroupMutate] = useMutation<TransferOwnerAndLeaveGroup, TransferOwnerAndLeaveGroupVariables>(TRANSFER_OWNER_AND_LEAVE_GROUP_MUTATION, {
        context: {
            loaderText: "Передача владельца и выход из группы..."
        }
    });

    const openGroup = useCallback((groupId: number) => {
        selectedGroupIdVar(groupId);
        router.push(URLS.GROUP_VIEW + "diary");
    }, [router]);

    const refreshGroupsForPtr = useCallback((event: CustomEvent<RefresherEventDetail>) => {
        PTRCompleteCallback.current = event.detail.complete;
        vkTapticEvent.ptrPull();
        refetchGroups();
    }, [refetchGroups]);

    const [leaveGroupMutate] = useMutation<LeaveGroup, LeaveGroupVariables>(LEAVE_GROUP_MUTATION, {
        update: (cache, { errors }) => {
            cache.reset();
        }
    });

    const leaveGroupHandle = useCallback((groupId: number) => {
        const leavingGroup = joinedGroupsData!.joinedGroups.find(({ id }) => id === groupId)!;
        const leaveConfirmHandle = () => leaveGroupMutate({ variables: { groupId } });
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
    }, [leaveGroupMutate, addDialog, joinedGroupsData]);

    return <IonPage>
        <IonHeader>
            <IonToolbar>
                <IonTitle>Группы</IonTitle>
            </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
            <IonRefresher slot="fixed" onIonRefresh={refreshGroupsForPtr}>
                <IonRefresherContent />
            </IonRefresher>
            <IonHeader collapse="condense">
                <IonToolbar>
                    <IonTitle size="large">Группы</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonActionSheet
                isOpen={openAddGroupMenu}
                header="Добавить группу"
                onDidDismiss={() => setOpenAddGroupMenu(false)}
                buttons={[
                    {
                        text: "Присоединится",
                        icon: enter,
                        handler() {
                            router.push(URLS.JOIN_GROUP);
                        }
                    },
                    {
                        text: "Создать свою",
                        icon: add,
                        handler() {
                            router.push(URLS.CREATE_GROUP);
                        }
                    },
                    {
                        text: "Отмена",
                        role: "cancel"
                    }
                ]}
            />
            {
                !joinedGroupsData ? <>
                    <IonButton expand="block" onClick={() => refetchGroups()}>Перезагрузить</IonButton>
                </> :
                    <IonList lines="full">
                        {
                            joinedGroupsData.joinedGroups.map(({ id: groupId, membersCount, name: groupName, ownerSmallAvatar }) => {
                                return (
                                    <IonItemSliding key={groupId}>
                                        <IonItem button onClick={() => openGroup(groupId)}>
                                            {ownerSmallAvatar &&
                                                <IonAvatar slot="start">
                                                    <img alt="Group owner's avatar" src={ownerSmallAvatar} />
                                                </IonAvatar>
                                            }
                                            <IonLabel>{groupName}</IonLabel>
                                            <IonNote slot="end">
                                                <IonIcon icon={people} /> {membersCount}
                                            </IonNote>
                                        </IonItem>

                                        <IonItemOptions side="end">
                                            <IonItemOption
                                                color="danger"
                                                onClick={() => leaveGroupHandle(groupId)}
                                            >
                                                Покинуть
                                            </IonItemOption>
                                        </IonItemOptions>
                                    </IonItemSliding>
                                );
                            })
                        }
                        {
                            joinedGroupsData.joinedGroups.length < GROUP_LIMIT &&
                            <IonItem button onClick={() => setOpenAddGroupMenu(true)}>
                                <IonIcon slot="start" icon={addCircle} style={{ color: "lime" }} />
                                <IonLabel>Добавить группу</IonLabel>
                            </IonItem>
                        }
                    </IonList>
            }
        </IonContent>
    </IonPage>;
};

export default SelectGroup;