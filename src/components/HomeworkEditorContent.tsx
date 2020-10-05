import { useFormik } from "formik";
import React from "react";

import { gql, useMutation } from "@apollo/client";
import { IonButton, IonInput, IonItem, IonLabel, IonList, IonTextarea } from "@ionic/react";

import { useSafeSelectedGroupIdVar } from "../apollo/cache";
import { AddHomework, AddHomeworkVariables } from "./__generated__/AddHomework";

interface Props {
}


const ADD_HOMEWORK_MUTATION = gql`
    mutation AddHomework($groupId: Int!, $subject: String!, $text: String!, $date: String!) {
        group(id: $groupId) {
            homework {
                add(subject: $subject, text: $text, date: $date)
            }
        }
    }
`;

let AddHomeworkContent: React.FC<Props> = () => {
    const { selectedGroupId } = useSafeSelectedGroupIdVar();

    const [addHomeworkMutate] = useMutation<AddHomework, AddHomeworkVariables>(ADD_HOMEWORK_MUTATION, {
        context: {
            loaderText: "Добавление задания..."
        }
    });

    const { values, errors: formikErrors, handleChange, handleSubmit } = useFormik({
        initialValues: {
            subject: "",
            text: "",
            date: new Date().setDate(new Date().getDate() + 1).toString()
        },
        onSubmit({ subject, text, date }) {
            addHomeworkMutate({
                variables: {
                    subject,
                    text,
                    date,
                    groupId: selectedGroupId
                },
                update() { }
            });
        }
    });

    return <form onSubmit={handleSubmit}>
        <IonList>
            <IonItem>
                <IonLabel position="floating">Предмет</IonLabel>
                <IonInput
                    name="subject"
                    value={values["subject"]}
                    maxlength={50}
                    clearInput
                    required
                    onIonChange={handleChange}
                />
            </IonItem>
            <IonItem>
                <IonLabel position="floating">Текст задания</IonLabel>
                <IonTextarea
                    name="text"
                    value={values["text"]}
                    maxlength={600}
                    required
                    onIonChange={handleChange}
                />
            </IonItem>
            <IonItem>
                <IonLabel position="fixed">Дата задания</IonLabel>
                <IonInput
                    name="date"
                    value={values["date"]}
                    onChange={handleChange}
                    type="date"
                />
            </IonItem>
        </IonList>
        <IonButton type="submit">Добавить ДЗ</IonButton>
    </form>;
};

export default AddHomeworkContent;