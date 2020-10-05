import React from "react";

import { gql, useQuery } from "@apollo/client";
import { IonItem, IonLabel, IonList, IonNote } from "@ionic/react";

import { useSafeSelectedGroupIdVar } from "../apollo/cache";
import { GetGroupHomework, GetGroupHomeworkVariables } from "./__generated__/GetGroupHomework";
import FullContentLoader from "./FullContentLoader";
import SecondaryText from "./SecondaryText";

interface Props {
    dateString: string;
}

const GET_GROUP_HOMEWORK = gql`
    query GetGroupHomework ($groupId: Int!, $homeworkDate: String!) {
        group(id: $groupId) {
            homeworkByDay(date: $homeworkDate) {
                id
                subject
                text
            }
        }
    }
`;

let DiaryDay: React.FC<Props> = ({ dateString }) => {
    const { selectedGroupId } = useSafeSelectedGroupIdVar();

    const { data, loading } = useQuery<GetGroupHomework, GetGroupHomeworkVariables>(GET_GROUP_HOMEWORK, {
        variables: {
            groupId: selectedGroupId,
            homeworkDate: dateString
        }
    });

    return loading ? <FullContentLoader /> :
        !data ? <p>reload content</p> :
            data.group.homeworkByDay.length === 0 ? <SecondaryText>Нет ДЗ на этот день.</SecondaryText>
                :
                <IonList>
                    {
                        data.group.homeworkByDay.map(({ id, subject, text }) => {
                            return <IonItem key={id} lines="full">
                                <IonLabel>{subject}</IonLabel>
                                <IonNote slot="end">{text}</IonNote>
                            </IonItem>;
                        })
                    }
                </IonList>;
};

export default DiaryDay;