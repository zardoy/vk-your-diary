/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateGroup
// ====================================================

export interface CreateGroup {
  /**
   * Return an invite token, if appropriate arg is true.
   */
  createGroup: string | null;
}

export interface CreateGroupVariables {
  isModerated: boolean;
  groupName: string;
  description: string;
  enableInviteLink: boolean;
}
