/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetJoinedGroups
// ====================================================

export interface GetJoinedGroups_joinedGroups {
  __typename: "JoinedGroup";
  id: number;
  name: string;
  membersCount: number;
  ownerId: string;
  ownerSmallAvatar: string | null;
}

export interface GetJoinedGroups {
  joinedGroups: GetJoinedGroups_joinedGroups[];
}