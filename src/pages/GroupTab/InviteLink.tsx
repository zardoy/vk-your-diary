import "@ionic/react/css/core.css";
import "@webpunk/circular-text";

import React, { useCallback, useEffect, useRef } from "react";

import { copyOutline, reloadOutline, shareOutline } from "ionicons/icons";
import * as QRCode from "qrcode";

import { gql, useApolloClient, useMutation, useReactiveVar } from "@apollo/client";
import { IonIcon, IonItem, IonLabel, IonList, IonToggle } from "@ionic/react";
import { createStyles, makeStyles } from "@material-ui/styles";
import vkBridge from "@vkontakte/vk-bridge";
import { vkGetParam } from "@zardoy/vk-params";

import { AcessLevel } from "../../__generated__/globalTypes";
import { useGroupAcessLevel } from "../../apollo/groupData";
import { selectedGroupIdVar } from "../../apollo/localState";
import Page from "../../components/Page";
import { useCopyToClipboard } from "../../lib/copyToClipboardHook";
import { InviteLinkGroupDetails, InviteLinkGroupDetailsVariables } from "./__generated__/InviteLinkGroupDetails";
import { SetLinkActive, SetLinkActiveVariables } from "./__generated__/SetLinkActive";

interface StyleProps {
    canvasSize: number;
}

const useStyles = makeStyles(() => createStyles({
    qrContainer: {
        display: "flex",
        justifyContent: "center"
    },
    bottomList: {
        position: "absolute",
        bottom: 50,
        width: "100%"
    },
    buttonDestructive: {
        color: `var(--ion-color-danger, #eb445a)`
    }
}));

interface Props {
}

let InviteLink: React.FC<Props> = () => {
    const classes = useStyles();

    const apolloClient = useApolloClient();
    const selectedGroupId = useReactiveVar(selectedGroupIdVar);

    const groupDetails = apolloClient.readQuery<InviteLinkGroupDetails, InviteLinkGroupDetailsVariables>({
        query: gql`
            query InviteLinkGroupDetails($groupId: Int!) {
                group(id: $groupId) {
                    acessLevel
                    inviteToken
                }
            }
        `,
        variables: {
            groupId: selectedGroupId
        }
    });
    const inviteLink = !!groupDetails && `https://vk.com/app${vkGetParam("app_id")}#invite${groupDetails.group.inviteToken}`;

    const [mutateSetCanInvite] = useMutation<SetLinkActive, SetLinkActiveVariables>(gql`
        mutation SetLinkActive($groupId: Int!, $newStatus: Boolean!) {
            group(id: $groupId) {
                setInviteLinkStatus(enabled: $newStatus)
            }
        }
    `);

    const canvasRef = useRef(null as null | HTMLCanvasElement);
    useEffect(() => {
        if (!inviteLink) return;
        (async () => {
            const canvasEl = canvasRef.current!;
            try {
                await QRCode.toCanvas(canvasEl, inviteLink, {
                    // todo width based on screen
                    width: 200
                });
            } catch (err) {
                // todo err
            }
        })();
    }, [groupDetails]);

    const copyText = useCopyToClipboard();
    const copyLinkCallback = useCallback(() => {
        if (!inviteLink) return;
        copyText(inviteLink);
    }, [inviteLink]);

    const shareLink = useCallback(async () => {
        if (!inviteLink) return;
        await vkBridge.send("VKWebAppShare", {
            link: inviteLink
        });
    }, [inviteLink]);

    const switchLinkActive = useCallback((state: boolean) => {
        // todo ignore taptic
        // but if it takes more than 2 sec do not ignore
        mutateSetCanInvite({
            variables: {
                groupId: selectedGroupId,
                newStatus: state
            }
        });
    }, [selectedGroupId]);

    const acessLevel = useGroupAcessLevel();

    return <Page title="Пригласительная Ссылка" backButton withLargeTitle>
        <IonList lines="full">
            <IonItem>
                <IonToggle
                    slot="start"
                    disabled={!acessLevel || acessLevel === AcessLevel.MEMBER}
                    defaultChecked={!!inviteLink}
                    onIonChange={e => switchLinkActive(e.detail.checked)}
                />
                <IonLabel>Включить Ссылку</IonLabel>
            </IonItem>
            {/* INPUT WITH LINK AND COPY BUTTON ON THE RIGHT */}
        </IonList>
        <div>
            <div className={classes.qrContainer}>
                <canvas ref={canvasRef} />
            </div>
            <IonList className={classes.bottomList} lines="full">
                <IonItem button onClick={shareLink} disabled={!vkBridge.supports("VKWebAppShare")}>
                    <IonIcon slot="start" icon={shareOutline} />
                    <IonLabel>Поделиться</IonLabel>
                </IonItem>
                <IonItem button onClick={copyLinkCallback}>
                    <IonIcon slot="start" icon={copyOutline} />
                    <IonLabel>Скопировать</IonLabel>
                </IonItem>
                <IonItem button className={classes.buttonDestructive}>
                    <IonIcon slot="start" icon={reloadOutline} />
                    <IonLabel>Сгенерировать новую ссылку</IonLabel>
                </IonItem>
            </IonList>
        </div>
    </Page>;
};

export default InviteLink;