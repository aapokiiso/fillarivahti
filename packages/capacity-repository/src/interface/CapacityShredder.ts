export interface CapacityShredder {
    /**
     * Destroys old capacity records.
     *
     * @param {Number} olderThanDays Any capacity record older but not equal
     * than this many days will be destroyed. Time of day is not considered.
     */
    shredByAge(olderThanDays: number): Promise<void>;
}
