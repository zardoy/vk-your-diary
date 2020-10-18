import React from "react";

import { IonApp, IonButton } from "@ionic/react";

import { forceReloadApp } from "../lib/app-reload";
import CenterContent from "./CenterContent";
import Page from "./Page";

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
                <Page title="App Crashed">
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
                </Page>
            </IonApp>;
        }

        return this.props.children;
    }
}