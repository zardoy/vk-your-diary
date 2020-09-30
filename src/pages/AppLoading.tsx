import React from "react";

import { IonContent, IonFab, IonHeader, IonPage, IonSpinner, IonTitle, IonToolbar } from "@ionic/react";

let AppLoading: React.FC = () => {

    return <IonPage>
        <IonHeader>
            <IonToolbar>
                <IonTitle>Твой Дневник</IonTitle>
            </IonToolbar>
        </IonHeader>
        <IonContent>
            <IonFab horizontal="center" vertical="center">
                <IonSpinner />
            </IonFab>
        </IonContent>
    </IonPage>;
};

export default AppLoading;