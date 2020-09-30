import { gql, useMutation } from "@apollo/client";
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonInput, IonButton, IonListHeader, IonRadio, IonRadioGroup, IonToggle, IonTextarea, useIonRouter, IonButtons, IonBackButton } from "@ionic/react";
import { useFormik } from "formik";
import React from "react";
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
    const router = useIonRouter();

    const [mutateCreateGroup] = useMutation<CreateGroupMutation, CreateGroupVariables>(CREATE_GROUP_MUTATION, {
        async update(cache, { data }) {
            if (!data) return;
            // todo update cache
            await cache.reset();
        },
        onCompleted() {
            router.back();
        },
        context: {
            loaderText: "Создание группы..."
        }
    });

    const { handleSubmit, handleChange, values, setFieldValue, errors: formikErrors } = useFormik({
        initialValues: {
            groupName: "",
            description: "",
            isModerated: false,
            enableInviteLink: true
        },
        onSubmit: async (formData) => {
            console.log(formData);
            mutateCreateGroup({
                variables: formData
            });
        }
    });

    return <IonPage>
        <IonHeader>
            <IonToolbar>
                <IonButtons slot="start">
                    <IonBackButton />
                </IonButtons>
                <IonTitle>Создать группу</IonTitle>
            </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
            <IonHeader collapse="condense" translucent>
                <IonToolbar>
                    <IonTitle size="large">Создать группу</IonTitle>
                </IonToolbar>
            </IonHeader>
            <form onSubmit={handleSubmit}>
                <IonList lines="full">
                    <IonItem>
                        <IonLabel position="stacked">Название группы</IonLabel>
                        <IonInput maxlength={50} clearInput onIonChange={handleChange} required name="groupName" />
                    </IonItem>
                    <IonRadioGroup name="isModerated" value={values["isModerated"]} onIonChange={handleChange}>
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
                            checked={values["enableInviteLink"]}
                            onIonChange={e => setFieldValue("enableInviteLink", e.detail.checked)}
                        />
                    </IonItem>
                </IonList>
                <IonItem>
                    <IonTextarea
                        name="description"
                        placeholder="Описание (необязательно)"
                        value={values["description"]}
                        onIonChange={handleChange}
                        maxlength={400}
                    />
                </IonItem>
                <IonButton
                    expand="block"
                    disabled={Object.keys(formikErrors).length !== 0}
                    type="submit"
                >Создать группу</IonButton>
                {/* <p>
                    // todo
                    Всё это можно будет изменить в настройках группы.
                </p> */}
            </form>
        </IonContent>
    </IonPage>;
};

export default CreateGroup;