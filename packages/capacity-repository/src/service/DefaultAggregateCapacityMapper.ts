import { getTimezoneOffset, utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';
import AggregateCapacityMapper from '../api/AggregateCapacityMapper';
import AggregateCapacity from '../api/data/AggregateCapacity';
import Capacity from '../api/data/Capacity';
import Configuration from '../api/Configuration';

export default class DefaultAggregateCapacityMapper implements AggregateCapacityMapper {
    configuration: Configuration;

    constructor(
        configuration: Configuration,
    ) {
        this.configuration = configuration;
    }

    map(aggregateCapacity: AggregateCapacity): Capacity {
        const { stationId, capacity, hour, minute } = aggregateCapacity;

        const timeZone = this.configuration.getTimeZone();
        const granularityInMinutes = this.configuration.getGranularityInMinutes();

        const midnightZoned = utcToZonedTime(new Date(), timeZone);
        midnightZoned.setHours(0, 0, 0, 0);
        const midnight = zonedTimeToUtc(midnightZoned, timeZone);

        const millisInSecond = 1000;
        const secondsInMinute = 60;
        const minutesInHour = 60;

        const timestamp = new Date(
            midnight.getTime()
            + millisInSecond * (hour * minutesInHour * secondsInMinute + minute * granularityInMinutes * secondsInMinute)
            + getTimezoneOffset(timeZone),
        );

        return {
            stationId,
            timestamp,
            capacity,
        };
    }
}