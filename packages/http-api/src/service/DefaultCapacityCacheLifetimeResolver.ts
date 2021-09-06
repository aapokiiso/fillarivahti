import CapacityCacheLifetimeResolver, { DEFAULT_MARGIN_IN_SECONDS } from '../api/CapacityCacheLifetimeResolver';
import { Configuration } from '@aapokiiso/fillarivahti-capacity-repository';

export default class DefaultCapacityCacheLifetimeResolver implements CapacityCacheLifetimeResolver {
    configuration: Configuration;

    constructor(
        configuration: Configuration,
    ) {
        this.configuration = configuration;
    }

    getCacheLifetimeInSeconds(marginInSeconds: number = DEFAULT_MARGIN_IN_SECONDS): number {
        const granularityInMinutes = this.configuration.getGranularityInMinutes();
        const secondsInMinute = 60;

        const now = new Date();

        return granularityInMinutes * secondsInMinute
            - ((now.getMinutes() % granularityInMinutes) * secondsInMinute + now.getSeconds())
            + DEFAULT_MARGIN_IN_SECONDS;
    }
}
