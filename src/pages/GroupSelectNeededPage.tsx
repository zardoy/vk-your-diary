import React from "react";

import { IonButton, useIonRouter } from "@ionic/react";

import Page from "../components/Page";

interface Props {
}

let GroupSelectNeededPage: React.FC<Props> = () => {
    const { push: pushRoute } = useIonRouter();

    return <Page noNavbar>
        <div style={{
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            textAlign: "center"
        }}>
            Выбрана некорректная группа.
                <IonButton
                size="small"
                onClick={() => pushRoute("/", "root", "replace")}
            >На страницу выбора группы</IonButton>
        </div>
    </Page>;
};

export default GroupSelectNeededPage;