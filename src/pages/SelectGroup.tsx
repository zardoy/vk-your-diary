import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonList, IonItemOption, IonItemOptions, IonItemSliding, IonAvatar, IonNote, IonIcon, IonLoading, IonButton, IonAlert, IonActionSheet, useIonRouter } from "@ionic/react";
import React, { useCallback, useState } from "react";
import { gql, useQuery } from "@apollo/client";
import { JoinedGroups } from "./__generated__/JoinedGroups";
import { add, people, addCircle, enter } from "ionicons/icons";
import URLS from "../URLS";

// todo
const GROUP_LIMIT = 20;

const JOINED_GROUP_QUERY = gql`
query JoinedGroups {
    joinedGroups {
        id
        name
        membersCount
        ownerId
        ownerSmallAvatar
    }
}
`;

interface Props {
}

let SelectGroup: React.FC<Props> = () => {
    // STATE
    const [fetchGroupsErr, setFetchGroupsErr] = useState(null as null | string);
    const [openAddGroup, setOpenAddGroup] = useState(false);

    const { loading, data, refetch: refetchGroups } = useQuery<JoinedGroups>(JOINED_GROUP_QUERY, {
        onError: (err) => { console.log("error", err); setFetchGroupsErr(err.message); },
        notifyOnNetworkStatusChange: true
    });

    const { push: pushRoute } = useIonRouter();

    const openGroup = useCallback((groupId: number) => {

    }, []);

    return <IonPage>
        <IonHeader>
            <IonToolbar>
                <IonTitle>Группы</IonTitle>
            </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
            <IonHeader collapse="condense">
                <IonToolbar>
                    <IonTitle size="large">Группы</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonActionSheet
                isOpen={openAddGroup}
                header="Добавить группу"
                onDidDismiss={() => setOpenAddGroup(false)}
                buttons={[
                    {
                        text: "Присоединится",
                        icon: enter,
                        handler() {
                            pushRoute(URLS.JOIN_GROUP);
                        }
                    },
                    {
                        text: "Создать свою",
                        icon: add,
                        handler() {
                            pushRoute(URLS.CREATE_GROUP);
                        }
                    },
                    {
                        text: "Отмена",
                        role: "cancel"
                    }
                ]}
            />
            <IonAlert
                isOpen={fetchGroupsErr !== null}
                header="Не удалось получить список групп"
                message={String(fetchGroupsErr)}
                onDidDismiss={() => setFetchGroupsErr(null)}
                buttons={["OK"]}
            />
            {
                loading ? <IonLoading
                    isOpen={true}
                    translucent
                    message={'Загрузка групп...'}
                /> :
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
                                                <IonNote slot="end"><IonIcon icon={people} /> {membersCount}</IonNote>
                                            </IonItem>
                                            <IonItemOptions side="end">
                                                <IonItemOption color="danger" onClick={() => { }}>Покинуть</IonItemOption>
                                            </IonItemOptions>
                                        </IonItemSliding>
                                    );
                                })
                            }
                            {
                                data.joinedGroups.length < GROUP_LIMIT &&
                                <IonItem button onClick={() => setOpenAddGroup(true)}>
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