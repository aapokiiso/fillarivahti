export const DEFAULT_MARGIN_IN_SECONDS = 30;

interface CapacityCacheLifetimeResolver {
    /**
     * Resolves cache lifetime in seconds for the current point in time.
     * The goal is to cache capacity records as long as possible until a new
     * record is added to the set. This depends on configuration but typically
     * the cache lifetime ranges between 0 - 5 minutes.
     *
     * @param {Number} marginInSeconds Adds a bit of margin to the cache
     * lifetime so new capacity records have time to generate before the
     * previous records have invalidated from cache.
     *
     * @returns {Number}
     */
     getCacheLifetimeInSeconds(marginInSeconds: number): number;
}

export default CapacityCacheLifetimeResolver;
