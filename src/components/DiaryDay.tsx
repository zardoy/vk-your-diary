import React from "react";

import { gql, useQuery, useReactiveVar } from "@apollo/client";
import { IonButton, IonItem, IonLabel, IonList, IonNote } from "@ionic/react";

import { selectedGroupIdVar } from "../apollo/localState";
import { GetGroupHomework, GetGroupHomeworkVariables } from "./__generated__/GetGroupHomework";
import CenterContent from "./CenterContent";
import FullContentLoader from "./FullContentLoader";
import SecondaryText from "./SecondaryText";

interface Props {
    dateString: string;
}

const GET_GROUP_HOMEWORK = gql`
    query GetGroupHomework ($groupId: Int!, $date: Date!) {
        group(id: $groupId) {
            homework {
                byDay(date: $date) {
                    id
                    subject
                    text
                }
            }
        }
    }
`;

let DiaryDay: React.FC<Props> = ({ dateString }) => {
    const selectedGroupId = useReactiveVar(selectedGroupIdVar);

    const { data, loading, refetch } = useQuery<GetGroupHomework, GetGroupHomeworkVariables>(GET_GROUP_HOMEWORK, {
        variables: {
            groupId: selectedGroupId,
            date: dateString
        },
        context: {
            loaderText: null
        }
    });

    if (loading) return <FullContentLoader />;

    if (!data) {
        return <CenterContent>
            <IonButton size="small" style={{ margin: "auto" }} onClick={() => refetch()}>Перезагрузить ДЗ</IonButton>
        </CenterContent>;
    }

    const homeworkData = data.group.homework.byDay;

    return homeworkData.length === 0 ?
        <SecondaryText style={{ textAlign: "center" }}>Нет ДЗ на этот день.</SecondaryText> :
        <IonList>
            {
                homeworkData.map(({ id, subject, text }) => {
                    return <IonItem key={id} lines="full">
                        <IonLabel>{subject}</IonLabel>
                        <IonNote slot="end">{text}</IonNote>
                    </IonItem>;
                })
            }
        </IonList>;
};

export default DiaryDay;