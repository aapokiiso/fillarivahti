export const DEFAULT_REDIS_PORT = 6379;

export interface RedisConfiguration {
    getHost(): string | undefined;

    getPort(): number;
}
