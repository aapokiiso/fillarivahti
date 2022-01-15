import { singleton } from 'tsyringe';
import { Capacity } from '@aapokiiso/fillarivahti-capacity-repository';
import { LatestCapacityTimestampResolver } from '../interface/LatestCapacityTimestampResolver';

@singleton()
export class DefaultLatestCapacityTimestampResolver implements LatestCapacityTimestampResolver {
    resolve(capacities: Capacity[]): Date | null {
        const timestamps = capacities.map(({ timestamp }) => timestamp);

        const descendingTimestamps = timestamps.slice().sort((a, b) => b.getTime() - a.getTime());

        return descendingTimestamps[0] || null;
    }
}
