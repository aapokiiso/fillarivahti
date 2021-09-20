import Configuration from '../api/Configuration';

export default class EnvConfiguration implements Configuration {
    getDatabase(): string | undefined {
        return process.env.DB_NAME;
    }

    getUsername(): string | undefined {
        return process.env.DB_USER;
    }

    getPassword(): string | undefined {
        return process.env.DB_PASSWORD;
    }

    getHost(): string | undefined {
        return process.env.DB_HOST;
    }

    getPort(): number | undefined {
        return typeof process.env.DB_PORT !== 'undefined'
            ? Number(process.env.DB_PORT)
            : undefined;
    }

    getSocketPath(): string | undefined {
        return process.env.DB_SOCKET_PATH;
    }

    isLoggingEnabled(): boolean {
        return process.env.DB_LOGGING === '1';
    }

}
