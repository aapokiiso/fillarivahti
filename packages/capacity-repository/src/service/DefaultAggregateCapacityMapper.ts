import { singleton, inject } from 'tsyringe';
import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';
import { AggregateCapacityMapper } from '../interface/AggregateCapacityMapper';
import { AggregateCapacity } from '../interface/data/AggregateCapacity';
import { Capacity } from '../interface/data/Capacity';
import { Configuration } from '../interface/Configuration';

@singleton()
export class DefaultAggregateCapacityMapper implements AggregateCapacityMapper {
    constructor(
        @inject('FillarivahtiCapacityRepository.Configuration') private configuration: Configuration,
    ) { }

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
