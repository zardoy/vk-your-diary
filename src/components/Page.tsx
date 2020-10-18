import React, { ReactChild } from "react";

import { IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from "@ionic/react";

type ComponentProps = {
    noNavbar: true;
} | {
    noNavbar?: false,
    title: string,
    /**
     * Also can be used for positioning buttons on the left side of navbar
     * @default false
     */
    backButton?: boolean | ReactChild,
    /**
     * Enables large title, useful for pages
     * Note: if enabled, content need to be wrapped with this component
     * @default false
     */
    withLargeTitle?: boolean,
    subNavbar?: ReactChild;
};

/**
 * Simple wrapper around IonHeader
 */
let Page: React.FC<ComponentProps> = (props) => {
    //todo: allow destruct with undefined values

    return <IonPage>
        {
            !props.noNavbar && <IonHeader translucent>
                <IonToolbar>
                    {
                        props.backButton && <IonButtons slot="start">
                            {
                                props.backButton === true ? <IonBackButton /> : props.backButton
                            }
                        </IonButtons>
                    }
                    <IonTitle>{props.title}</IonTitle>
                </IonToolbar>
                {props.subNavbar}
            </IonHeader>
        }
        <IonContent fullscreen>
            {
                !props.noNavbar && props.withLargeTitle && <IonHeader collapse="condense" translucent>
                    <IonToolbar>
                        <IonTitle size="large">{props.title}</IonTitle>
                    </IonToolbar>
                </IonHeader>
            }
            {props.children}
        </IonContent>
    </IonPage>;
};

export default Page;