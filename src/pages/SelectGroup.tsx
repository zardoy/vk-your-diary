import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonItem,
    IonLabel,
    IonList,
    IonItemOption,
    IonItemOptions,
    IonItemSliding,
    IonAvatar,
    IonNote,
    IonIcon,
    IonButton,
    IonActionSheet,
    useIonRouter, IonRefresher, IonRefresherContent
} from "@ionic/react";
import { RefresherEventDetail } from "@ionic/core";
import React, { useCallback, useRef, useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { JoinedGroups } from "./__generated__/JoinedGroups";
import { add, people, addCircle, enter } from "ionicons/icons";
import URLS from "../URLS";
import { LeaveGroup, LeaveGroupVariables } from "./__generated__/LeaveGroup";

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
        leaveGroup(groupId: $groupId) 
    }
`;

interface Props {
}

let SelectGroup: React.FC<Props> = () => {
    const router = useIonRouter();

    // STATE
    const [openAddGroupMenu, setOpenAddGroupMenu] = useState(false);
    /* PTR - Pull To Refresh */
    const PTRCompleteCallback = useRef(null as null | (() => void));

    const { data, refetch: refetchGroups } = useQuery<JoinedGroups>(JOINED_GROUP_QUERY, {
        notifyOnNetworkStatusChange: true,
        onCompleted() {
            PTRCompleteCallback.current && PTRCompleteCallback.current();
            PTRCompleteCallback.current = null;
        },
        context: {
            loaderText: "Загрузка групп..."
        }
    });


    const openGroup = useCallback((groupId: number) => {

    }, []);

    const refreshGroupsForPtr = useCallback((event: CustomEvent<RefresherEventDetail>) => {
        PTRCompleteCallback.current = event.detail.complete;
        refetchGroups();
    }, []);

    const [leaveGroupMutate] = useMutation<LeaveGroup, LeaveGroupVariables>(LEAVE_GROUP_MUTATION);

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
                !data ? <>
                    <IonButton expand="block" onClick={() => refetchGroups()}>Перезагрузить</IonButton>
                </> :
                    <IonList lines="full">
                        {
                            data.joinedGroups.map(({ id: groupId, membersCount, name: groupName, ownerSmallAvatar }) => {
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
                                                onClick={() => leaveGroupMutate({ variables: { groupId } })}
                                            >
                                                Покинуть
                                            </IonItemOption>
                                        </IonItemOptions>
                                    </IonItemSliding>
                                );
                            })
                        }
                        {
                            data.joinedGroups.length < GROUP_LIMIT &&
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