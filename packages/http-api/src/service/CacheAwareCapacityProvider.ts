import { Capacity, CapacityProvider, Configuration } from '@aapokiiso/fillarivahti-capacity-repository';
import { inject, singleton } from 'tsyringe';
import { CapacityCacheHydration } from '../interface/CapacityCacheHydration';
import { CapacityCacheLifetimeResolver } from '../interface/CapacityCacheLifetimeResolver';
import { RedisClientProvider } from '../interface/RedisClientProvider';

@singleton()
export class CacheAwareCapacityProvider implements CapacityProvider {
    constructor(
        @inject('FillarivahtiHttpApi.RedisClientProvider') private redisClientProvider: RedisClientProvider,
        @inject('FillarivahtiCapacityRepository.CapacityProvider') private capacityProvider: CapacityProvider,
        @inject('FillarivahtiCapacityRepository.Configuration') private capacityConfig: Configuration,
        @inject('FillarivahtiHttpApi.CapacityCacheLifetimeResolver') private cacheLifetimeResolver: CapacityCacheLifetimeResolver,
        @inject('FillarivahtiHttpApi.CapacityCacheHydration') private capacityCacheHydration: CapacityCacheHydration,
    ) {}

    getToday(stationIds: string[]): Promise<Record<string, Capacity[]>> {
        return this.getWithCache(stationIds, 'today', 'getToday', this.capacityConfig.getGranularityInMinutes());
    }

    getWeekdayAverage(stationIds: string[]): Promise<Record<string, Capacity[]>> {
        const dayInMinutes = 1440;

        return this.getWithCache(stationIds, 'weekday-average', 'getWeekdayAverage', dayInMinutes);
    }

    private async getWithCache(
        stationIds: string[],
        capacityKey: 'today' | 'weekday-average',
        capacityProviderMethodName: 'getToday' | 'getWeekdayAverage',
        expiryGranularityInMinutes: number,
    ) {
        const redisClient = await this.redisClientProvider.getClient();
        if (!redisClient) {
            return this.capacityProvider[capacityProviderMethodName](stationIds);
        }

        const cachedData = await Promise.all(stationIds.map(async stationId => {
            const json = await redisClient.get(`capacities-${capacityKey}-${stationId}`);

            return {
                stationId,
                data: json ? JSON.parse(json) : null,
            };
        }));

        const cachedCapacities = cachedData.reduce((acc, { stationId, data }) => {
            acc[stationId] = Array.isArray(data)
                ? data.map(item => this.capacityCacheHydration.hydrate(item))
                : [];

            return acc;
        }, {} as Record<string, Capacity[]>);

        const missingStationIds = cachedData
            .filter(({ data }) => !data)
            .map(({ stationId }) => stationId);

        if (missingStationIds.length) {
            const missingCapacities = await this.capacityProvider[capacityProviderMethodName](missingStationIds);

            await Promise.all(Object.keys(missingCapacities).map(async stationId => {
                await redisClient.set(`capacities-${capacityKey}-${stationId}`, JSON.stringify(missingCapacities[stationId]), {
                    // TODO trigger expiration from recorder instead of timing it
                    EX: this.cacheLifetimeResolver.resolve(new Date(), expiryGranularityInMinutes),
                });
            }));

            return Object.assign({}, cachedCapacities, missingCapacities);
        }

        return cachedCapacities;
    }
}
