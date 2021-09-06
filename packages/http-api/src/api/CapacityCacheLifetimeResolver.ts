interface CapacityCacheLifetimeResolver {
    /**
     * Resolves cache lifetime in seconds for the current point in time.
     * The goal is to cache capacity records as long as possible until a new
     * record is added to the set. This depends on configuration but typically
     * the cache lifetime ranges between 0 - 5 minutes.
     *
     * @returns {Number}
     */
     getCacheLifetimeInSeconds(): number;
}

export default CapacityCacheLifetimeResolver;
