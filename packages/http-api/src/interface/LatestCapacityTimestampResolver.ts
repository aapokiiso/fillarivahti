import { Capacity } from '@aapokiiso/fillarivahti-capacity-repository';

export interface LatestCapacityTimestampResolver {
    /**
     * Resolves latest timestamp from set of capacity records.
     *
     * @param {Capacity[]} capacities
     *
     * @returns {Date|null}
     */
    resolve(capacities: Capacity[]): Date | null;
}
