import CapacityCacheLifetimeResolver from '../api/CapacityCacheLifetimeResolver';
import { Configuration } from '@aapokiiso/fillarivahti-capacity-repository';

export default class DefaultCapacityCacheLifetimeResolver implements CapacityCacheLifetimeResolver {
    configuration: Configuration;

    constructor(
        configuration: Configuration,
    ) {
        this.configuration = configuration;
    }

    resolve(ref: Date): number {
        const granularityInMinutes = this.configuration.getGranularityInMinutes();
        const secondsInMinute = 60;
        const millisInSecond = 1000;

        const expiresAt = ref.getTime() + granularityInMinutes * secondsInMinute * millisInSecond;
        const now = new Date();

        const cacheLifetime = Math.round((expiresAt - now.getTime()) / millisInSecond);

        return Math.max(cacheLifetime, 0);
    }
}
