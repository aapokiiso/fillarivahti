import CapacityRepository from '../api/CapacityRepository';
import Configuration from '../api/Configuration';
import Capacity from '../api/data/Capacity';
import AggregateCapacityMapper from '../api/AggregateCapacityMapper';
import { ConnectionProvider as OrmConnectionProvider } from '@aapokiiso/fillarivahti-orm';
import { Op, fn, col, literal, Model } from 'sequelize';
import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';

type AggregateCapacity = {
    stationId: string,
    hour: number,
    minute: number,
    capacity: number
};

export default class OrmCapacityRepository implements CapacityRepository {
    ormConnectionProvider: OrmConnectionProvider;
    configuration: Configuration;
    aggregateCapacityMapper: AggregateCapacityMapper;

    constructor(
        ormConnectionProvider: OrmConnectionProvider,
        configuration: Configuration,
        aggregateCapacityMapper: AggregateCapacityMapper,
    ) {
        this.ormConnectionProvider = ormConnectionProvider;
        this.configuration = configuration;
        this.aggregateCapacityMapper = aggregateCapacityMapper;
    }

    async getToday(stationIds: string[]): Promise<Record<string, Capacity[]>> {
        const connection = await this.ormConnectionProvider.getConnection();

        const timeZone = this.configuration.getTimeZone();
        const granularityInMinutes = this.configuration.getGranularityInMinutes();

        const midnightZoned = utcToZonedTime(new Date(), timeZone);
        midnightZoned.setHours(0, 0, 0, 0);
        const midnight = zonedTimeToUtc(midnightZoned, timeZone);

        const dayEndZoned = utcToZonedTime(new Date(), timeZone);
        // eslint-disable-next-line no-magic-numbers
        dayEndZoned.setHours(23, 59, 59, 999);
        const dayEnd = zonedTimeToUtc(dayEndZoned, timeZone);

        const result = await connection.models.Capacity.findAll({
            attributes: [
                'stationId',
                [literal(`HOUR(CONVERT_TZ(timestamp, "UTC", "${timeZone}"))`), 'hour'],
                [literal(`MINUTE(CONVERT_TZ(timestamp, "UTC", "${timeZone}")) DIV ${granularityInMinutes}`), 'minute'],
                [fn('avg', col('capacity')), 'capacity'],
            ],
            where: {
                stationId: {
                    [Op.in]: stationIds,
                },
                timestamp: {
                    [Op.gte]: midnight,
                    [Op.lte]: dayEnd,
                },
            },
            group: [
                'stationId',
                // Literals are not accepted to GROUP clause in Sequelize typings.
                literal(`HOUR(CONVERT_TZ(timestamp, "UTC", "${timeZone}"))`) as unknown as string,
                literal(`MINUTE(CONVERT_TZ(timestamp, "UTC", "${timeZone}")) DIV ${granularityInMinutes}`) as unknown as string,
            ],
            order: [
                [literal(`HOUR(CONVERT_TZ(timestamp, "UTC", "${timeZone}"))`), 'ASC'],
                [literal(`MINUTE(CONVERT_TZ(timestamp, "UTC", "${timeZone}")) DIV ${granularityInMinutes}`), 'ASC'],
            ],
        });

        const aggCapacities = result.map((model: Model) => model.get({ plain: true }));

        return aggCapacities.reduce(
            (acc: Record<string, Capacity[]>, aggCapacity: AggregateCapacity) => {
                if (!acc[aggCapacity.stationId]) {
                    acc[aggCapacity.stationId] = [];
                }

                acc[aggCapacity.stationId].push(
                    this.aggregateCapacityMapper.map(aggCapacity),
                );

                return acc;
            },
            {},
        );
    }

    async getWeekdayAverage(stationIds: string[]): Promise<Record<string, Capacity[]>> {
        const connection = await this.ormConnectionProvider.getConnection();

        const timeZone = this.configuration.getTimeZone();
        const granularityInMinutes = this.configuration.getGranularityInMinutes();

        const now = utcToZonedTime(new Date(), timeZone);

        const result = await connection.models.Capacity.findAll({
            attributes: [
                'stationId',
                [literal(`HOUR(CONVERT_TZ(timestamp, "UTC", "${timeZone}"))`), 'hour'],
                [literal(`MINUTE(CONVERT_TZ(timestamp, "UTC", "${timeZone}")) DIV ${granularityInMinutes}`), 'minute'],
                [fn('avg', col('capacity')), 'capacity'],
            ],
            where: {
                [Op.and]: [
                    {
                        stationId: {
                            [Op.in]: stationIds,
                        },
                    },
                    // MySQL DAYOFWEEK is 1-indexed, while JS day of week is 0-indexed.
                    literal(`DAYOFWEEK(CONVERT_TZ(timestamp, "UTC", "${timeZone}")) = ${(now.getDay() + 1)}`),
                ],
            },
            group: [
                'stationId',
                // Literals are not accepted to GROUP clause in Sequelize typings.
                literal(`HOUR(CONVERT_TZ(timestamp, "UTC", "${timeZone}"))`) as unknown as string,
                literal(`MINUTE(CONVERT_TZ(timestamp, "UTC", "${timeZone}")) DIV ${granularityInMinutes}`) as unknown as string,
            ],
            order: [
                [literal(`HOUR(CONVERT_TZ(timestamp, "UTC", "${timeZone}"))`), 'ASC'],
                [literal(`MINUTE(CONVERT_TZ(timestamp, "UTC", "${timeZone}")) DIV ${granularityInMinutes}`), 'ASC'],
            ],
        });

        const aggCapacities = result.map((model: Model) => model.get({ plain: true }));

        return aggCapacities.reduce(
            (acc: Record<string, Capacity[]>, aggCapacity: AggregateCapacity) => {
                if (!acc[aggCapacity.stationId]) {
                    acc[aggCapacity.stationId] = [];
                }

                acc[aggCapacity.stationId].push(
                    this.aggregateCapacityMapper.map(aggCapacity),
                );

                return acc;
            },
            {},
        );
    }

    async create(capacity: Capacity): Promise<void> {
        const connection = await this.ormConnectionProvider.getConnection();

        const { stationId, timestamp, capacity: capacityPercentage } = capacity;

        await connection.models.Capacity.create({
            stationId,
            timestamp,
            capacity: capacityPercentage,
        });
    }
}
