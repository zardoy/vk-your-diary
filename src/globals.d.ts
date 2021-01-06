// todo auto generate it from .env files

declare namespace NodeJS {
    export interface ProcessEnv {
        // todo rewrite like `REACT_APP_${varName}`
        REACT_APP_GRAPHQL_ENDPOINT: string,
        REACT_APP_GITHUB_ISSUES: string,
        REACT_APP_NAME: string, //exact value
        REACT_APP_VERSION: undefined | string;
    }
}