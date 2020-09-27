import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from "@ionic/react";
import React from "react";

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