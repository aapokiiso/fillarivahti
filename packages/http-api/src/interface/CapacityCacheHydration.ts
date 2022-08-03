import { Capacity } from '@aapokiiso/fillarivahti-capacity-repository';

export interface CapacityCacheHydration {
    hydrate(capacityData: unknown): Capacity;
}
