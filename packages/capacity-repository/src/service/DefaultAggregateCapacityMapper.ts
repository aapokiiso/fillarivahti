import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';
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

        const millisInSecond = 1000;
        const secondsInMinute = 60;
        const minutesInHour = 60;

        const timestampZoned = new Date(
            midnightZoned.getTime()
            + millisInSecond * (hour * minutesInHour * secondsInMinute + minute * granularityInMinutes * secondsInMinute),
        );

        const timestamp = zonedTimeToUtc(timestampZoned, timeZone);

        return {
            stationId,
            timestamp,
            capacity,
        };
    }
}
