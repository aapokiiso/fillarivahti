import axios from 'axios';
import { AxiosInstance } from 'axios';
import GraphqlConnectionProvider from '../api/GraphqlConnectionProvider';

export default class DefaultGraphqlConnectionProvider implements GraphqlConnectionProvider {
    endpointUri: string;
    connection: AxiosInstance|null = null;

    constructor(
        endpointUri: string,
    ) {
        this.endpointUri = endpointUri;
    }

    getConnection(): AxiosInstance {
        if (this.connection === null) {
            this.connection = axios.create({
                baseURL: this.endpointUri,
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
