interface CapacityCacheLifetimeResolver {
    /**
     * Resolves cache lifetime in seconds from the given point in time.
     * The goal is to cache capacity records as long as possible until a new
     * record is added to the set. This depends on configuration but typically
     * the cache lifetime ranges between 0 - 5 minutes.
     *
     * @param {Date} ref Reference point in time from which to calculate cache
     * lifetime.
     *
     * @returns {Number}
     */
     resolve(ref: Date): number;
}

export default CapacityCacheLifetimeResolver;
