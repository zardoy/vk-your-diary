/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetGroupHomeworkNext
// ====================================================

export interface GetGroupHomeworkNext_group_homeworkByDay {
  __typename: "Hometask";
  id: number;
  subject: string;
  text: string;
}

export interface GetGroupHomeworkNext_group {
  __typename: "GroupQuery";
  homeworkByDay: GetGroupHomeworkNext_group_homeworkByDay[];
}

export interface GetGroupHomeworkNext {
  group: GetGroupHomeworkNext_group;
}

export interface GetGroupHomeworkNextVariables {
  groupId: number;
  dateNext: string;
}
