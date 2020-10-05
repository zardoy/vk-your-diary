import React from "react";

import { IonButton, IonContent, IonPage } from "@ionic/react";

import { forceReloadApp } from "../lib/app-reload";

interface Props {
}

let GroupNotSelectedPage: React.FC<Props> = () => {
    return <IonPage>
        <IonContent fullscreen>
            <div style={{
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                textAlign: "center"
            }}>
                Группа не выбрана.
                <IonButton
                    size="small"
                    onClick={forceReloadApp}
                >Не перенаправляет на выбор группы?</IonButton>
            </div>
        </IonContent>
    </IonPage>;
};

export default GroupNotSelectedPage;