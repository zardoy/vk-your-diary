import { useCallback, useState } from "react";

type UpdateDialogStateCb = (newState: "opened" | "closed") => unknown;

export const useModalState = ({ onStateUpdate }: { onStateUpdate?: UpdateDialogStateCb; }) => {
    const [showModal, setShowModal] = useState(false);
    const updateModalState = useCallback((setOpenedState: boolean) => {
        setShowModal(setOpenedState);
        onStateUpdate?.(setOpenedState ? "opened" : "closed");
    }, [onStateUpdate]);
    return {
        isOpen: showModal,
        openModal: () => updateModalState(true),
        closeModal: () => updateModalState(false)
    };
};