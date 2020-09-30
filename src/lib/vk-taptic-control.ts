import vkBridge from "@vkontakte/vk-bridge";

export const vkTapticEvent = {
    toggle: () => {
        vkBridge.send("VKWebAppTapticImpactOccurred", { style: "light" });
    },
    ptrPull: () => {
        vkBridge.send("VKWebAppTapticSelectionChanged");
    }
};