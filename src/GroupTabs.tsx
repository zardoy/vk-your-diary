import { IonTabs, IonRouterOutlet, IonTabBar, IonTabButton, IonIcon, IonLabel } from "@ionic/react";
import { triangle, ellipse } from "ionicons/icons";
import React from "react";
import { Route } from "react-router";
import DiaryTab from "./pages/DiaryTab";
import GroupTab from "./pages/GroupTab";

interface Props {
}

let GroupTabs: React.FC<Props> = () => {
    return <IonTabs>
        <IonRouterOutlet>
            <Route path="/group/diary" component={DiaryTab} />
            <Route path="/group/info" component={GroupTab} />
        </IonRouterOutlet>
        <IonTabBar slot="bottom">
            <IonTabButton tab="diary" href="/group/diary">
                <IonIcon icon={triangle} />
                <IonLabel>Дневник</IonLabel>
            </IonTabButton>
            <IonTabButton tab="group" href="/group/info">
                <IonIcon icon={ellipse} />
                <IonLabel>Группа</IonLabel>
            </IonTabButton>
        </IonTabBar>
    </IonTabs>;
};

export default GroupTabs;