export const DEFAULT_GRAPHQL_ENDPOINT_URI = 'https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql';

interface Configuration {
    /**
     * HSL GraphQL API endpoint URI.
     */
    getGraphqlEndpointUri(): string;
}

export default Configuration;
