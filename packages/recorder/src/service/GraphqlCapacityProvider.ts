import CapacityProvider from '../api/CapacityProvider';
import { ConnectionProvider } from '@aapokiiso/fillarivahti-hsl-graphql-client';
import { Capacity } from '@aapokiiso/fillarivahti-capacity-repository';

export default class GraphqlCapacityProvider implements CapacityProvider {
    graphqlConnectionProvider: ConnectionProvider;

    constructor(
        graphqlConnectionProvider: ConnectionProvider,
    ) {
        this.graphqlConnectionProvider = graphqlConnectionProvider;
    }

    async getCapacities(stationIds?: string[]): Promise<Capacity[]> {
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
                    const capacity: Capacity = {
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
