import { singleton, inject } from 'tsyringe';
import { Op } from 'sequelize';
import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';
import * as FillarivahtiOrm from '@aapokiiso/fillarivahti-orm';
import { CapacityShredder } from '../interface/CapacityShredder';
import { Configuration } from '../interface/Configuration';

@singleton()
export class OrmCapacityShredder implements CapacityShredder {
    constructor(
        @inject('FillarivahtiOrm.ConnectionProvider') private ormConnectionProvider: FillarivahtiOrm.ConnectionProvider,
        @inject('FillarivahtiCapacityRepository.Configuration') private configuration: Configuration,
    ) { }

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
