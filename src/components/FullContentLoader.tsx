import React from "react";

import { IonSpinner } from "@ionic/react";

import CenterContent from "./CenterContent";

interface Props {
}

let FullContentLoader: React.FC<Props> = () => {
    return <CenterContent>
        <IonSpinner />
    </CenterContent>;
};

export default FullContentLoader;