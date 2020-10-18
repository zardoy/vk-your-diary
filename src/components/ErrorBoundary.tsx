import React from "react";

import { IonApp, IonButton, IonContent, IonHeader, IonPage } from "@ionic/react";

import { forceReloadApp } from "../lib/app-reload";
import CenterContent from "./CenterContent";

export default class extends React.Component<{}, { hasError: boolean; }> {
    state = {
        hasError: false
    };

    componentDidCatch() {
        this.setState({
            hasError: true
        });
        // todo report to server
    }

    render() {
        if (this.state.hasError) {
            return <IonApp>
                <IonPage>
                    <IonHeader>App Crashed</IonHeader>
                </IonPage>
                <IonContent>
                    <CenterContent>
                        <h3>Приложение поламалось</h3>
                        {/* todo button roles */}
                        <IonButton size="small" onClick={forceReloadApp}>
                            Перезагрузить приложение
                        </IonButton>
                        <IonButton size="small" href={process.env.REACT_APP_GITHUB_ISSUES} target="_blank">
                            Сообщить о проблеме
                        </IonButton>
                    </CenterContent>
                </IonContent>
            </IonApp>;
        }

        return this.props.children;
    }
}