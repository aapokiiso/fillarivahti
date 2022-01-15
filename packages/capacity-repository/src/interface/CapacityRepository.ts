import { Capacity } from './data/Capacity';

export interface CapacityRepository {
    /**
     * Creates a new capacity record.
     *
     * @param {Capacity} capacity
     *
     * @returns {Promise<void>}
     */
    create(capacity: Capacity): Promise<void>;

    /**
     * Creates multiple new capacity records. Records are NOT saved in a
     * transaction, this is intended to be used to input capacity records
     * over time, where infrequent missing data does not matter.
     *
     * @param {Capacity[]} capacities
     *
     * @returns {Promise<void>}
     */
    createMany(capacities: Capacity[]): Promise<void>;
}
