import { singleton, inject } from 'tsyringe';
import { Capacity } from '@aapokiiso/fillarivahti-capacity-repository';
import { Response } from 'express';
import { CapacityCacheControlApplier } from '../interface/CapacityCacheControlApplier';
import { CapacityCacheLifetimeResolver } from '../interface/CapacityCacheLifetimeResolver';
import { LatestCapacityTimestampResolver } from '../interface/LatestCapacityTimestampResolver';

@singleton()
export class DefaultCapacityCacheControlApplier implements CapacityCacheControlApplier {
    constructor(
        @inject('FillarivahtiHttpApi.LatestCapacityTimestampResolver') private latestTimestampResolver: LatestCapacityTimestampResolver,
        @inject('FillarivahtiHttpApi.CapacityCacheLifetimeResolver') private cacheLifetimeResolver: CapacityCacheLifetimeResolver,
    ) { }

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
