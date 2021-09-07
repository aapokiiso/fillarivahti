import { Capacity } from '@aapokiiso/fillarivahti-capacity-repository';

interface LatestCapacityTimestampResolver {
    /**
     * Resolves latest timestamp from set of capacity records.
     *
     * @param {Capacity[]} capacities
     *
     * @returns {Date|null}
     */
    resolve(capacities: Capacity[]): Date|null;
}

export default LatestCapacityTimestampResolver;
