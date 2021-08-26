import Capacity from './data/Capacity';

interface CapacityRepository
{
    /**
     * Provides capacity records for the current date for given station IDs.
     *
     * Result object is keyed by station ID and contains the capacity records
     * for that given station from the current date.
     *
     * @param string[] stationIds
     *
     * @returns Promise<Record<string, Capacity[]>>
     */
    getToday(stationIds: string[]): Promise<Record<string, Capacity[]>>;

    /**
     * Provides averaged capacity records for given station IDs for the current
     * weekday.
     *
     * Result object is keyed by station ID and contains the capacity records
     * for that given station. Capacity timestamps are dated to the current
     * date.
     *
     * @param string[] stationIds
     *
     * @returns Promise<Record<string, Capacity[]>>
     */
    getWeekdayAverage(stationIds: string[]): Promise<Record<string, Capacity[]>>;

    /**
     * Creates a new capacity record.
     *
     * @param Capacity capacity
     *
     * @returns Promise<void>
     */
    create(capacity: Capacity): Promise<void>;
}

export default CapacityRepository;
