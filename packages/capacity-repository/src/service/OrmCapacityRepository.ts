import CapacityRepository from '../api/CapacityRepository';
import Capacity from '../api/data/Capacity';
import { ConnectionProvider as OrmConnectionProvider } from '@aapokiiso/fillarivahti-orm';

export default class OrmCapacityRepository implements CapacityRepository {
    ormConnectionProvider: OrmConnectionProvider;

    constructor(
        ormConnectionProvider: OrmConnectionProvider,
    ) {
        this.ormConnectionProvider = ormConnectionProvider;
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
