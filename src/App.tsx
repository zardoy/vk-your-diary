import React, { useEffect } from 'react';
import { Redirect, Route } from 'react-router-dom';
import {
    IonApp,
    IonPage,
    IonRouterOutlet,
} from '@ionic/react';
import { IonReactHashRouter } from '@ionic/react-router';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

import "./styles/index.scss";
import "./styles/theming.scss";

import SelectGroup from './pages/SelectGroup';
import GroupTabs from './GroupTabs';
import URLS from './URLS';
import CreateGroup from './pages/CreateGroup';

const App: React.FC = () => {
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
