import { singleton } from 'tsyringe';
import { Configuration, DEFAULT_GRAPHQL_ENDPOINT_URI } from '../interface/Configuration';

@singleton()
export class EnvConfiguration implements Configuration {
    getGraphqlEndpointUri(): string {
        return process.env.GRAPHQL_ENDPOINT_URI || DEFAULT_GRAPHQL_ENDPOINT_URI;
    }

    getDigitransitSubscriptionKey(): string|undefined {
        return process.env.DIGITRANSIT_SUBSCRIPTION_KEY;
    }
}
