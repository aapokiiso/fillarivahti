import CapacityRepository from '../api/CapacityRepository';
import Configuration from '../api/Configuration';
import Capacity from '../api/data/Capacity';
import { ConnectionProvider as OrmConnectionProvider } from '@aapokiiso/fillarivahti-orm';
import { Op, fn, col, literal, where, Model } from 'sequelize';
import { utcToZonedTime } from 'date-fns-tz';

type AggregateCapacity = {
    stationId: string,
    hour: number,
    minute: number,
    capacity: number
};

export default class OrmCapacityRepository implements CapacityRepository {
    ormConnectionProvider: OrmConnectionProvider;
    configuration: Configuration;

    constructor(
        ormConnectionProvider: OrmConnectionProvider,
        configuration: Configuration,
    ) {
        this.ormConnectionProvider = ormConnectionProvider;
        this.configuration = configuration;
    }

    async getToday(stationIds: string[]): Promise<Record<string, Capacity[]>> {
        const connection = await this.ormConnectionProvider.getConnection();

        const timeZone = this.configuration.getTimeZone();
        const granularityInMinutes = this.configuration.getGranularityInMinutes();

        const start = utcToZonedTime(new Date(), timeZone);
        start.setHours(0, 0, 0, 0);

        const end = utcToZonedTime(new Date(), timeZone);
        // eslint-disable-next-line no-magic-numbers
        end.setHours(23, 59, 59, 999);

        const result = await connection.models.Capacity.findAll({
            attributes: [
                'stationId',
                [fn('hour', col('timestamp')), 'hour'],
                [literal(`MINUTE(timestamp) DIV ${granularityInMinutes}`), 'minute'],
                [fn('avg', col('capacity')), 'capacity'],
            ],
            where: {
                stationId: {
                    [Op.in]: stationIds,
                },
                timestamp: {
                    [Op.gte]: start,
                    [Op.lte]: end,
                },
            },
            group: [
                'stationId',
                fn('hour', col('timestamp')),
                // Literal is not accepted to GROUP clause in Sequelize typings.
                literal(`MINUTE(timestamp) DIV ${granularityInMinutes}`) as unknown as string,
            ],
            order: [
                [fn('hour', col('timestamp')), 'ASC'],
                [literal(`MINUTE(timestamp) DIV ${granularityInMinutes}`), 'ASC'],
            ],
        });

        const aggCapacities = result.map((model: Model) => model.get({ plain: true }));

        return aggCapacities.reduce(
            (acc: Record<string, Capacity[]>, aggCapacity: AggregateCapacity) => {
                if (!acc[aggCapacity.stationId]) {
                    acc[aggCapacity.stationId] = [];
                }

                const timestamp = new Date();
                timestamp.setUTCHours(aggCapacity.hour, aggCapacity.minute * granularityInMinutes, 0, 0);

                const capacity: Capacity = {
                    stationId: aggCapacity.stationId,
                    timestamp,
                    capacity: aggCapacity.capacity,
                };

                acc[capacity.stationId].push(capacity);

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
                [fn('hour', col('timestamp')), 'hour'],
                [literal(`MINUTE(timestamp) DIV ${granularityInMinutes}`), 'minute'],
                [fn('avg', col('capacity')), 'capacity'],
            ],
            where: {
                [Op.and]: [
                    {
                        stationId: {
                            [Op.in]: stationIds,
                        },
                    },
                    // MySQL day of week is 1-indexed, while JS day of week is 0-indexed.
                    where(fn('dayofweek', col('timestamp')), (now.getDay() + 1).toString()),
                ],
            },
            group: [
                'stationId',
                fn('hour', col('timestamp')),
                // Literal is not accepted to GROUP clause in Sequelize typings.
                literal(`MINUTE(timestamp) DIV ${granularityInMinutes}`) as unknown as string,
            ],
            order: [
                [fn('hour', col('timestamp')), 'ASC'],
                [literal(`MINUTE(timestamp) DIV ${granularityInMinutes}`), 'ASC'],
            ],
        });

        const aggCapacities = result.map((model: Model) => model.get({ plain: true }));

        return aggCapacities.reduce(
            (acc: Record<string, Capacity[]>, aggCapacity: AggregateCapacity) => {
                if (!acc[aggCapacity.stationId]) {
                    acc[aggCapacity.stationId] = [];
                }

                const timestamp = new Date();
                timestamp.setUTCHours(aggCapacity.hour, aggCapacity.minute * granularityInMinutes, 0, 0);

                const capacity: Capacity = {
                    stationId: aggCapacity.stationId,
                    timestamp,
                    capacity: aggCapacity.capacity,
                };

                acc[capacity.stationId].push(capacity);

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
