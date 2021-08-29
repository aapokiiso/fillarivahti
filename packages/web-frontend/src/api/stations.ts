import { DefaultConnectionProvider, EnvConfiguration } from '@aapokiiso/fillarivahti-hsl-graphql';

const configuration = new EnvConfiguration();

const connectionProvider = new DefaultConnectionProvider(
    configuration,
);

export type BikeStation = {
    stationId: string,
    name: string
};

export const fetchStations = async (stationIds?: string[]): Promise<BikeStation[]> => {
    try {
        const filter = stationIds
            ? `(ids: [${stationIds.map(id => `"${id}"`).join(',')}])`
            : '';

        const { data } = await connectionProvider.getConnection().request({
            data: {
                query: `{
                    bikeRentalStations${filter} {
                        stationId
                        name
                    }
                }`,
            },
        });

        const { data: apiData = {} } = data;
        const { bikeRentalStations = [] } = apiData;

        return bikeRentalStations;
    } catch (error) {
        console.error(error);

        throw new Error('Failed to request stations from HSL GraphQL API.');
    }
};
