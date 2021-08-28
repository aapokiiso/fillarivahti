export const DEFAULT_TIME_ZONE = 'Europe/Helsinki';
export const DEFAULT_GRANULARITY_IN_MINUTES = 5;

interface Configuration
{
    /**
     * Timezone capacity records are reported in.
     */
    getTimeZone(): string;

    /**
     * Granularity in minutes at which to report capacity records.
     * For example a granularity of 60 minutes means capacity records are
     * averaged over 1-hour intervals.
     */
    getGranularityInMinutes(): number;
}

export default Configuration;
