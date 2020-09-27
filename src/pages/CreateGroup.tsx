import { gql, useMutation } from "@apollo/client";
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonInput, IonAlert, IonButton, IonListHeader, IonRadio, IonRadioGroup, IonToggle, IonText, IonTextarea, IonLoading } from "@ionic/react";
import { useFormik } from "formik";
import React, { useState } from "react";
import { CreateGroupVariables, CreateGroup as CreateGroupMutation } from "./__generated__/CreateGroup";

interface Props {
}


const CREATE_GROUP_MUTATION = gql`
    mutation CreateGroup($isModerated: Boolean!, $groupName: String!, $description: String!, $enableInviteLink: Boolean!) {
        createGroup(isModerated: $isModerated, groupName: $groupName, description: $description, enableInviteLink: $enableInviteLink)
    }
`;
// todo formik

let CreateGroup: React.FC<Props> = () => {
    const [createNewGroupErr, setCreateNewGroupErr] = useState(null as null | string);

    const [createGroupMutation, { loading: creatingGroup }] = useMutation<CreateGroupMutation, CreateGroupVariables>(CREATE_GROUP_MUTATION, {
        onError: (err) => setCreateNewGroupErr(err.message),
        onCompleted(data) {
            alert("отстань.");
        }
    });

    const formik = useFormik({
        initialValues: {
            groupName: "",
            description: "",
            isModerated: false,
            enableInviteLink: true
        },
        onSubmit: async (formData) => {
            console.log(formData);
            createGroupMutation({
                variables: formData
            });
        }
    });

    return <IonPage>
        <IonHeader>
            <IonToolbar>
                <IonTitle>Создать группу</IonTitle>
            </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
            <IonHeader collapse="condense" translucent>
                <IonToolbar>
                    <IonTitle size="large">Создать группу</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonAlert
                isOpen={createNewGroupErr !== null}
                header="Не удалось создать новую группу"
                message={String(createNewGroupErr)}
                onDidDismiss={() => setCreateNewGroupErr(null)}
                buttons={["OK"]}
            />
            {creatingGroup && <IonLoading
                isOpen={true}
                translucent
                message={'Создание группы...'}
            />}
            <form onSubmit={formik.submitForm}>
                <IonList lines="full">
                    <IonItem>
                        <IonLabel position="stacked">Название группы</IonLabel>
                        <IonInput maxlength={50} clearInput onIonChange={formik.handleChange} required name="groupName" />
                    </IonItem>
                    <IonRadioGroup name="isModerated" value={formik.values["isModerated"]} onIonChange={formik.handleChange}>
                        <IonListHeader>
                            <IonLabel>Тип группы</IonLabel>
                        </IonListHeader>

                        <IonItem>
                            <IonLabel>Свободная</IonLabel>
                            <IonRadio slot="start" value={false} />
                        </IonItem>

                        <IonItem>
                            <IonLabel>Модерируемая</IonLabel>
                            <IonRadio slot="start" value={true} />
                        </IonItem>
                    </IonRadioGroup>
                    <IonItem>
                        <IonLabel>Пригласительная ссылка</IonLabel>
                        <IonToggle
                            name="enableInviteLink"
                            checked={formik.values["enableInviteLink"]}
                            onIonChange={e => formik.setFieldValue("enableInviteLink", e.detail.checked)}
                        />
                    </IonItem>
                </IonList>
                <IonItem>
                    <IonTextarea
                        name="description"
                        placeholder="Описание (необязательно)"
                        value={formik.values["description"]}
                        onIonChange={formik.handleChange}
                        maxlength={400}
                    />
                </IonItem>
                <IonButton
                    expand="block"
                    disabled={Object.keys(formik.errors).length !== 0}
                    type="submit"
                >Создать группу</IonButton>
                <p>
                    Всё это можно будет изменить в настройках группы.
                </p>
            </form>
        </IonContent>
    </IonPage >;
};

export default CreateGroup;