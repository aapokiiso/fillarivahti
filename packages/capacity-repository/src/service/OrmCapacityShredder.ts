import CapacityShredder from '../api/CapacityShredder';
import Configuration from '../api/Configuration';
import { ConnectionProvider as OrmConnectionProvider } from '@aapokiiso/fillarivahti-orm';
import { Op } from 'sequelize';
import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';

export default class OrmCapacityShredder implements CapacityShredder {
    ormConnectionProvider: OrmConnectionProvider;
    configuration: Configuration;

    constructor(
        ormConnectionProvider: OrmConnectionProvider,
        configuration: Configuration,
    ) {
        this.ormConnectionProvider = ormConnectionProvider;
        this.configuration = configuration;
    }

    async shredByAge(olderThanDays: number): Promise<void> {
        const connection = await this.ormConnectionProvider.getConnection();

        const timeZone = this.configuration.getTimeZone();

        const todayMidnightZoned = utcToZonedTime(new Date(), timeZone);
        todayMidnightZoned.setHours(0, 0, 0, 0);
        const todayMidnight = zonedTimeToUtc(todayMidnightZoned, timeZone);

        const olderThan = todayMidnight.setDate(todayMidnight.getDate() - olderThanDays);

        await connection.models.Capacity.destroy({
            where: {
                timestamp: {
                    [Op.lt]: olderThan,
                },
            },
        });
    }
}
