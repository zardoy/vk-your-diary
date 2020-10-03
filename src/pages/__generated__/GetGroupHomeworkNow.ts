/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetGroupHomeworkNow
// ====================================================

export interface GetGroupHomeworkNow_group_homeworkByDay {
  __typename: "Hometask";
  id: number;
  subject: string;
  text: string;
}

export interface GetGroupHomeworkNow_group {
  __typename: "GroupQuery";
  homeworkByDay: GetGroupHomeworkNow_group_homeworkByDay[];
}

export interface GetGroupHomeworkNow {
  group: GetGroupHomeworkNow_group;
}

export interface GetGroupHomeworkNowVariables {
  groupId: number;
  dateNow: string;
}
