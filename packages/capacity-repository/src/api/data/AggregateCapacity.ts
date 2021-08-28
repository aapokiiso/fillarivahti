/**
 * Capacity aggregated & averaged for a given hour and minute
 * rather than a specific point in time.
 *
 * @see Capacity
 */
interface AggregateCapacity
{
    stationId: string;

    capacity: number;

    hour: number;

    minute: number;
}

export default AggregateCapacity;
