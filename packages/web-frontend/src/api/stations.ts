import client from '~/plugins/hsl-graphql-client';

export type BikeStation = {
    stationId: string,
    name: string
};

export const fetchStations = async (stationIds?: string[]): Promise<BikeStation[]> => {
    try {
        const filter = stationIds
            ? `(ids: [${stationIds.map(id => `"${id}"`).join(',')}])`
            : '';

        const { data } = await client.request({
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

export const fetchStation = async (stationId: string): Promise<BikeStation|undefined> => {
    const [station] = await fetchStations([stationId]);

    return station;
};
