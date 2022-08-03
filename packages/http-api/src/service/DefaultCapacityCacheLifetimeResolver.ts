import { singleton, inject } from 'tsyringe';
import { CapacityCacheLifetimeResolver } from '../interface/CapacityCacheLifetimeResolver';
import * as FillarivahtiCapacityRepository from '@aapokiiso/fillarivahti-capacity-repository';
import { getTimezoneOffset } from 'date-fns-tz';

@singleton()
export class DefaultCapacityCacheLifetimeResolver implements CapacityCacheLifetimeResolver {
    constructor(
        @inject('FillarivahtiCapacityRepository.Configuration') private configuration: FillarivahtiCapacityRepository.Configuration,
    ) { }

    resolve(ref: Date, granularityInMinutes: number): number {
        const secondsInMinute = 60;
        const millisInSecond = 1000;

        const granularityInMillis = granularityInMinutes * secondsInMinute * millisInSecond;
        const tzOffset = getTimezoneOffset('Europe/Helsinki');

        const expiresAt = Math.ceil((ref.getTime() + tzOffset) / granularityInMillis) * granularityInMillis - tzOffset;

        const now = new Date();
        const cacheLifetime = Math.round((expiresAt - now.getTime()) / millisInSecond);

        return Math.max(cacheLifetime, 0);
    }
}
