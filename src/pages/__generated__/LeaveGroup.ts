/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: LeaveGroup
// ====================================================

export interface LeaveGroup_group {
  __typename: "GroupMutation";
  leaveForever: boolean;
}

export interface LeaveGroup {
  group: LeaveGroup_group;
}

export interface LeaveGroupVariables {
  groupId: number;
}
