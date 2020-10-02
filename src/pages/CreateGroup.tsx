import { useFormik } from "formik";
import React from "react";

import { gql, useMutation } from "@apollo/client";
import {
    IonBackButton,
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonInput,
    IonItem,
    IonLabel,
    IonList,
    IonListHeader,
    IonPage,
    IonRadio,
    IonRadioGroup,
    IonTextarea,
    IonTitle,
    IonToggle,
    IonToolbar,
    useIonRouter
} from "@ionic/react";

import SecondaryText from "../components/SecondaryText";
import { CreateGroup as CreateGroupMutation, CreateGroupVariables } from "./__generated__/CreateGroup";

interface Props {
}


const CREATE_GROUP_MUTATION = gql`
    mutation CreateGroup($isModerated: Boolean!, $groupName: String!, $description: String!, $enableInviteLink: Boolean!) {
        createGroup(isModerated: $isModerated, groupName: $groupName, description: $description, enableInviteLink: $enableInviteLink)
    }
`;

const GROUP_IS_MODERATED_DESCRIPTION = {
    true: `В Модерируемых группах специально назначение участники (модераторы) смогут вносить изменения в ДЗ.`,
    false: `В открытых группах все её участники могут вносить изменения в ДЗ.`
};

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
                        <IonLabel position="floating">Название группы</IonLabel>
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
                    {/*
                    //@ts-ignore */}
                    <SecondaryText>{GROUP_IS_MODERATED_DESCRIPTION[values["isModerated"]]}</SecondaryText>
                </IonList>
                <IonList>
                    <IonItem>
                        <IonLabel>Пригласительная ссылка</IonLabel>
                        <IonToggle
                            name="enableInviteLink"
                            checked={values["enableInviteLink"]}
                            onIonChange={e => setFieldValue("enableInviteLink", e.detail.checked)}
                        />
                    </IonItem>
                    <IonItem>
                        <IonLabel position="floating">Описание группы (необязательно)</IonLabel>
                        <IonTextarea
                            name="description"
                            value={values["description"]}
                            onIonChange={handleChange}
                            maxlength={400}
                        />
                    </IonItem>
                </IonList>
                <SecondaryText>Всё это можно будет изменить позже в настройках.</SecondaryText>
                <IonButton
                    expand="block"
                    disabled={Object.keys(formikErrors).length !== 0}
                    type="submit"
                >Создать группу</IonButton>

            </form>
        </IonContent>
    </IonPage>;
};

export default CreateGroup;