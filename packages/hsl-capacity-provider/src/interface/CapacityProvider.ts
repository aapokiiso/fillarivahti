import { Capacity } from '@aapokiiso/fillarivahti-capacity-repository';

export interface CapacityProvider {
    /**
     * Provides capacities for given station IDs.
     *
     * @param string[] stationIds
     * @returns Capacity[]
     */
    getCapacities(stationIds?: string[]): Promise<Capacity[]>;
}
