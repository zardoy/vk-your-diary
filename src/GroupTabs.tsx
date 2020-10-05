import { bookOutline, peopleOutline } from "ionicons/icons";
import React from "react";
import { Route } from "react-router";

import { IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from "@ionic/react";

import { useSafeSelectedGroupIdVar } from "./apollo/cache";
import DiaryTab from "./pages/DiaryTab";
import GroupNotSelectedPage from "./pages/GroupNotSelectedPage";
import GroupTab from "./pages/GroupTab";

interface Props {
}

let GroupTabs: React.FC<Props> = () => {
    const { groupSelectNeeded } = useSafeSelectedGroupIdVar();

    return <IonTabs>
        <IonRouterOutlet>
            {/* todo check */}
            {
                groupSelectNeeded ?
                    <Route path="/" component={GroupNotSelectedPage} /> :
                    <>
                        <Route path="/group/diary" component={DiaryTab} />
                        <Route path="/group/info" component={GroupTab} />
                    </>
            }
        </IonRouterOutlet>
        <IonTabBar slot="bottom">
            <IonTabButton tab="diary" href="/group/diary">
                <IonIcon icon={bookOutline} />
                <IonLabel>Задания</IonLabel>
            </IonTabButton>
            <IonTabButton tab="group" href="/group/info">
                <IonIcon icon={peopleOutline} />
                <IonLabel>Группа</IonLabel>
            </IonTabButton>
        </IonTabBar>
    </IonTabs>;
};

export default GroupTabs;