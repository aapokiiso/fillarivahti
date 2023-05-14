import { singleton, inject } from 'tsyringe';
import axios from 'axios';
import { AxiosInstance } from 'axios';
import { Configuration } from '../interface/Configuration';
import { ConnectionProvider } from '../interface/ConnectionProvider';

@singleton()
export class DefaultConnectionProvider implements ConnectionProvider {
    connection: AxiosInstance | null = null;

    constructor(
        @inject('FillarivahtiHslGraphqlClient.Configuration') private configuration: Configuration,
    ) { }

    getConnection(): AxiosInstance {
        if (this.connection === null) {
            this.connection = axios.create({
                baseURL: this.configuration.getGraphqlEndpointUri(),
                method: 'POST',
                responseType: 'json',
                headers: {
                    'digitransit-subscription-key': this.configuration.getDigitransitSubscriptionKey(),
                },
            });
        }

        return this.connection;
    }
}
