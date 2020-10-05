export const forceReloadApp = () => {
    window.location.hash = "";
    window.location.reload();
}