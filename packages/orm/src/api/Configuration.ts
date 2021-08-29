interface Configuration {
    getDatabase(): string|undefined;

    getUsername(): string|undefined;

    getPassword(): string|undefined;

    getHost(): string|undefined;

    getPort(): number|undefined;

    isLoggingEnabled(): boolean;
}

export default Configuration;
