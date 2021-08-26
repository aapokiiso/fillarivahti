import CapacityRepository from '../api/CapacityRepository';
import Capacity from '../api/data/Capacity';
import { ConnectionProvider as OrmConnectionProvider } from '@aapokiiso/fillarivahti-orm';
import { Op, fn, col, literal, where } from 'sequelize';
import { utcToZonedTime } from 'date-fns-tz';

export default class OrmCapacityRepository implements CapacityRepository {
    ormConnectionProvider: OrmConnectionProvider;

    constructor(
        ormConnectionProvider: OrmConnectionProvider,
    ) {
        this.ormConnectionProvider = ormConnectionProvider;
    }

    async getToday(stationIds: string[]): Promise<Record<string, Capacity[]>> {
        const connection = await this.ormConnectionProvider.getConnection();

        const start = utcToZonedTime(new Date(), 'Europe/Helsinki');
        start.setHours(0, 0, 0, 0);

        const end = utcToZonedTime(new Date(), 'Europe/Helsinki');
        // eslint-disable-next-line no-magic-numbers
        end.setHours(23, 59, 59, 999);

        const result: unknown = await connection.models.Capacity.findAll({
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

        const capacities = result as Capacity[];

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

        const now = utcToZonedTime(new Date(), 'Europe/Helsinki');

        const result: unknown = await connection.models.Capacity.findAll({
            attributes: [
                'stationId',
                [fn('hour', col('timestamp')), 'hour'],
                [literal('MINUTE(timestamp) DIV 5'), 'minute'],
                [fn('avg', col('capacity')), 'capacity'],
            ],
            where: {
                [Op.and]: [
                    {
                        stationId: {
                            [Op.in]: stationIds,
                        },
                    },
                    where(fn('dayofweek', col('timestamp')), now.getDay().toString()),
                ],
            },
            group: [
                'stationId',
                fn('hour', col('timestamp')),
                // eslint-disable-next-line no-warning-comments
                literal('MINUTE(timestamp) DIV 5') as unknown as string, // TODO: why literal not accepted?
            ],
            order: [
                [fn('hour', col('timestamp')), 'ASC'],
                [literal('MINUTE(timestamp) DIV 5'), 'ASC'],
            ],
        });

        type AverageCapacity = {
            stationId: string,
            hour: number,
            minute: number,
            capacity: number
        };

        const avgCapacities = result as AverageCapacity[];

        return avgCapacities.reduce(
            (acc: Record<string, Capacity[]>, avgCapacity: AverageCapacity) => {
                if (!acc[avgCapacity.stationId]) {
                    acc[avgCapacity.stationId] = [];
                }

                const timestamp = utcToZonedTime(new Date(), 'Europe/Helsinki');
                timestamp.setHours(avgCapacity.hour, avgCapacity.minute, 0, 0);

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
