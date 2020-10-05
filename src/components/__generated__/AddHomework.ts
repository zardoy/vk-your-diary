/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: AddHomework
// ====================================================

export interface AddHomework_group_homework {
  __typename: "HomeworkMutation";
  add: number;
}

export interface AddHomework_group {
  __typename: "GroupMutation";
  homework: AddHomework_group_homework;
}

export interface AddHomework {
  group: AddHomework_group;
}

export interface AddHomeworkVariables {
  groupId: number;
  subject: string;
  text: string;
  date: any;
}
