import React from "react";

import { alertCircleOutline } from "ionicons/icons";

import { IonButton, IonIcon } from "@ionic/react";

import CenterContent from "../components/CenterContent";
import Page from "../components/Page";

interface Props {
    refetchCallback: () => void;
}

let MainErrorFetch: React.FC<Props> = ({ refetchCallback }) => {
    return <Page title="Ошибка Загрузки">
        <CenterContent>
            <IonIcon style={{ fontSize: 56 }} icon={alertCircleOutline} />
            <IonButton size="small" onClick={refetchCallback}>Перезагрузить</IonButton>
        </CenterContent>
    </Page>;
};

export default MainErrorFetch;