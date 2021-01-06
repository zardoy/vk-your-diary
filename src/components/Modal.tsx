import React, { ComponentProps, ReactChild, useCallback, useContext } from "react";

import { IonButton, IonModal } from "@ionic/react";
import { makeStyles } from "@material-ui/styles";

import { ModalController } from "../lib/useModalController";
import { PageOrModalContent } from "./Page";

type ContextType = HTMLIonRouterOutletElement | null;

const presentingElemContext = React.createContext<ContextType>(undefined as any);
export const PresentingElemProvider = presentingElemContext.Provider;

// export let RouterWithModals: React.FC = ({ children }) => {
//     const routerOutletRef = useRef(null as null | HTMLIonRouterOutletElement);

//     return <IonRouterOutlet ref={routerOutletRef}>
//         <PresentingElemProvider value={routerOutletRef.current}>
//             {children}
//         </PresentingElemProvider>
//     </IonRouterOutlet>;
// };

const useIonRouterOutletRef = () => ({
    routerOutletRef: useContext(presentingElemContext) || undefined
});

type OnCloseModal = (controller: ModalController) => unknown;

// todo ts ! in types
const modalCloseButtonTexts/* : Record<Exclude<ModalComponentProps["backButtonType"], "none">, string> */ = {
    cancel: "Отмена",
    done: "Готово"
};

type ModalComponentProps = ({
    /**
     * @default ```cancel```
     */
    closeButtonType?: "none" | "cancel",
    onClose?: OnCloseModal;
} | {
    // todo doc it
    closeButtonType: "done",
    onClose: OnCloseModal;
}) & ({
    /**
     * If `true`, you need to close modal manually with controller
     * @param controller can be used to close modal
     */
    autoClose: false,
    onClose: OnCloseModal;
} | {
    autoClose?: true;
}) & {
    /**
     * @default true
     */
    cardStyle?: boolean,
    controller: ModalController,

    title: string,
    /**
     * @default false
     */
    withLargeTitle?: boolean,
    subNavbar?: ReactChild;
} & Pick<ComponentProps<typeof IonModal>, "keyboardClose" | "backdropDismiss">;

const useModalStyles = makeStyles({
    dismissButton: {
        fontWeight: "bold"
    }
});

/**
 * <Page> should be used as a children
 * @todo split into Modal and CardModal
 */
export let Modal: React.FC<ModalComponentProps> = ({
    controller,
    keyboardClose = true,
    backdropDismiss = false,
    cardStyle = true,
    onClose,
    children,
    closeButtonType = "cancel",
    autoClose = true,
    ...pageProps
}) => {
    const classes = useModalStyles();

    const { routerOutletRef } = useIonRouterOutletRef();

    const handleModalClose = useCallback(() => {
        if (autoClose) controller.closeModal();
        onClose?.(controller);
    }, [controller, onClose]);

    return <IonModal
        isOpen={controller.isOpen}
        onDidDismiss={handleModalClose}
        keyboardClose={keyboardClose}
        backdropDismiss={backdropDismiss}
        swipeToClose={cardStyle}
        presentingElement={cardStyle ? routerOutletRef : undefined}
    >
        <PageOrModalContent {...pageProps} backButton={
            closeButtonType === undefined || closeButtonType === "none" ? false :
                <IonButton onClick={handleModalClose} className={classes.dismissButton}>{modalCloseButtonTexts[closeButtonType]}</IonButton>
        }>
            {children}
        </PageOrModalContent>
        {/* {React.Children.map(children, (child) => {
            console.log(child);
            return child;
        })} */}
    </IonModal>;
};

//todo test component props as a child