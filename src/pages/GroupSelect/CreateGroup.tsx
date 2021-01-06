import React from "react";

import { useFormik } from "formik";

import { gql, Reference, useMutation } from "@apollo/client";
import {
    IonButton,
    IonInput,
    IonItem,
    IonLabel,
    IonList,
    IonListHeader,
    IonRadio,
    IonRadioGroup,
    IonTextarea,
    IonToggle,
    useIonRouter
} from "@ionic/react";
import { vkGetParam } from "@zardoy/vk-params";

import Page from "../../components/Page";
import SecondaryText from "../../components/SecondaryText";
import { CreateGroup as CreateGroupMutation, CreateGroupVariables } from "./__generated__/CreateGroup";
import { InitialGroupData, InitialGroupDataVariables } from "./__generated__/InitialGroupData";
import { NewJoinedGroup } from "./__generated__/NewJoinedGroup";

interface Props {
}

const CREATE_GROUP_MUTATION = gql`
    mutation CreateGroup($moderated: Boolean!, $name: NonEmptyString!, $description: String!, $enableInviteLink: Boolean!) {
        createGroup(name: $name, moderated: $moderated, description: $description, enableInviteLink: $enableInviteLink) {
            id
            inviteToken
            avatar_50
        }
    }
`;

const GROUP_IS_MODERATED_DESCRIPTION = {
    true: `В Модерируемых группах специально назначение участники (модераторы) смогут вносить изменения в ДЗ.`,
    false: `В открытых группах все её участники могут вносить изменения в ДЗ.`
};

let CreateGroup: React.FC<Props> = () => {
    const router = useIonRouter();

    const { handleSubmit, handleChange, values, setFieldValue, errors: formikErrors } = useFormik({
        initialValues: {
            name: "",
            description: "",
            moderated: false,
            enableInviteLink: true
        },
        onSubmit: async (formData) => {
            createGroupMutate({
                variables: formData,
                context: formData
            });
        }
    });

    const [createGroupMutate] = useMutation<CreateGroupMutation, CreateGroupVariables>(CREATE_GROUP_MUTATION, {
        // todo better caching avatars
        async update(cache, { data, context }) {
            if (!data) {
                await cache.reset();
                return;
            }
            console.log("context", context);
            const { createGroup: { id: groupId, inviteToken, avatar_50 } } = data;
            const { moderated: isModerator, name, description } = context as typeof values;
            cache.modify({
                // todo graphql apollo service do not show existing
                fields: {
                    joinedGroups(joinedGroupRefs: Reference[], { readField }) {
                        const newJoinedGroupRef = cache.writeFragment<NewJoinedGroup>({
                            fragment: gql`
                                fragment NewJoinedGroup on JoinedGroup {
                                    id
                                    isModerator
                                    membersCount
                                    name
                                    ownerId
                                    ownerAvatar_50
                                }
                            `,
                            data: {
                                __typename: "JoinedGroup",
                                id: groupId,
                                isModerator,
                                membersCount: 1,
                                name,
                                ownerId: vkGetParam("user_id"),
                                ownerAvatar_50: avatar_50
                            }
                        });
                        // todo low safety check
                        return [...joinedGroupRefs, newJoinedGroupRef];
                    }
                }
            });
            cache.writeQuery<InitialGroupData, InitialGroupDataVariables>({
                query: gql`
                    query InitialGroupData($groupId: Int!) {
                        group(id: $groupId) {
                            description
                            inviteToken
                        }
                    }
                `,
                variables: {
                    groupId: groupId
                },
                data: {
                    group: {
                        __typename: "GroupQuery",
                        inviteToken: inviteToken,
                        description
                    }
                }
            });
        },
        onCompleted() {
            router.back();
        },
        context: {
            loaderText: "Создание группы..."
        }
    });

    return <Page title="Создать группу" backButton withLargeTitle>
        <form onSubmit={handleSubmit}>
            <IonList lines="full">
                <IonItem>
                    <IonLabel position="floating">Название группы</IonLabel>
                    <IonInput
                        value={values["name"]}
                        maxlength={50}
                        clearInput
                        onIonChange={handleChange}
                        required
                        name="name"
                    />
                </IonItem>
                <IonRadioGroup name="moderated" value={values["moderated"]} onIonChange={handleChange}>
                    <IonListHeader>
                        Тип группы
                        </IonListHeader>

                    <IonItem>
                        <IonRadio slot="start" value={false} />
                        <IonLabel>Свободная</IonLabel>
                    </IonItem>

                    <IonItem>
                        <IonRadio slot="start" value={true} />
                        <IonLabel>Модерируемая</IonLabel>
                    </IonItem>
                </IonRadioGroup>
                {/*
                    //@ts-ignore */}
                <SecondaryText>{GROUP_IS_MODERATED_DESCRIPTION[values["moderated"]]}</SecondaryText>
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
            <SecondaryText>Всё это можно будет изменить в настройках позже.</SecondaryText>
            <IonButton
                expand="block"
                disabled={Object.keys(formikErrors).length !== 0}
                type="submit"
            >Создать группу</IonButton>

        </form>
    </Page>;
};

export default CreateGroup;