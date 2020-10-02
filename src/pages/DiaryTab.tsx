import React from "react";

import { gql, useQuery } from "@apollo/client";
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, useIonRouter } from "@ionic/react";

import { useSelectedGroupContext } from "../components/SelectedGroupContext";
import URLS from "../URLS";

interface Props {
}

const GET_GROUP_HOMEWORK = gql`
    query GetGroupHomework($groupId: Int!, $homeworkDate: String!) {
        group(id: $groupId) {
            homeworkByDay(date: $homeworkDate) {
                id
                subject
                text
            }
        }
    }
`;

let DiaryTab: React.FC<Props> = () => {
    const router = useIonRouter()
    const { groupId } = useSelectedGroupContext();
    
    if (groupId === null) router.push(URLS.SELECT_GROUP);
    
    const { data: homeworkData, loading } = useQuery(GET_GROUP_HOMEWORK);
    
    return <IonPage>
        <IonHeader>
            <IonToolbar>
                <IonTitle>Дневник</IonTitle>
            </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
            Дневник
        </IonContent>
    </IonPage>;
};

export default DiaryTab;