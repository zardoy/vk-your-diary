import { makeVar, useReactiveVar } from "@apollo/client";

export const selectedGroupIdVar = makeVar(-1);

export const useSafeSelectedGroupIdVar = () => {
    const selectedGroupId = useReactiveVar(selectedGroupIdVar);
    const groupSelectNeeded = selectedGroupId < 0;
    return { selectedGroupId, groupSelectNeeded };
}; 