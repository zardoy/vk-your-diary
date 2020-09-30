import { HttpLink, ApolloLink, ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { IonAlert } from "@ionic/react";
import React, { useContext, useMemo, useState } from "react";
import { operationErrorTitle } from "./errorMessages";

type DialogType = null | {
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
    dialog: DialogType,
    setDialog: (dialog: DialogType) => void;
}

const dialogContext = React.createContext<DialogContext>(undefined as any);
const DialogContextProvider = dialogContext.Provider;

interface Props {
}

let MyApolloProvider: React.FC<Props> = ({ children }) => {
    const [dialog, setDialog] = useState(null as DialogType);

    const apolloClient = useMemo(() => {
        const httpLink = new HttpLink({
            uri: process.env.REACT_APP_GRAPHQL_ENDPOINT
        });

        const errorLink = onError(({ operation, networkError }) => {
            // todo low fix typings
            const operationType = (operation.query.definitions[0] as any).operation;
            const isKnownOperation = operationType === "query" || operationType === "mutate";
            setDialog({
                type: "message",
                title: isKnownOperation ? operationErrorTitle(operationType as any, operation.operationName) : "GraphQL Error",
                message: networkError ? networkError.message : "Произошло что-то странное..."
            });
        });

        const testLink = new ApolloLink((operation, forward) => {
            console.dir(operation);
            const observer = forward(operation);
            // console.log("COUNT", observer.);
            return observer;
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
                .concat(testLink)
                .concat(errorLink)
                .concat(httpLink),
            cache: new InMemoryCache()
        });

        return apolloClient;
    }, []);

    return <>
        {
            dialog &&
            (dialog.type === "message" ?
                <IonAlert
                    isOpen={true}
                    backdropDismiss={false}
                    header={dialog.title || process.env.REACT_APP_NAME}
                    message={dialog.message}
                    onDidDismiss={() => {
                        dialog.handler && dialog.handler();
                        setDialog(null);
                    }}
                    buttons={["OK"]}
                />
                : dialog.type === "destruction" ?
                    <IonAlert
                        isOpen={true}
                        backdropDismiss={false}
                        header={dialog.title}
                        message={dialog.message}
                        onDidDismiss={() => setDialog(null)}
                        buttons={[{
                            text: "Отмена",
                            role: "cancel"
                        }, {
                            text: dialog.confirmText,
                            handler: dialog.confirmHandler
                        }]}
                    /> : null)
        }
        <ApolloProvider client={apolloClient} >
            <DialogContextProvider value={{ dialog, setDialog }}>
                {children}
            </DialogContextProvider>
        </ApolloProvider>
    </>;
};

export const useAppDialogContext = () => useContext(dialogContext);

export default MyApolloProvider;