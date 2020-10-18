import { makeVar } from "@apollo/client";

export const selectedGroupIdVar = makeVar(-1);

/* PTR - Pull To Refresh */
export const onPtrCompleteVar = makeVar(null as null | (() => unknown));

export const groupSelectCallbackVar = makeVar(null as null | ((userId: number) => unknown));