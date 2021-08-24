declare let process : {
    env: {
        GRAPHQL_ENDPOINT: string,
        DB_NAME: string,
        DB_USER: string,
        DB_PASSWORD: string|undefined,
        DB_HOST: string|undefined,
        DB_PORT: number|undefined,
        DB_SOCKET_PATH: string|undefined,
        DB_LOGGING: boolean
    }
};

declare namespace NodeJS {
    export interface ProcessEnv {
        GRAPHQL_ENDPOINT: string,
        DB_NAME: string,
        DB_USER: string,
        DB_PASSWORD: string|undefined,
        DB_HOST: string|undefined,
        DB_PORT: number|undefined,
        DB_SOCKET_PATH: string|undefined,
        DB_LOGGING: string|undefined
    }
  }
