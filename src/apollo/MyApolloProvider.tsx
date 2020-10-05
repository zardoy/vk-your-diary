import React, { useCallback, useContext, useMemo, useState } from "react";

import { ApolloClient, ApolloLink, ApolloProvider, HttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { IonAlert, IonLoading } from "@ionic/react";
import vkBridge from "@vkontakte/vk-bridge";

import { operationErrorTitle } from "./errorMessages";

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

interface DialogContext {
    dialogs: DialogType[],
    addDialog: (dialog: DialogType) => void;
}

const dialogContext = React.createContext<DialogContext>(undefined as any);
const DialogContextProvider = dialogContext.Provider;

interface Props {
}

let MyApolloProvider: React.FC<Props> = ({ children }) => {
    const [loaderText, setLoaderText] = useState(null as null | string);
    const [dialogs, setDialogs] = useState([] as DialogType[]);

    const addDialog = useCallback((newDialog: DialogType) => {
        setDialogs(dialogs => [...dialogs, newDialog]);
    }, []);

    const closeLastDialog = useCallback(() => {
        setDialogs(dialogs => dialogs.slice(0, -1));
    }, []);

    const apolloClient = useMemo(() => {
        const httpLink = new HttpLink({
            uri: process.env.REACT_APP_GRAPHQL_ENDPOINT
        });

        const errorLink = onError(({ operation, networkError, graphQLErrors }) => {
            // todo low fix typings
            vkBridge.send("VKWebAppTapticNotificationOccurred", {
                type: "error"
            });
            const operationType = (operation.query.definitions[0] as any).operation;
            const isKnownOperation = operationType === "query" || operationType === "mutate";
            setLoaderText(null);
            addDialog({
                type: "message",
                title: isKnownOperation ? operationErrorTitle(operationType as any, operation.operationName) : "GraphQL Error",
                message:
                    graphQLErrors?.[0].message ??
                    networkError?.message ??
                    "Произошло что-то страшное..."
            });
        });

        // todo retry on Code №10 - Internal server error: Unknown error, try later

        const loaderLink = new ApolloLink((operation, forward) => {
            const operationContext = operation.getContext();
            if (operationContext.loaderText !== null)
                setLoaderText(operationContext.loaderText || "");
            // todo why does it call another query
            // observable.subscribe({
            //     complete: () => console.log("COMPLETE")
            // });
            const operationType = (operation.query.definitions[0] as any).operation;
            return forward(operation).map(data => {
                operationType === "mutation" && vkBridge.send("VKWebAppTapticNotificationOccurred", {
                    type: "success"
                });
                setLoaderText(null);
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
            loaderText &&
            <IonLoading
                isOpen={true}
                translucent
                message={loaderText}
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
            <DialogContextProvider value={{ dialogs, addDialog }}>
                {children}
            </DialogContextProvider>
        </ApolloProvider>
    </>;
};

export const useAppDialogContext = () => useContext(dialogContext);

export default MyApolloProvider;