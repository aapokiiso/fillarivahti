import { NuxtAxiosInstance } from '@nuxtjs/axios';

export type BikeStation = {
    stationId: string,
    name: string,
    bikesAvailable: number,
    capacity: number,
};

export const fetchStationsByIds = async (
    hslGraphqlClient: NuxtAxiosInstance,
    stationIds?: string[],
): Promise<BikeStation[]> => {
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
                        bikesAvailable
                        capacity
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

export const fetchStationById = async (
    hslGraphqlClient: NuxtAxiosInstance,
    stationId: string,
): Promise<BikeStation | undefined> => {
    const [station] = await fetchStationsByIds(hslGraphqlClient, [stationId]);

    return station;
};

/**
 * Limits number of search results.
 */
const DEFAULT_SEARCH_RESULTS_COUNT = 5;

type SearchResult = {
    properties: {
        id: string,
    }
};

export const findStationsByAddress = async (
    addressSearchClient: NuxtAxiosInstance,
    hslGraphqlClient: NuxtAxiosInstance,
    address: string,
    resultsCount: number = DEFAULT_SEARCH_RESULTS_COUNT,
): Promise<BikeStation[]> => {
    const { data } = await addressSearchClient.get('/', {
        params: {
            text: address,
            size: resultsCount,
            sources: 'citybikessmoove,citybikesvantaa',
            layers: 'bikestation',
        },
    });

    const { features }: { features: SearchResult[] } = data;

    const stationIds = features.map(({ properties }) => properties.id);

    return fetchStationsByIds(hslGraphqlClient, stationIds);
};

export const findStationsByLocation = async (
    locationSearchClient: NuxtAxiosInstance,
    hslGraphqlClient: NuxtAxiosInstance,
    lat: number,
    lon: number,
    resultsCount: number = DEFAULT_SEARCH_RESULTS_COUNT,
): Promise<BikeStation[]> => {
    const { data } = await locationSearchClient.get('/', {
        params: {
            'point.lat': lat,
            'point.lon': lon,
            size: resultsCount,
            sources: 'citybikessmoove,citybikesvantaa',
            layers: 'bikestation',
        },
    });

    const { features }: { features: SearchResult[] } = data;

    const stationIds = features.map(({ properties }) => properties.id);

    return fetchStationsByIds(hslGraphqlClient, stationIds);
};
