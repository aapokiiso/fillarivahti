import CapacityRepository from '../api/CapacityRepository';
import Capacity from '../api/data/Capacity';
import { ConnectionProvider as OrmConnectionProvider } from '@aapokiiso/fillarivahti-orm';
import { Op, fn, col, literal, where, Model } from 'sequelize';
import { utcToZonedTime } from 'date-fns-tz';

// eslint-disable-next-line no-warning-comments
// TODO: move these to config
const timezone = 'Europe/Helsinki';
const granularityMinutes = 5;

export default class OrmCapacityRepository implements CapacityRepository {
    ormConnectionProvider: OrmConnectionProvider;

    constructor(
        ormConnectionProvider: OrmConnectionProvider,
    ) {
        this.ormConnectionProvider = ormConnectionProvider;
    }

    async getToday(stationIds: string[]): Promise<Record<string, Capacity[]>> {
        const connection = await this.ormConnectionProvider.getConnection();

        const start = utcToZonedTime(new Date(), timezone);
        start.setHours(0, 0, 0, 0);

        const end = utcToZonedTime(new Date(), timezone);
        // eslint-disable-next-line no-magic-numbers
        end.setHours(23, 59, 59, 999);

        const result = await connection.models.Capacity.findAll({
            attributes: [
                'stationId',
                'timestamp',
                'capacity',
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
            order: [
                ['timestamp', 'ASC'],
            ],
        });

        const capacities = result.map((model: Model) => model.get({ plain: true }));

        return capacities.reduce(
            (acc: Record<string, Capacity[]>, capacity: Capacity) => {
                if (!acc[capacity.stationId]) {
                    acc[capacity.stationId] = [];
                }

                acc[capacity.stationId].push(capacity);

                return acc;
            },
            {},
        );
    }

    async getWeekdayAverage(stationIds: string[]): Promise<Record<string, Capacity[]>> {
        const connection = await this.ormConnectionProvider.getConnection();

        const now = utcToZonedTime(new Date(), timezone);

        const result = await connection.models.Capacity.findAll({
            attributes: [
                'stationId',
                [fn('hour', col('timestamp')), 'hour'],
                [literal(`MINUTE(timestamp) DIV ${granularityMinutes}`), 'minute'],
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
                literal(`MINUTE(timestamp) DIV ${granularityMinutes}`) as unknown as string,
            ],
            order: [
                [fn('hour', col('timestamp')), 'ASC'],
                [literal(`MINUTE(timestamp) DIV ${granularityMinutes}`), 'ASC'],
            ],
        });

        type AverageCapacity = {
            stationId: string,
            hour: number,
            minute: number,
            capacity: number
        };

        const avgCapacities = result.map((model: Model) => model.get({ plain: true }));

        return avgCapacities.reduce(
            (acc: Record<string, Capacity[]>, avgCapacity: AverageCapacity) => {
                if (!acc[avgCapacity.stationId]) {
                    acc[avgCapacity.stationId] = [];
                }

                const timestamp = new Date();
                timestamp.setUTCHours(avgCapacity.hour, avgCapacity.minute * granularityMinutes, 0, 0);

                const capacity: Capacity = {
                    stationId: avgCapacity.stationId,
                    timestamp,
                    capacity: avgCapacity.capacity,
                };

                acc[avgCapacity.stationId].push(capacity);

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
