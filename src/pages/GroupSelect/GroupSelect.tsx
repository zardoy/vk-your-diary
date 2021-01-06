import React, { useCallback, useState } from "react";

import { add, addCircle, enter, people } from "ionicons/icons";

import { useApolloClient } from "@apollo/client";
import { createAnimation, RefresherEventDetail } from "@ionic/core";
import {
    IonActionSheet,
    IonAvatar,
    IonButton,
    IonIcon,
    IonItem,
    IonItemOption,
    IonItemOptions,
    IonItemSliding,
    IonLabel,
    IonList,
    IonNote,
    IonRefresher,
    IonRefresherContent,
    useIonRouter
} from "@ionic/react";

import { JoinedGroups } from "../../__generated__/JoinedGroups";
import { useLeaveGroupMutation } from "../../apollo/leaveGroup";
import { onPtrCompleteVar } from "../../apollo/localState";
import Page from "../../components/Page";
import { useModalController } from "../../lib/useModalController";
import { vkTapticEvent } from "../../lib/vk-taptic-control";
import { JOINED_GROUPS_QUERY } from "../../MainRouter";
import URLS from "../../URLS";
import HomeworkEditor from "../DiaryTab/HomeworkEditor";

// todo
const GROUP_LIMIT = 20;

interface RouterAnimationParams {
    baseEl: HTMLElement,
    direction: React.ComponentProps<typeof IonButton>["routerDirection"],
    mode: React.ComponentProps<typeof IonButton>["mode"],
    enteringEl: HTMLElement,
    leavingEl: HTMLElement,
}

const routerDiveAnimation = (_: any, { enteringEl, leavingEl, baseEl }: RouterAnimationParams) => {
    /* copied from F7 dive animation.
     Source: https://github.com/framework7io/framework7/blob/master/src/core/components/page/page-transitions/dive.less */

    /* IONIC CRINGATURA */

    baseEl.style.perspective = "1200px";

    const createRootAnimation = () => {
        return createAnimation()
            .keyframes([
                {
                    offset: 0,
                    opacity: 0,
                    transform: "translateZ(-150px)"
                },
                {
                    offset: 0.5,
                    opacity: 0
                },
                {
                    offset: 1,
                    opacity: 1,
                    transform: "translateZ(0)"
                }
            ]);
    };

    const enteringAnimation = createRootAnimation()
        .addElement(enteringEl);

    // It's important to create new instances of animation, otherwise direction of previous animation will be changed as well!
    const leavingAnimation = createRootAnimation()
        .direction("reverse")
        .addElement(leavingEl);

    const resultAnimation = createAnimation()
        .duration(500)
        .addAnimation([enteringAnimation, leavingAnimation]);

    return resultAnimation;
};

interface Props {
    refetchGroups: () => {};
}

let GroupSelect: React.FC<Props> = ({ refetchGroups }) => {
    const router = useIonRouter();
    const leaveGroup = useLeaveGroupMutation();

    const apolloClient = useApolloClient();

    const joinedGroups = apolloClient.readQuery<JoinedGroups>({
        query: JOINED_GROUPS_QUERY
    });

    // STATE
    const [openAddGroupMenu, setOpenAddGroupMenu] = useState(false);

    const refreshGroupsForPtr = useCallback((event: CustomEvent<RefresherEventDetail>) => {
        onPtrCompleteVar(event.detail.complete);
        vkTapticEvent.ptrPull();
        refetchGroups();
    }, [refetchGroups]);

    const modalController = useModalController({});

    // todo test refresher
    return <Page title="Группы" withLargeTitle backButton={<IonButton onClick={modalController.openModal}>modal</IonButton>}>
        <IonRefresher slot="fixed" onIonRefresh={refreshGroupsForPtr}>
            <IonRefresherContent />
        </IonRefresher>
        <HomeworkEditor controller={modalController} editingHomeworkId={null} />
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
            !joinedGroups ? <>
                <IonButton expand="block" onClick={() => refetchGroups()}>Перезагрузить</IonButton>
            </> :
                <IonList lines="full">
                    {
                        joinedGroups.joinedGroups.map(({ id: groupId, membersCount, name: groupName, ownerAvatar_50 }) => {
                            return (
                                <IonItemSliding key={groupId}>
                                    <IonItem
                                        button
                                        routerLink={`${URLS.GROUP_VIEW}${groupId}/diary`}
                                        routerAnimation={routerDiveAnimation}
                                    >
                                        {ownerAvatar_50 &&
                                            <IonAvatar slot="start">
                                                <img alt="Group owner's avatar" src={ownerAvatar_50} />
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
                                            onClick={() => leaveGroup(groupId)}
                                        >
                                            Покинуть
                                            </IonItemOption>
                                    </IonItemOptions>
                                </IonItemSliding>
                            );
                        })
                    }
                    {
                        joinedGroups.joinedGroups.length < GROUP_LIMIT &&
                        <IonItem button onClick={() => setOpenAddGroupMenu(true)}>
                            <IonIcon slot="start" icon={addCircle} style={{ color: "lime" }} />
                            <IonLabel>Добавить группу</IonLabel>
                        </IonItem>
                    }
                </IonList>
        }
    </Page>;
};

export default GroupSelect;