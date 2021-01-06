import React, { useEffect, useRef } from "react";

import { bookOutline, peopleOutline } from "ionicons/icons";
import { Redirect, Route, useRouteMatch } from "react-router";

import { gql, useApolloClient, useReactiveVar } from "@apollo/client";
import { IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs, useIonRouter } from "@ionic/react";

import { groupSelectCallbackVar, selectedGroupIdVar } from "./apollo/localState";
import { PresentingElemProvider } from "./components/Modal";
import DiaryTab from "./pages/DiaryTab/DiaryTab";
import GroupTab from "./pages/GroupTab/GroupTab";
import InviteLink from "./pages/GroupTab/InviteLink";
import GroupMembers from "./pages/GroupTab/Members";
import { useTabUrls } from "./URLS";

interface Props {
}

let GroupTabs: React.FC<Props> = () => {
    const router = useIonRouter();
    const routerRef = useRef(null as null | HTMLIonRouterOutletElement);
    const selectedGroupId = +useRouteMatch<{ groupId: string; }>().params.groupId;
    const apolloClient = useApolloClient();

    const groupSelectCallback = useReactiveVar(groupSelectCallbackVar);

    useEffect(() => {
        const data = apolloClient.readFragment({
            id: `JoinedGroup:${selectedGroupId}`,
            fragment: gql`
                fragment VerifyJoinedGroup on JoinedGroup {
                    id
                }
            `
        });
        if (data) {
            selectedGroupIdVar(selectedGroupId);
        } else {
            router.push("/", "root", "replace");
        }
    }, [selectedGroupId]);

    const { TAB_URLS } = useTabUrls();

    return <IonTabs>
        <IonRouterOutlet ref={routerRef}>
            <PresentingElemProvider value={routerRef.current}>
                <Redirect exact from="/" to={TAB_URLS.diary.root} />
                <Route path={TAB_URLS.diary.root} exact>
                    <DiaryTab />
                </Route>

                <Route path={TAB_URLS.group.root}>
                    <GroupTab />
                </Route>
                <Route path={TAB_URLS.group.inviteLink} exact>
                    <InviteLink />
                </Route>
                <Route path={TAB_URLS.group.members} exact render={() =>
                    <GroupMembers onMemberSelect={groupSelectCallback || undefined} />
                } />
            </PresentingElemProvider>
        </IonRouterOutlet>
        <IonTabBar slot="bottom">
            <IonTabButton tab="diary" href={TAB_URLS.diary.root}>
                <IonIcon icon={bookOutline} />
                <IonLabel>Задания</IonLabel>
            </IonTabButton>
            <IonTabButton tab="group" href={TAB_URLS.group.root}>
                <IonIcon icon={peopleOutline} />
                <IonLabel>Группа</IonLabel>
            </IonTabButton>
        </IonTabBar>
    </IonTabs>;
};

export default GroupTabs;