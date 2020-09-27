import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from "@ionic/react";
import React from "react";

interface Props {
}

let GroupTab: React.FC<Props> = () => {
    return <IonPage>
        <IonHeader>
            <IonToolbar>
                <IonTitle>Tab 1</IonTitle>
            </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
            <IonHeader collapse="condense">
                <IonToolbar>
                    <IonTitle size="large">test</IonTitle>
                </IonToolbar>
            </IonHeader>
        </IonContent>
    </IonPage>;
};

export default GroupTab;