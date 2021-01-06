const FAILED_TO = "Не удалось";
const FETCH = "получить";

const MESSAGES: Record<"query" | "mutate", Record<"add" | "full", Record<string, string>>> = {
    query: {
        add: {
            JoinedGroups: "список групп",
            GetGroupHomework: "получить ДЗ"
        },
        full: {}
    },
    mutate: {
        add: {
            AddHomework: "добавить задание",
            EditHomework: "редактировать задание",
            CreateGroup: "создать новую группу",
            JoinGroup: "присоединится к группе",
            LeaveGroup: "покинуть группу",
            TransferOwnerAndLeaveGroup: "передать владельца и покинуть группу"
        },
        full: {}
    }
};

export const operationErrorTitle = (type: "query" | "mutate", operationName: string): string => {
    return MESSAGES[type].full[operationName] ||
        (`${FAILED_TO}${type === "query" ? " " + FETCH : ""} ${MESSAGES[type].add[operationName] || `${type === "mutate" ? "отправить " : ""}данные`}`);
};