import Configuration, { DEFAULT_GRAPHQL_ENDPOINT_URI } from '../api/Configuration';

export default class EnvConfiguration implements Configuration {
    getGraphqlEndpointUri(): string {
        return process.env.GRAPHQL_ENDPOINT_URI || DEFAULT_GRAPHQL_ENDPOINT_URI;
    }

}
