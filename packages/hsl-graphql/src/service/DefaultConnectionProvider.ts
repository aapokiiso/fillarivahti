import axios from 'axios';
import { AxiosInstance } from 'axios';
import Configuration from '../api/Configuration';
import ConnectionProvider from '../api/ConnectionProvider';

export default class DefaultConnectionProvider implements ConnectionProvider {
    configuration: Configuration;
    connection: AxiosInstance|null = null;

    constructor(
        configuration: Configuration,
    ) {
        this.configuration = configuration;
    }

    getConnection(): AxiosInstance {
        if (this.connection === null) {
            this.connection = axios.create({
                baseURL: this.configuration.getGraphqlEndpointUri(),
                method: 'POST',
                responseType: 'json',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }

        return this.connection;
    }
}
