import React, { useEffect } from 'react';
import { Redirect, Route } from 'react-router-dom';
import {
    IonApp,
    IonPage,
    IonRouterOutlet,
} from '@ionic/react';
import { IonReactHashRouter } from '@ionic/react-router';

import SelectGroup from './pages/SelectGroup';
import GroupTabs from './GroupTabs';
import URLS from './URLS';
import CreateGroup from './pages/CreateGroup';
import { useVKBridge } from './lib/vk-bridge-react-bindings';

const App: React.FC = () => {
    useVKBridge({ darkSchemeBodyClass: "dark" });

    // todo
    useEffect(() => {
        const onSubmitListener = (e: Event) => {
            e.preventDefault();
        };
        window.addEventListener("submit", onSubmitListener);
        return () => {
            window.removeEventListener("submit", onSubmitListener);
        };
    }, []);

    return <IonApp>
        <IonReactHashRouter>
            <IonPage>
                <IonRouterOutlet>
                    <Route path="/" exact render={() => <Redirect to={URLS.JOINED_GROUPS} />} />
                    <Route path={URLS.JOINED_GROUPS} exact component={SelectGroup} />
                    <Route path={URLS.CREATE_GROUP} exact component={CreateGroup} />
                    <Route path={URLS.JOIN_GROUP} exact component={SelectGroup} />
                    <Route path="/group/" component={GroupTabs} />
                </IonRouterOutlet>
            </IonPage>
        </IonReactHashRouter>
    </IonApp>;
};

export default App;
