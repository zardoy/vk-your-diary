declare namespace NodeJS {
    export interface ProcessEnv {
        DATABASE_URL: string,
        VK_SECRET_KEY: string,
        VK_SERVICE_TOKEN: string,
        NODE_ENV: "development" | "production" | "test"; //todo implement test
    }
}