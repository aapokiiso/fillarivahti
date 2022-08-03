import { RedisClientProvider } from '../interface/RedisClientProvider';
import { createClient, RedisClientType, RedisModules, RedisFunctions, RedisScripts } from '@redis/client';
import { inject, singleton } from 'tsyringe';
import { Logger } from 'winston';
import { RedisConfiguration } from '../interface/RedisConfiguration';

@singleton()
export class DefaultRedisClientProvider implements RedisClientProvider {
    private client: RedisClientType<RedisModules, RedisFunctions, RedisScripts> | null = null;

    constructor(
        @inject('FillarivahtiHttpApi.RedisConfiguration') private redisConfig: RedisConfiguration,
        @inject('FillarivahtiHttpApi.Logger') private logger: Logger,
    ) {}

    async getClient(): Promise<RedisClientType<RedisModules, RedisFunctions, RedisScripts>|null> {
        if (this.client === null) {
            const host = this.redisConfig.getHost();
            const port = this.redisConfig.getPort();

            if (host && port) {
                this.client = createClient({
                    url: `redis://${host}:${port}`,
                });

                this.client.on('error', error => {
                    this.logger.error('Redis client error encountered.', {
                        error: error.message,
                        stack: error.stack,
                    });
                });

                await this.client.connect();
            }
        }

        return this.client;
    }
}
