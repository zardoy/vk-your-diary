const FAILED_TO = "Не удалось";
const FETCH = "получить";

const MESSAGES: Record<"query" | "mutate", Record<"add" | "full", Record<string, string>>> = {
    query: {
        add: {
            GetJoinedGroups: "список групп"
        },
        full: {}
    },
    mutate: {
        add: {
            CreateGroup: "создать новую группу",
            joinGroup: "присоединится к группе"
        },
        full: {}
    }
};

export const operationErrorTitle = (type: "query" | "mutate", operationName: string): string => {
    return MESSAGES[type].full[operationName] ||
        (`${FAILED_TO}${type === "query" ? " " + FETCH : ""} ${MESSAGES[type].add[operationName] || `${type === "mutate" ? "отправить " : ""}данные`}`);
};