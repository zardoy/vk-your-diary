/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetGroupHomeworkBack
// ====================================================

export interface GetGroupHomeworkBack_group_homeworkByDay {
  __typename: "Hometask";
  id: number;
  subject: string;
  text: string;
}

export interface GetGroupHomeworkBack_group {
  __typename: "GroupQuery";
  homeworkByDay: GetGroupHomeworkBack_group_homeworkByDay[];
}

export interface GetGroupHomeworkBack {
  group: GetGroupHomeworkBack_group;
}

export interface GetGroupHomeworkBackVariables {
  groupId: number;
  dateBack: string;
}
