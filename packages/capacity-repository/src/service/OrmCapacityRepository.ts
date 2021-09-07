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

        await connection.models.Capacity.create(
            this.mapCapacity(capacity),
        );
    }

    async createMany(capacities: Capacity[]): Promise<void> {
        const connection = await this.ormConnectionProvider.getConnection();

        await connection.models.Capacity.bulkCreate(
            capacities.map(this.mapCapacity),
        );
    }

    private mapCapacity(capacity: Capacity): Record<string, any> {
        const { stationId, timestamp, capacity: capacityPercentage } = capacity;

        return {
            stationId,
            timestamp,
            capacity: capacityPercentage,
        };
    }
}
