import { singleton } from 'tsyringe';
import { RedisConfiguration, DEFAULT_REDIS_PORT } from '../interface/RedisConfiguration';

@singleton()
export class RedisEnvConfiguration implements RedisConfiguration {
    getHost(): string | undefined {
        return process.env.REDIS_HOST;
    }

    getPort(): number {
        return typeof process.env.REDIS_PORT !== 'undefined'
            ? Number(process.env.REDIS_PORT)
            : DEFAULT_REDIS_PORT;
    }
}
