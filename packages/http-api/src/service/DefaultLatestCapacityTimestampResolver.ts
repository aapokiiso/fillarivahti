import { Capacity } from '@aapokiiso/fillarivahti-capacity-repository';
import LatestCapacityTimestampResolver from '../api/LatestCapacityTimestampResolver';

export default class DefaultLatestCapacityTimestampResolver implements LatestCapacityTimestampResolver {
    resolve(capacities: Capacity[]): Date|null {
        const timestamps = capacities.map(({ timestamp }) => timestamp);

        const descendingTimestamps = timestamps.slice().sort((a, b) => b.getTime() - a.getTime());

        return descendingTimestamps[0] || null;
    }
}
