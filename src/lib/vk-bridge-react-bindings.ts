import { useEffect } from "react";

import vkBridge, { VKBridgeSubscribeHandler } from "@vkontakte/vk-bridge";

interface HookParams {
    onUpdatePalette: (newSchema: "light" | "dark") => unknown;
}

export const useVKBridge = ({ onUpdatePalette }: HookParams) => {
    useEffect(() => {
        const listener: VKBridgeSubscribeHandler = (e) => {
            switch (e.detail.type) {
                case "VKWebAppUpdateConfig":
                    const { scheme } = e.detail.data;
                    onUpdatePalette(
                        scheme === "client_dark" || scheme === "space_gray" ? "dark" : "light"
                    );
                    break;
            }
        };

        vkBridge.send("VKWebAppInit");
        vkBridge.subscribe(listener);

        return () => {
            vkBridge.unsubscribe(listener);
        };
        // eslint-disable-next-line
    }, []);
};