import React, { useCallback } from "react";

import { hammer } from "ionicons/icons";

import { gql, useMutation, useQuery, useReactiveVar } from "@apollo/client";
import {
    IonAvatar,
    IonIcon,
    IonItem,
    IonItemOption,
    IonItemOptions,
    IonItemSliding,
    IonLabel,
    IonList,
    IonRadio,
    IonRadioGroup
} from "@ionic/react";

import { AcessLevel } from "../../__generated__/globalTypes";
import { selectedGroupIdVar } from "../../apollo/localState";
import FullContentLoader from "../../components/FullContentLoader";
import Page from "../../components/Page";
import SecondaryText from "../../components/SecondaryText";
import { GetGroupMembers, GetGroupMembersVariables } from "./__generated__/GetGroupMembers";
import { KickMember, KickMemberVariables } from "./__generated__/KickMember";

interface Props {
    onMemberSelect?: (userId: number) => unknown;
}

const KICK_MEMBER_MUTATE = gql`
    mutation KickMember($groupId: Int!, $userId: BigInt!) {
        group(id: $groupId) {
            kickMember(memberUserIdToKick: $userId)
        }
    }
`;

// todo review pages to modal (but not this one)

let GroupMembers: React.FC<Props> = ({ onMemberSelect }) => {
    const selectedGroupId = useReactiveVar(selectedGroupIdVar);

    // todo use cache

    const groupQuery = useQuery<GetGroupMembers, GetGroupMembersVariables>(gql`
        query GetGroupMembers($groupId: Int!) {
            group(id: $groupId) {
                acessLevel
                members {
                    userId
                    fullName
                    joinDate
                    isModerator
                    avatar_50
                }
            }
        }
        `, {
        variables: {
            groupId: selectedGroupId
        },
        context: {
            loaderText: null
        }
    });
    const groupData = groupQuery.data?.group;

    const [kickMemberMutate] = useMutation<KickMember, KickMemberVariables>(KICK_MEMBER_MUTATE, {
        context: {
            loaderText: "Исключаем..."
        }
    });

    const kickGroupMember = useCallback((userId: number) => {
        kickMemberMutate({
            variables: {
                groupId: selectedGroupId,
                userId
            }
        });
    }, []);

    const canKickMembers = !!groupData &&
        // todo
        groupData.acessLevel === AcessLevel.MODERATOR;
    const isUserGroupOwner = !!groupData && groupData.acessLevel === AcessLevel.OWNER;

    // todo searchbar

    const pageTitle = onMemberSelect ? "Выберите Участника" : "Участники";

    const MemberItems = groupData && groupData.members.map(({ userId, isModerator, fullName, avatar_50 }) => {
        return <IonItemSliding key={userId}>
            {
                onMemberSelect && <IonRadio slot="start" value={userId} />
            }
            <IonItem
                button
                target="_blank"
                href={`https://vk.com/id${userId}`}
            >
                {
                    isModerator && <IonIcon slot="start" icon={hammer} />
                }
                {
                    avatar_50 &&
                    <IonAvatar slot="start">
                        <img src={avatar_50} alt="Avatar" />
                    </IonAvatar>
                }
                <IonLabel>{fullName}</IonLabel>
            </IonItem>
            {
                canKickMembers && <IonItemOptions>
                    <IonItemOption
                        disabled={isModerator && !isUserGroupOwner}
                        color="danger"
                        onClick={() => kickGroupMember(userId)}
                    >
                        Исключить
                    </IonItemOption>
                </IonItemOptions>
            }
        </IonItemSliding>;
    });

    return <Page title={pageTitle} backButton withLargeTitle>
        {
            groupQuery.loading ? <FullContentLoader /> :
                !MemberItems ? <SecondaryText>Вернитесь назад и перезагрузите данные</SecondaryText> :
                    <>
                        <IonList lines="full">
                            {
                                // todo implement button
                                onMemberSelect ?
                                    <IonRadioGroup
                                        onIonChange={({ detail: { value } }) => {
                                            onMemberSelect(+value);
                                        }}
                                    >
                                        {MemberItems}
                                    </IonRadioGroup> :
                                    MemberItems
                            }
                        </IonList>
                        {
                            canKickMembers && !isUserGroupOwner && groupData!.members.some(({ isModerator }) => isModerator) &&
                            <SecondaryText>
                                Помните, что модераторов группы может исключить только её владелец!
                            </SecondaryText>
                        }
                    </>
        }
    </Page>;
};

export default GroupMembers;