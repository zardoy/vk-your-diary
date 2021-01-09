import React from "react";

import { useFormik } from "formik";
import { cog, exitOutline, link, paperPlaneOutline, peopleCircle, swapHorizontal } from "ionicons/icons";
import { useRouteMatch } from "react-router-dom";

import { gql, useApolloClient, useMutation, useQuery, useReactiveVar } from "@apollo/client";
import {
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonIcon,
    IonInput,
    IonItem,
    IonLabel,
    IonList,
    IonListHeader,
    IonModal,
    IonNote,
    IonTextarea,
    IonTitle,
    IonToolbar
} from "@ionic/react";
import { makeStyles } from "@material-ui/styles";

import { AcessLevel } from "../../__generated__/globalTypes";
import { useGroupAcessLevel } from "../../apollo/groupData";
import { useLeaveGroupMutation } from "../../apollo/leaveGroup";
import { selectedGroupIdVar } from "../../apollo/localState";
import BlockStrong from "../../components/BlockStrong";
import CenterContent from "../../components/CenterContent";
import FullContentLoader from "../../components/FullContentLoader";
import Page from "../../components/Page";
import SecondaryText from "../../components/SecondaryText";
import { useModalController } from "../../lib/useModalController";
import { GetGroupDetails, GetGroupDetailsVariables } from "./__generated__/GetGroupDetails";
import { GroupUpdateData, GroupUpdateDataVariables } from "./__generated__/GroupUpdateData";
import { SelectedGroupName } from "./__generated__/SelectedGroupName";

const useStyles = makeStyles({
    destructive: {
        color: `var(--ion-color-danger, #eb445a) !important`
    }
});

interface ComponentProps {
}

const GET_GROUP_DATA = gql`
    query GetGroupDetails($groupId: Int!) {
        group(id: $groupId) {
            acessLevel
            description
            inviteToken
        }
    }
`;

let GroupTab: React.FC<ComponentProps> = () => {
    const classes = useStyles();
    const routerMatch = useRouteMatch();

    const selectedGroupId = useReactiveVar(selectedGroupIdVar);
    const apolloClient = useApolloClient();

    const selectedGroupData = apolloClient.readFragment<SelectedGroupName>({
        id: `JoinedGroup:${selectedGroupId}`,
        fragment: gql`
            fragment SelectedGroupName on JoinedGroup {
                name
                membersCount
            }
        `
    });
    const groupName = selectedGroupData?.name ?? "Группа";

    const leaveGroup = useLeaveGroupMutation();

    const groupDetails = useQuery<GetGroupDetails, GetGroupDetailsVariables>(GET_GROUP_DATA, {
        variables: {
            groupId: selectedGroupId
        },
        context: {
            showError: false
        }
    });
    const noDetailedData = !groupDetails.data;

    const settingsModal = useModalController({});

    const LeftButton = <IonButtons slot="start">
        <IonButton
            onClick={settingsModal.openModal}
            disabled={!groupDetails.data || groupDetails.data.group.acessLevel === AcessLevel.MEMBER}
        >
            <IonIcon icon={cog} />
        </IonButton>
    </IonButtons>;

    return <Page title={groupName} withLargeTitle backButton={LeftButton}>
        {/* TODO inset styles */}
        <BlockStrong style={{
            // todo
            height: 60,
            marginTop: 10,
            padding: 5,
            textOverflow: "ellipsis"
        }}>
            {
                groupDetails.loading ? <FullContentLoader /> :
                    !groupDetails.data ?
                        <CenterContent>
                            <IonButton size="small" onClick={() => groupDetails.refetch()}>перезагрузить</IonButton>
                        </CenterContent> :
                        groupDetails.data.group.description ||
                        <CenterContent>
                            <SecondaryText style={{ padding: 0 }}>(нет описания)</SecondaryText>
                        </CenterContent>
                // todo-high add show more button
            }
            {/* <SecondaryText
                    style={{
                        padding: 0,
                        marginTop: 0,
                        marginBottom: -16,
                        fontSize: 14
                    }}
                >
                </SecondaryText> */}
        </BlockStrong>
        <IonList lines="full">
            <IonListHeader>Группа</IonListHeader>
            {/* todo use urls */}
            <IonItem disabled={noDetailedData} routerLink={`${routerMatch.path}/inviteLink`}>
                <IonIcon slot="start" icon={link} />
                <IonLabel>Пригласительная ссылка</IonLabel>
                <IonNote>{
                    groupDetails.data && (
                        groupDetails.data.group.inviteToken === null ? "Выкл." : "Вкл."
                    )
                }</IonNote>
            </IonItem>
            <IonItem disabled={noDetailedData} routerLink={`${routerMatch.path}/members`}>
                <IonIcon slot="start" icon={peopleCircle} />
                <IonLabel>Участники</IonLabel>
                <IonNote>{
                    selectedGroupData?.membersCount
                }</IonNote>
            </IonItem>
        </IonList>
        <IonList lines="full">
            <IonItem routerLink="/" routerDirection="root" routerOptions={{ unmount: true }}>
                <IonIcon icon={swapHorizontal} slot="start" />
                <IonLabel>Сменить группу</IonLabel>
            </IonItem>
        </IonList>
        <p></p>
        <IonList lines="full">
            <IonItem className={classes.destructive} button onClick={() => leaveGroup(selectedGroupId)}>
                <IonIcon slot="start" icon={exitOutline} />
                <IonLabel>Покинуть группу</IonLabel>
            </IonItem>
        </IonList>
    </Page>;
};

interface SettingsModalProps {
    initialValues: {
        name: string,
        description: string,
        moderated: boolean;
    },
    modalState: ReturnType<typeof useModalController>,
}

const SettingsModal: React.FC<SettingsModalProps> = ({ modalState, initialValues }) => {
    const selectedGroupId = useReactiveVar(selectedGroupIdVar);

    const acessLevel = useGroupAcessLevel();

    const [updateNameMutate] = useMutation<GroupUpdateData, GroupUpdateDataVariables>(gql`
        mutation GroupUpdateData($groupId: Int!, $updateName: Boolean!, $name: String!, $updateDescription: Boolean!, $description: String!, $updateLinkState: Boolean!, $linkState: Boolean!) {
                    group(id: $groupId) {
                    changeName(name: $name) @include(if: $updateName)
                updateDescription(description: $description) @include(if: $updateDescription)
                setInviteLinkStatus(enabled: $linkState) @include (if: $updateLinkState)
            }
        }
    `);

    const { values, handleChange, submitForm, touched } = useFormik({
        initialValues,
        async onSubmit() {
            await updateNameMutate({});
            modalState.closeModal();
        }
    });

    return <IonModal
        isOpen={modalState.isOpen}
        swipeToClose
        onDidDismiss={modalState.closeModal}
    >
        <IonHeader>
            <IonToolbar>
                <IonTitle>Настройки группы</IonTitle>
            </IonToolbar>
        </IonHeader>
        <IonContent>
            <IonList lines="full">
                <IonItem>
                    <IonLabel position="floating">Имя</IonLabel>
                    <IonInput
                        name="name"
                        disabled={!acessLevel || acessLevel !== AcessLevel.OWNER}
                        value={values["name"]}
                        onChange={handleChange}
                    />
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">Описание</IonLabel>
                    <IonTextarea
                        disabled={!acessLevel || acessLevel === AcessLevel.MEMBER}
                        name="description"
                        value={values["description"]}
                        onChange={handleChange}
                    />
                </IonItem>
                <IonItem button>
                    <IonIcon icon={paperPlaneOutline} />
                    <IonLabel>Передать владельца</IonLabel>
                </IonItem>
                <SecondaryText>

                </SecondaryText>
            </IonList>
            <IonButton onClick={submitForm} disabled={!touched}>Обновить</IonButton>
        </IonContent>
    </IonModal>;
};

export default GroupTab;