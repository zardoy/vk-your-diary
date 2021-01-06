import React from "react";

import { useFormik } from "formik";

import { gql, useMutation } from "@apollo/client";
import { IonButton, IonInput, IonItem, IonLabel, IonList, IonTextarea } from "@ionic/react";
import { Autocomplete } from "@material-ui/lab";

import { Modal } from "../../components/Modal";
import { ModalController } from "../../lib/useModalController";
import { AddHomework, AddHomeworkVariables } from "./__generated__/AddHomework";
import { EditHomework, EditHomeworkVariables } from "./__generated__/EditHomework";

interface Props {
    controller: ModalController,
    editingHomeworkId: null | number,
}

const ADD_HOMEWORK_MUTATION = gql`
    mutation AddHomework($groupId: Int!, $subject: NonEmptyString!, $text: NonEmptyString!, $date: Date!) {
        group(id: $groupId) {
            homework {
                add(subject: $subject, text: $text, date: $date)
            }
        }
    }
`;

const EDIT_HOMEWORK_MUTATION = gql`
    mutation EditHomework($groupId: Int!, $homeworkId: Int!, $newSubject: NonEmptyString, $newText: NonEmptyString, $newDate: Date) {
        group(id: $groupId) {
            homework {
                edit(homeworkId: $homeworkId, newData: { date: $newDate, subject: $newSubject, text: $newText })
            }
        }
    }
`;

const testOptions = [
    "Предмет1",
    "Предмет2",
    "Предмет3",
    "Предмет4",
    "Предмет5",
];

let HomeworkEditor: React.FC<Props> = ({ controller, editingHomeworkId }) => {
    const [addHomeworkMutate] = useMutation<AddHomework, AddHomeworkVariables>(ADD_HOMEWORK_MUTATION, {
        context: {
            loaderText: "Добавление задания..."
        }
    });
    const [editHomeworkMutation] = useMutation<EditHomework, EditHomeworkVariables>(EDIT_HOMEWORK_MUTATION, {
        context: {
            loaderText: "Редактируем задание..."
        }
    });

    const { values, errors: formikErrors, handleChange, handleSubmit } = useFormik({
        initialValues: {
            subject: "",
            text: "",
            date: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split("T")[0]
        },
        onSubmit() { }
        //     onSubmit({ subject, text, date }) {
        //         if (editingHomeworkId) {
        //             editHomeworkMutation({
        //                 variables: {
        //                     newText: text,
        //                     newSubject: subject,
        //                     newDate: date,
        //                     homeworkId: editingHomeworkId,
        //                     groupId: selectedGroupId
        //                 },
        //                 update() {
        //                     // todo
        //                 }
        //             });
        //         } else {
        //             addHomeworkMutate({
        //                 variables: {
        //                     subject,
        //                     text,
        //                     date,
        //                     groupId: selectedGroupId
        //                 },
        //                 update() {

        //                 }
        //             });
        //         }

        //     }
    });

    {/* TODO show confirm if form was touched */ }
    return <Modal controller={controller} title={`${editingHomeworkId ? "Ред." : "Доб."} ДЗ`} /* autoClose={false} onClose={} */>
        <form onSubmit={handleSubmit}>
            <IonList>
                <IonItem>
                    <IonLabel position="floating">Предмет</IonLabel>
                    <Autocomplete options={testOptions} renderInput={
                        (props) => {
                            console.log(props);
                            return <IonInput
                                name="subject"
                                value={values["subject"]}
                                maxlength={50}
                                clearInput
                                required
                                onIonChange={handleChange}
                            />;
                        }} />
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
            <IonButton type="submit" expand="block">{editingHomeworkId ? "Отредактировать" : "Добавить"} ДЗ</IonButton>
        </form>
    </Modal>;
};

export default HomeworkEditor;