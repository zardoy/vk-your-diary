CREATE TABLE "Group" (
    "id" SERIAL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "createdAt" DATE NOT NULL DEFAULT CURRENT_DATE,
    --groups can be without description
    "description" TEXT NOT NULL,
    --null if turned off in settings
    "inviteToken" TEXT,
    "isModerated" BOOLEAN NOT NULL,
    "advancedConfig" JSONB
    -- "apiKey" TEXT
);

-- CREATE TYPE "GroupActionType" AS ENUM('MEMBER_JOIN', 'MEMBER_LEAVE', 'NEW_INVITE_LINK', 'TASK_ADD', 'TASK_TEXT_EDIT', 'FILE_REMOVE', 'TASK_REMOVE');

-- CREATE TABLE "GroupLog" (-- for loging the group actions
--     "groupId" INTEGER NOT NULL REFERENCES "Group" ON DELETE CASCADE,
--     "actionType" "GroupActionType" NOT NULL,
--     "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
--       not safe
--     PRIMARY KEY("groupId", "timestamp");
-- todo: add json type field
-- );

CREATE TABLE "Member" (
    "groupId" INTEGER REFERENCES "Group" ON DELETE CASCADE,
    "userId" INTEGER,
    "joinDate" DATE NOT NULL DEFAULT CURRENT_DATE,
    "isModerator" BOOLEAN NOT NULL DEFAULT FALSE,
    -- user member preferences
    "trackHomeworkCompletion" BOOLEAN NOT NULL,
    "shareHomeworkCompletion" BOOLEAN NOT NULL,
    PRIMARY KEY("groupId", "userId")
);

CREATE TABLE "Homework" (
    "id" SERIAL PRIMARY KEY,
    "groupId" INTEGER NOT NULL REFERENCES "Group" ON DELETE CASCADE,
    "givedTo" DATE NOT NULL,
    "createdBy" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "subject" TEXT NOT NULL,
    "text" TEXT NOT NULL
);

CREATE TABLE "File" (
    "id" SERIAL PRIMARY KEY,
    "homeworkId" INTEGER NOT NULL REFERENCES "Homework" ON DELETE CASCADE,
    "fileLink" TEXT NOT NULL,
    -- if null - the same user who has added homework 
    "addedByUserId" INTEGER
);