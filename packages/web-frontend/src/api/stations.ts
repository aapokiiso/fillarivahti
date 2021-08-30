import { NuxtAxiosInstance } from '@nuxtjs/axios';

export type BikeStation = {
    stationId: string,
    name: string
};

export const fetchStations = async (hslGraphqlClient: NuxtAxiosInstance, stationIds?: string[]): Promise<BikeStation[]> => {
    try {
        const filter = stationIds
            ? `(ids: [${stationIds.map(id => `"${id}"`).join(',')}])`
            : '';

        const { data } = await hslGraphqlClient.request({
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

export const fetchStation = async (hslGraphqlClient: NuxtAxiosInstance, stationId: string): Promise<BikeStation|undefined> => {
    const [station] = await fetchStations(hslGraphqlClient, [stationId]);

    return station;
};
