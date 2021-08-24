import CapacityProvider from '../api/CapacityProvider';
import GraphqlConnectionProvider from '../api/GraphqlConnectionProvider';
import { Capacity } from '@aapokiiso/fillarivahti-capacity-repository';

export default class GraphqlCapacityProvider implements CapacityProvider {
    graphqlConnectionProvider: GraphqlConnectionProvider;

    constructor(
        graphqlConnectionProvider: GraphqlConnectionProvider,
    ) {
        this.graphqlConnectionProvider = graphqlConnectionProvider;
    }

    async getCapacities(stationIds: string[]): Promise<Capacity[]> {
        const connection = this.graphqlConnectionProvider.getConnection();

        try {
            const idsStr = stationIds.map(id => `"${id}"`).join(',');

            const { data } = await connection.request({
                data: {
                    query: `{
                        bikeRentalStations(ids: [${idsStr}]) {
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
        } catch (error) {
            throw new Error(`Failed to request capacities from HSL GraphQL API. Reason: ${error.message}`);
        }
    }
}
