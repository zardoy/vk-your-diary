const FAILED_TO = "Не удалось";
const FETCH = "получить";

const MESSAGES: Record<"query" | "mutate", Record<"add" | "full", Record<string, string>>> = {
    query: {
        add: {
            JoinedGroups: "список групп"
        },
        full: {}
    },
    mutate: {
        add: {
            createGroup: "создать новую группу",
            joinGroup: "присоединится к группе"
        },
        full: {}
    }
};

export const operationErrorTitle = (type: "query" | "mutate", operationName: string): string => {
    return MESSAGES[type].full[operationName] ||
        (`${FAILED_TO}${type === "query" ? " " + FETCH : ""} ${MESSAGES[type].add[operationName] || `${type === "mutate" ? "отправить " : ""}данные`}`);
};