import AggregateCapacity from './data/AggregateCapacity';
import Capacity from './data/Capacity';

interface AggregateCapacityMapper
{
    /**
     * Maps aggregated capacity to a capacity record. Since the aggregated
     * capacity is not for any specific point of time, the current date will
     * be used for the date, while the time is based on the aggregation hour
     * & minute.
     *
     * @param {AggregateCapacity} aggregateCapacity
     *
     * @returns {Capacity}
     */
    map(aggregateCapacity: AggregateCapacity): Capacity;
}

export default AggregateCapacityMapper;
