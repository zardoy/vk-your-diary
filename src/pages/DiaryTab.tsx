import React from "react";

import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from "@ionic/react";

interface Props {
}

let DiaryTab: React.FC<Props> = () => {
    return <IonPage>
        <IonHeader>
            <IonToolbar>
                <IonTitle>Дневник</IonTitle>
            </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
            Дневник
        </IonContent>
    </IonPage>;
};

export default DiaryTab;