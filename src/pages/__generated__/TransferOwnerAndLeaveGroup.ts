/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: TransferOwnerAndLeaveGroup
// ====================================================

export interface TransferOwnerAndLeaveGroup_group {
  __typename: "GroupMutation";
  /**
   * This action will preserve moderator status to the user and will give moderator s to the new owner as well.
   */
  transferOwner: boolean;
  leaveForever: boolean;
}

export interface TransferOwnerAndLeaveGroup {
  group: TransferOwnerAndLeaveGroup_group;
}

export interface TransferOwnerAndLeaveGroupVariables {
  groupId: number;
  newOwnerId: string;
}
