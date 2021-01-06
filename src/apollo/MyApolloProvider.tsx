import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

import { ApolloClient, ApolloLink, ApolloProvider, HttpLink, InMemoryCache, useReactiveVar } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { IonAlert, IonLoading, IonToast, ToastButton } from "@ionic/react";
import vkBridge from "@vkontakte/vk-bridge";

import { operationErrorTitle } from "./errorMessages";
import { onPtrCompleteVar } from "./localState";

type DialogType = {
    type: "message",
    title?: string,
    message: string,
    handler?: () => any;
} | {
    type: "destruction",
    title: string,
    message: string,
    confirmText: string,
    confirmHandler: () => void;
};

type Toast = {
    message: string,
    /**
     * in ms
     * @default ```1000```
     */
    duration?: number,
    onClose?: () => unknown,
    /**
     * @default ```bottom```
     */
    position?: "bottom" | "top" | "middle",
    buttons?: ToastButton[];
};

interface DialogContext {
    dialogs: DialogType[],
    addDialog: (dialog: DialogType) => void,
    showToast: (toast: Toast) => void;
}

const dialogContext = React.createContext<DialogContext>(undefined as any);
const DialogContextProvider = dialogContext.Provider;

interface Props {
}

let MyApolloProvider: React.FC<Props> = ({ children }) => {
    const [loaderText, setLoaderText] = useState(null as null | string);
    const [dialogs, setDialogs] = useState([] as DialogType[]);

    const onPtrComplete = useReactiveVar(onPtrCompleteVar);
    const onPtrCompleteRef = useRef(null as null | (() => void));

    useEffect(() => {
        onPtrCompleteRef.current = onPtrComplete;
    }, [onPtrComplete]);

    const addDialog = useCallback((newDialog: DialogType) => {
        setDialogs(dialogs => [...dialogs, newDialog]);
    }, []);

    const closeLastDialog = useCallback(() => {
        setDialogs(dialogs => dialogs.slice(0, -1));
    }, []);

    const [toast, setToast] = useState(null as null | Toast);

    const apolloClient = useMemo(() => {
        const httpLink = new HttpLink({
            uri: process.env.REACT_APP_GRAPHQL_ENDPOINT
        });

        const onQueryComplete = () => {
            setLoaderText(null);
            const { current: ptrCallback } = onPtrCompleteRef;
            if (ptrCallback) {
                ptrCallback();
                onPtrCompleteVar(null);
            }
        };

        const errorLink = onError(({ operation, networkError, graphQLErrors }) => {
            onQueryComplete();
            vkBridge.send("VKWebAppTapticNotificationOccurred", {
                type: "error"
            });
            // todo low fix typings
            const operationType = (operation.query.definitions[0] as any).operation;
            const isKnownOperation = operationType === "query" || operationType === "mutate";
            if (operation.getContext().showError !== false) {
                addDialog({
                    type: "message",
                    title: isKnownOperation ?
                        operationErrorTitle(operationType as any, operation.operationName) : "GraphQL Error",
                    message:
                        graphQLErrors?.[0].message ??
                        networkError?.message ??
                        "Произошло что-то страшное..."
                });
            }
        });

        // todo retry on Code №10 - Internal server error: Unknown error, try later

        const loaderLink = new ApolloLink((operation, forward) => {
            const operationContext = operation.getContext();
            const { current: ptrCallback } = onPtrCompleteRef;
            if (operationContext.loaderText !== null && !ptrCallback)
                setLoaderText(operationContext.loaderText || "");
            // todo why does it call another query
            // observable.subscribe({
            //     complete: () => console.log("COMPLETE")
            // });
            const operationType = (operation.query.definitions[0] as any).operation;
            return forward(operation).map(data => {
                onQueryComplete();
                (!data.errors || data.errors.length === 0)
                    && operationType === "mutation"
                    && vkBridge.send("VKWebAppTapticNotificationOccurred", {
                        type: "success"
                    });
                return data;
            });
        });

        const authLink = setContext((_, { headers }) => {
            return {
                headers: {
                    ...headers,
                    authorization: window.location.search.slice(1)
                }
            };
        });

        const apolloClient = new ApolloClient({
            link: authLink
                .concat(loaderLink)
                .concat(errorLink)
                .concat(httpLink),
            cache: new InMemoryCache()
        });

        return apolloClient;
        // eslint-disable-next-line
    }, []);

    const lastDialog = dialogs.slice(-1)[0] || null;

    return <>
        {
            loaderText !== null &&
            <IonLoading
                isOpen={true}
                translucent
                message={loaderText}
            />
        }
        {
            toast && <IonToast
                isOpen={true}
                message={toast.message}
                position={toast.position ?? "bottom"}
                duration={toast.duration ?? 1000}
                buttons={toast.buttons}
                onDidDismiss={toast.onClose}
            />
        }
        {
            lastDialog &&
            (lastDialog.type === "message" ?
                <IonAlert
                    isOpen={true}
                    translucent
                    backdropDismiss={false}
                    header={lastDialog.title || process.env.REACT_APP_NAME}
                    message={lastDialog.message}
                    onDidDismiss={() => {
                        lastDialog.handler?.();
                        closeLastDialog();
                    }}
                    buttons={["OK"]}
                />
                : lastDialog.type === "destruction" ?
                    <IonAlert
                        isOpen={true}
                        translucent
                        backdropDismiss={false}
                        header={lastDialog.title}
                        message={lastDialog.message}
                        onDidDismiss={closeLastDialog}
                        buttons={(() => {
                            const dialogButtons = [
                                {
                                    text: lastDialog.confirmText,
                                    role: "destructive",
                                    handler: lastDialog.confirmHandler
                                },
                                {
                                    text: "Отмена",
                                    role: "cancel"
                                }
                            ];
                            return document.documentElement.classList.contains("md") ? dialogButtons.reverse() : dialogButtons;
                        })()}
                    /> : null)
        }
        <ApolloProvider client={apolloClient} >
            <DialogContextProvider value={{ dialogs, addDialog, showToast: setToast }}>
                {children}
            </DialogContextProvider>
        </ApolloProvider>
    </>;
};

export const useAppDialogContext = () => useContext(dialogContext);

export default MyApolloProvider;