import React from "react";



import MainLoadingContent from "../components/MainLoadingContent";
import Page from "../components/Page";

interface Props {
}

let AppLoading: React.FC<Props> = () => {
    return <Page noNavbar>
        <MainLoadingContent />
    </Page>;
};

export default AppLoading;