import { singleton, inject } from 'tsyringe';
import { CapacityCacheLifetimeResolver } from '../interface/CapacityCacheLifetimeResolver';
import * as FillarivahtiCapacityRepository from '@aapokiiso/fillarivahti-capacity-repository';

@singleton()
export class DefaultCapacityCacheLifetimeResolver implements CapacityCacheLifetimeResolver {
    constructor(
        @inject('FillarivahtiCapacityRepository.Configuration') private configuration: FillarivahtiCapacityRepository.Configuration,
    ) { }

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
