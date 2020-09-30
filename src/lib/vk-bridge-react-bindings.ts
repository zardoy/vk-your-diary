import { useEffect } from "react";

import vkBridge, { AppearanceSchemeType, VKBridgeSubscribeHandler } from "@vkontakte/vk-bridge";

interface HookParams {
    darkSchemeBodyClass: string | null | undefined;
}

// todo params can be changed
export const useVKBridge = ({ darkSchemeBodyClass }: HookParams) => {
    useEffect(() => {
        const updateAppTheme = (themeScheme: AppearanceSchemeType) => {
            if (!darkSchemeBodyClass) return;
            let isDarkTheme = themeScheme === "client_dark" || themeScheme === "space_gray";
            let { body } = document;
            if (isDarkTheme) body.classList.add(darkSchemeBodyClass);
            else body.classList.remove(darkSchemeBodyClass);
        };

        const listener: VKBridgeSubscribeHandler = (e) => {
            switch (e.detail.type) {
                case "VKWebAppUpdateConfig":
                    updateAppTheme(e.detail.data.scheme);
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