export interface CapacityCacheLifetimeResolver {
    /**
     * Resolves cache lifetime in seconds from the given point in time. The goal
     * is to cache capacity records as long as possible until a new record is
     * added to the set. This depends on configuration but typically the cache
     * lifetime ranges between 5 minutes (today's records) and 24 hours
     * (weekday's averages). Cache lifetime can be taken into account with the
     * granularity parameter.
     *
     * @param {Date} ref Reference point in time from which to calculate cache
     * lifetime.
     * @param {number} granularityInMinutes Cache lifetime granularity
     *
     * @returns {Number}
     */
    resolve(ref: Date, granularityInMinutes: number): number;
}
