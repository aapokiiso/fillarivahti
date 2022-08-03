import { RedisClientType, RedisModules, RedisFunctions, RedisScripts } from '@redis/client';

export interface RedisClientProvider {
    getClient(): Promise<RedisClientType<RedisModules, RedisFunctions, RedisScripts>|null>;
}
