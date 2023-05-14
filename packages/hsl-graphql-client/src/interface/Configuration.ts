export const DEFAULT_GRAPHQL_ENDPOINT_URI = 'https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql';

export interface Configuration {
    /**
     * HSL GraphQL API endpoint URI.
     */
    getGraphqlEndpointUri(): string;

    /**
     * HSL GraphQL API subscription key (granted by Digitransit).
     */
    getDigitransitSubscriptionKey(): string|undefined;
}
