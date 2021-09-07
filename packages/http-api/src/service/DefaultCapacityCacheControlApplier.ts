import { Capacity } from '@aapokiiso/fillarivahti-capacity-repository';
import { Response } from 'express';
import CapacityCacheControlApplier from '../api/CapacityCacheControlApplier';
import CapacityCacheLifetimeResolver from '../api/CapacityCacheLifetimeResolver';
import LatestCapacityTimestampResolver from '../api/LatestCapacityTimestampResolver';

export default class DefaultCapacityCacheControlApplier implements CapacityCacheControlApplier {
    latestTimestampResolver: LatestCapacityTimestampResolver;
    cacheLifetimeResolver: CapacityCacheLifetimeResolver;

    constructor(
        latestTimestampResolver: LatestCapacityTimestampResolver,
        cacheLifetimeResolver: CapacityCacheLifetimeResolver,
    ) {
        this.latestTimestampResolver = latestTimestampResolver;
        this.cacheLifetimeResolver = cacheLifetimeResolver;
    }

    apply(response: Response, capacitiesByStation: Record<string, Capacity[]>): void {
        const allCapacities = Object.values(capacitiesByStation).flat();

        const latestTimestamp = this.latestTimestampResolver.resolve(allCapacities);

        const cacheLifetime = latestTimestamp
            ? this.cacheLifetimeResolver.resolve(latestTimestamp)
            : 0;

        if (cacheLifetime > 0) {
            response.setHeader('Cache-Control', `public, max-age=${cacheLifetime}`);
        }
    }
}
