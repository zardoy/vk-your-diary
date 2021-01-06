import React, { useEffect } from "react";

import { IonApp, IonPage, IonRouterOutlet, setupConfig } from "@ionic/react";
import { IonReactHashRouter } from "@ionic/react-router";
import { CssBaseline } from "@material-ui/core";

import MyApolloProvider from "./apollo/MyApolloProvider";
import ErrorBoundary from "./components/ErrorBoundary";
import MyThemeProvider from "./components/MyThemeProvider";
import MainRouter from "./MainRouter";

setupConfig({
    backButtonText: "назад"
});

const App: React.FC = () => {
    useEffect(() => {
        const errorListener = () => {
            // todo show toast
        };
        window.addEventListener("unhandledrejection", errorListener);
        return () => {
            window.removeEventListener("unhandledrejection", errorListener);
        };
    });

    return <ErrorBoundary>
        <CssBaseline />
        <MyThemeProvider>
            <IonApp>
                <IonReactHashRouter>
                    <IonPage>
                        {/* // todo split into 2 components */}
                        <MyApolloProvider>
                            <IonRouterOutlet>
                                <MainRouter />
                            </IonRouterOutlet>
                        </MyApolloProvider>
                    </IonPage>
                </IonReactHashRouter>
            </IonApp>
        </MyThemeProvider>
    </ErrorBoundary>;
};

export default App;
