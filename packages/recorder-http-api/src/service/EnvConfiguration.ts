import { singleton } from 'tsyringe';
import { Configuration } from '../interface/Configuration';

@singleton()
export class EnvConfiguration implements Configuration {
    getBasicAuthUsername(): string | undefined {
        return process.env.BASIC_AUTH_USERNAME;
    }

    getBasicAuthPassword(): string | undefined {
        return process.env.BASIC_AUTH_PASSWORD;
    }
}
