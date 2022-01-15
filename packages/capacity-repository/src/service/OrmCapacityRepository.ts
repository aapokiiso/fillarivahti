import { singleton, inject } from 'tsyringe';
import * as FillarivahtiOrm from '@aapokiiso/fillarivahti-orm';
import { CapacityRepository } from '../interface/CapacityRepository';
import { Capacity } from '../interface/data/Capacity';

@singleton()
export class OrmCapacityRepository implements CapacityRepository {
    constructor(
        @inject('FillarivahtiOrm.ConnectionProvider') private ormConnectionProvider: FillarivahtiOrm.ConnectionProvider,
    ) { }

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
