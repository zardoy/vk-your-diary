import React from "react";

import { IonSpinner } from "@ionic/react";

interface Props {
}

let FullContentLoader: React.FC<Props> = () => {
    return <div style={{ height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <IonSpinner />
    </div>;
};

export default FullContentLoader;