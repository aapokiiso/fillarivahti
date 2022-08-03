import { Capacity } from '@aapokiiso/fillarivahti-capacity-repository';
import { CapacityCacheHydration } from '../interface/CapacityCacheHydration';

export class DefaultCapacityCacheHydration implements CapacityCacheHydration {
    hydrate(capacityData: unknown): Capacity {
        const { stationId, timestamp, capacity } = Object(capacityData);

        return {
            stationId,
            timestamp: new Date(timestamp),
            capacity: Number(capacity),
        };
    }
}
