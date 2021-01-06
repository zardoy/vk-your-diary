import React, { useState } from "react";

import { Route } from "react-router";

import { gql, useQuery } from "@apollo/client";
import { isNetworkRequestInFlight } from "@apollo/client/core/networkStatus";

import { JoinedGroups } from "./__generated__/JoinedGroups";
import GroupTabs from "./GroupTabs";
import AppLoading from "./pages/AppLoading";
import CreateGroup from "./pages/GroupSelect/CreateGroup";
import GroupSelect from "./pages/GroupSelect/GroupSelect";
import JoinGroupComponent from "./pages/GroupSelect/JoinGroup";
import MainErrorFetch from "./pages/MainErrorFetch";
import URLS from "./URLS";

interface Props {
}

export const JOINED_GROUPS_QUERY = gql`
    query JoinedGroups {
        joinedGroups {
            id
            name
            membersCount
            ownerId
            ownerAvatar_50
        }
}
`;

let MainRouter: React.FC<Props> = () => {
    const [appLoaded, setAppLoaded] = useState(false);

    const groupsQuery = useQuery<JoinedGroups>(JOINED_GROUPS_QUERY, {
        context: {
            loaderText: null
        },
        notifyOnNetworkStatusChange: true,
        onCompleted() { setAppLoaded(true); }
    });

    return !appLoaded ?
        <Route path="/">
            {
                isNetworkRequestInFlight(groupsQuery.networkStatus) ?
                    <AppLoading /> :
                    <MainErrorFetch refetchCallback={() => groupsQuery.refetch()} />
            }
        </Route> :
        <>
            <Route path="/" exact render={() => <GroupSelect refetchGroups={() => groupsQuery.refetch()} />} />
            <Route path={URLS.CREATE_GROUP} exact component={CreateGroup} />
            <Route path={URLS.JOIN_GROUP} exact component={JoinGroupComponent} />
            {/* todo use route validation */}
            <Route path="/group/:groupId/" component={GroupTabs} />
        </>;
};

export default MainRouter;