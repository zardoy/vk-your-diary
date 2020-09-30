import { useFormik } from "formik";
import React, { useCallback } from "react";

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
    IonPage,
    IonTitle,
    IonToolbar
} from "@ionic/react";
import vkBridge from "@vkontakte/vk-bridge";
import { vkGetParam } from "@zardoy/vk-params";

import { useAppDialogContext } from "../apollo/MyApolloProvider";
import { joinGroup, joinGroupVariables } from "./__generated__/joinGroup";

interface Props {
}

const JOIN_GROUP_MUTATION = gql`
    mutation JoinGroup($inviteToken: String!) {
        joinGroup(inviteToken: $inviteToken)
    }
`;

const getInviteToken = (tokenOrLink: string): string | null => {
    const tokenRegex = /\w{8}-\w{4}-11eb-\w{4}-\w{12}/;
    if (tokenRegex.test(tokenOrLink)) {// its token
        return tokenOrLink;
    } else {// maybe its a link
        try {
            const url = new URL(tokenOrLink);
            if (url.hostname !== "vk.com") throw new TypeError("Its not even a VK link");
            if (!url.pathname.startsWith(`/app${vkGetParam("app_id")}`)) throw new TypeError(`This link doesn't belong to this vk app`);
            if (!url.hash.startsWith(`#invite`)) throw new TypeError(`This link doesn't contain invite token`);
            const tokenFromLink = url.hash.slice(`#invite`.length);
            tokenRegex.lastIndex = 0;
            if (!tokenRegex.test(tokenFromLink)) throw new TypeError(`Invalid invite token`);
            return tokenFromLink;
        } catch (err) {
            return null;
        }
    }
};

let JoinGroup: React.FC<Props> = () => {
    const { setDialog } = useAppDialogContext();

    const [joinGroupMutate] = useMutation<joinGroup, joinGroupVariables>(JOIN_GROUP_MUTATION, {
        context: { loaderText: "Поиск группы..." }
    });

    const { handleSubmit, values, handleChange } = useFormik({
        initialValues: {
            inviteLinkOrToken: ""
        },
        onSubmit({ inviteLinkOrToken }) {
            const inviteToken = getInviteToken(inviteLinkOrToken);
            if (!inviteToken) {
                setDialog({
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
            setDialog({
                type: "message",
                message: "Не удалось отсканировать QR"
            });
        }
    }, []);

    return <IonPage>
        <IonHeader>
            <IonButtons slot="start">
                <IonBackButton />
            </IonButtons>
            <IonToolbar>
                <IonTitle>Присоединиться к группе</IonTitle>
            </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
            <IonHeader collapse="condense" translucent>
                <IonToolbar>
                    <IonTitle size="large">Присоединиться к группе</IonTitle>
                </IonToolbar>
            </IonHeader>
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
                        <IonLabel position="stacked">Ссылка или ключ приглашения группы</IonLabel>
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
        </IonContent>
    </IonPage>;
};

export default JoinGroup;