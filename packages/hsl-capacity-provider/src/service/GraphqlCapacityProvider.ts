import { singleton, inject } from 'tsyringe';
import { CapacityProvider } from '../interface/CapacityProvider';
import * as FillarivahtiHslGraphqlClient from '@aapokiiso/fillarivahti-hsl-graphql-client';
import * as FillarivahtiCapacityRepository from '@aapokiiso/fillarivahti-capacity-repository';

@singleton()
export class GraphqlCapacityProvider implements CapacityProvider {
    constructor(
        @inject('FillarivahtiHslGraphqlClient.ConnectionProvider') private graphqlConnectionProvider: FillarivahtiHslGraphqlClient.ConnectionProvider,
    ) { }

    async getCapacities(stationIds?: string[]): Promise<FillarivahtiCapacityRepository.Capacity[]> {
        const connection = this.graphqlConnectionProvider.getConnection();

        try {
            const filter = stationIds
                ? `(ids: [${stationIds.map(id => `"${id}"`).join(',')}])`
                : '';

            const { data } = await connection.request({
                data: {
                    query: `{
                        bikeRentalStations${filter} {
                            stationId
                            bikesAvailable
                            capacity
                        }
                    }`,
                },
            });

            const { data: apiData = {} } = data;
            const { bikeRentalStations = [] } = apiData;

            type BikeStationData = {
                stationId: string,
                bikesAvailable: number,
                capacity: number
            };

            return bikeRentalStations
                .map(({ stationId, bikesAvailable, capacity: maxBikes }: BikeStationData) => {
                    const capacity: FillarivahtiCapacityRepository.Capacity = {
                        stationId,
                        timestamp: new Date(),
                        capacity: maxBikes > 0 ? bikesAvailable / maxBikes : 0,
                    };

                    return capacity;
                });
        } catch (error: any) {
            throw new Error(`Failed to request capacities from HSL GraphQL API. Reason: ${error.message}`);
        }
    }
}
