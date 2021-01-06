import React, { useCallback } from "react";

import { useFormik } from "formik";

import { gql, useMutation } from "@apollo/client";
import { IonButton, IonInput, IonItem, IonLabel, IonList } from "@ionic/react";
import vkBridge from "@vkontakte/vk-bridge";
import { vkGetParam } from "@zardoy/vk-params";

import { useAppDialogContext } from "../../apollo/MyApolloProvider";
import Page from "../../components/Page";
import { JoinGroup, JoinGroupVariables } from "./__generated__/JoinGroup";

interface Props {
}

const JOIN_GROUP_MUTATION = gql`
    mutation JoinGroup($inviteToken: NonEmptyString!) {
        joinGroup(inviteToken: $inviteToken)
    }
`;

class TokenValidationError extends Error {
}

const getInviteToken = (tokenOrLink: string): string | null => {
    const tokenRegex = /\w{8}-\w{4}-11eb-\w{4}-\w{12}/;
    if (tokenRegex.test(tokenOrLink)) {// its token
        return tokenOrLink;
    } else {// maybe its a link
        let url: URL;
        try {
            url = new URL(tokenOrLink);
        } catch (err) {
            throw new TokenValidationError(`It's not either token or invite link.`);
        }
        if (url.hostname !== "vk.com") throw new TokenValidationError("Its not even a VK link");
        if (!url.pathname.startsWith(`/app${vkGetParam("app_id")}`)) throw new TokenValidationError(`This link doesn't belong to this vk app`);
        if (!url.hash.startsWith(`#invite`)) throw new TokenValidationError(`This link doesn't contain invite token`);
        const tokenFromLink = url.hash.slice(`#invite`.length);
        tokenRegex.lastIndex = 0;
        if (!tokenRegex.test(tokenFromLink)) throw new TokenValidationError(`Invalid invite token in link`);
        return tokenFromLink;
    }
};

let JoinGroupComponent: React.FC<Props> = () => {
    const { addDialog } = useAppDialogContext();

    const [joinGroupMutate] = useMutation<JoinGroup, JoinGroupVariables>(JOIN_GROUP_MUTATION, {
        context: { loaderText: "Поиск группы..." }
    });

    const { handleSubmit, values, handleChange } = useFormik({
        initialValues: {
            inviteLinkOrToken: ""
        },
        onSubmit({ inviteLinkOrToken }) {
            const inviteToken = getInviteToken(inviteLinkOrToken);
            if (!inviteToken) {
                addDialog({
                    type: "message",
                    title: "Ошибка",
                    message: "Поле не содержит пригласительной ссылки или токена"
                });
                return;
            }
            joinGroupMutate({
                variables: { inviteToken }
            });
        }
    });

    const scanQR = useCallback(async () => {
        try {
            const qrData: any = vkBridge.send("VKWebAppOpenQR");
            const inviteToken = getInviteToken(qrData.qr_data || qrData.code_data);
            if (!inviteToken) return;
            joinGroupMutate({
                variables: {
                    inviteToken
                }
            });
        } catch (err) {
            // todo error message
            addDialog({
                type: "message",
                message: "Не удалось отсканировать QR"
            });
        }
    }, [joinGroupMutate, addDialog]);

    return <Page title="Присоединиться к группе" backButton withLargeTitle>
        <IonButton
            expand="block"
            fill="outline"
            disabled={!vkBridge.supports("VKWebAppOpenQR")}
            onClick={scanQR}
        >
            Сканировать QR
            </IonButton>
        <form onSubmit={handleSubmit}>
            <IonList>
                <IonItem>
                    {/* TODO key-outline icon */}
                    <IonLabel position="floating">Ссылка или ключ приглашения группы</IonLabel>
                    <IonInput
                        clearInput
                        onIonChange={handleChange}
                        required
                        value={values["inviteLinkOrToken"]}
                        name="inviteLinkOrToken"
                        autoCapitalize="off"
                        enterkeyhint="enter"
                    />
                </IonItem>
            </IonList>
            <IonButton expand="block" type="submit">Войти в группу</IonButton>
        </form>
    </Page>;
};

export default JoinGroupComponent;