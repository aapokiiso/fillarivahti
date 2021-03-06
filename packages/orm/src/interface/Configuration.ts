export interface Configuration {
    getDatabase(): string | undefined;

    getUsername(): string | undefined;

    getPassword(): string | undefined;

    getHost(): string | undefined;

    getPort(): number | undefined;

    getSocketPath(): string | undefined;

    isLoggingEnabled(): boolean;

    isSslEnabled(): boolean;

    getSslKey(): string | undefined;

    getSslCert(): string | undefined;

    getSslCa(): string | undefined;
}
