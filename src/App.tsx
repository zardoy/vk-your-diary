import React from "react";
import { Redirect, Route } from "react-router-dom";

import { IonApp, IonPage, IonRouterOutlet, setupConfig } from "@ionic/react";
import { IonReactHashRouter } from "@ionic/react-router";

import MyApolloProvider from "./apollo/MyApolloProvider";
import GroupTabs from "./GroupTabs";
import { useVKBridge } from "./lib/vk-bridge-react-bindings";
import CreateGroup from "./pages/CreateGroup";
import JoinGroup from "./pages/JoinGroup";
import SelectGroup from "./pages/SelectGroup";
import URLS from "./URLS";

setupConfig({
    backButtonText: "назад"
});

const App: React.FC = () => {
    useVKBridge({ darkSchemeBodyClass: "dark" });

    return <IonApp>
        <IonReactHashRouter>
            <IonPage>
                {/* // todo split into 2 components */}
                <MyApolloProvider>
                    <IonRouterOutlet>
                        <Route path="/" exact render={() => <Redirect to={URLS.JOINED_GROUPS} />} />
                        <Route path={URLS.JOINED_GROUPS} exact component={SelectGroup} />
                        <Route path={URLS.CREATE_GROUP} exact component={CreateGroup} />
                        <Route path={URLS.JOIN_GROUP} exact component={JoinGroup} />
                        <Route path="/group/" component={GroupTabs} />
                    </IonRouterOutlet>
                </MyApolloProvider>
            </IonPage>
        </IonReactHashRouter>
    </IonApp>;
};

export default App;
