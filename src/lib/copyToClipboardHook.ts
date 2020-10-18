import { useCallback } from "react";

import copyToClipboardLib from "copy-to-clipboard";

import { useAppDialogContext } from "../apollo/MyApolloProvider";

export const useCopyToClipboard = () => {
    const { showToast } = useAppDialogContext();

    return useCallback((text: string) => {
        copyToClipboardLib(text) && showToast({
            // todo use icon instead of emoji
            message: "✅ Скопированно"
        });
    }, [showToast]);
};