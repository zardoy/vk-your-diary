import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import {
    IonApp,
    IonPage,
    IonRouterOutlet,
    setupConfig,
} from '@ionic/react';
import { IonReactHashRouter } from '@ionic/react-router';

import SelectGroup from './pages/SelectGroup';
import GroupTabs from './GroupTabs';
import URLS from './URLS';
import CreateGroup from './pages/CreateGroup';
import { useVKBridge } from './lib/vk-bridge-react-bindings';
import MyApolloProvider from './apollo/MyApolloProvider';

setupConfig({
    // backButtonText: ""
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
                        <Route path={URLS.JOIN_GROUP} exact component={SelectGroup} />
                        <Route path="/group/" component={GroupTabs} />
                    </IonRouterOutlet>
                </MyApolloProvider>
            </IonPage>
        </IonReactHashRouter>
    </IonApp>;
};

export default App;
