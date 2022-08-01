import { Capacity } from '@aapokiiso/fillarivahti-capacity-repository';

export interface AvailabilityEstimation {
    /**
     * Estimates bike availability data into the future based on today's
     * availability and the average availability for the current weekday.
     *
     * @param todayAvailabilities Bike availability data for today
     * @param weekdayAverageAvailabilities Average bike availability data for weekday
     * @param options Implementation-specific options
     *
     * @returns Estimated bike availability data, null if estimation not possible
     */
    estimate(
        todayAvailabilities: Capacity[],
        weekdayAverageAvailabilities: Capacity[],
        options: Record<string, unknown>
    ): Capacity[] | null
}
