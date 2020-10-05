/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetGroupHomework
// ====================================================

export interface GetGroupHomework_group_homeworkByDay {
  __typename: "Hometask";
  id: number;
  subject: string;
  text: string;
}

export interface GetGroupHomework_group {
  __typename: "GroupQuery";
  homeworkByDay: GetGroupHomework_group_homeworkByDay[];
}

export interface GetGroupHomework {
  group: GetGroupHomework_group;
}

export interface GetGroupHomeworkVariables {
  groupId: number;
  homeworkDate: any;
}
