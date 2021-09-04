import { AxiosRequestConfig } from 'axios';
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
    requestOptions: Partial<AxiosRequestConfig> = {},
): Promise<BikeStation[]> => {
    try {
        const filter = stationIds
            ? `(ids: [${stationIds.map(id => `"${id}"`).join(',')}])`
            : '';

        const { data } = await hslGraphqlClient.request({
            ...requestOptions,
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
    requestOptions: Partial<AxiosRequestConfig> = {},
): Promise<BikeStation | undefined> => {
    const [station] = await fetchStationsByIds(hslGraphqlClient, [stationId], requestOptions);

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

export const findStationIdsByAddress = async (
    addressSearchClient: NuxtAxiosInstance,
    address: string,
    requestOptions: Partial<AxiosRequestConfig> = {},
): Promise<string[]> => {
    const { data } = await addressSearchClient.request({
        ...requestOptions,
        params: {
            text: address,
            size: DEFAULT_SEARCH_RESULTS_COUNT,
            sources: 'citybikessmoove,citybikesvantaa',
            layers: 'bikestation',
        },
    });

    const { features }: { features: SearchResult[] } = data;

    const stationIds = features.map(({ properties }) => properties.id);

    return stationIds;
};

export const findStationIdsByLocation = async (
    locationSearchClient: NuxtAxiosInstance,
    lat: number,
    lon: number,
    requestOptions: Partial<AxiosRequestConfig> = {},
): Promise<string[]> => {
    const { data } = await locationSearchClient.request({
        ...requestOptions,
        params: {
            'point.lat': lat,
            'point.lon': lon,
            size: DEFAULT_SEARCH_RESULTS_COUNT,
            sources: 'citybikessmoove,citybikesvantaa',
            layers: 'bikestation',
        },
    });

    const { features }: { features: SearchResult[] } = data;

    const stationIds = features.map(({ properties }) => properties.id);

    return stationIds;
};
