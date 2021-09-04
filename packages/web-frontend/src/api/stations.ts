import { AxiosRequestConfig } from 'axios';
import { NuxtAxiosInstance } from '@nuxtjs/axios';

export type BikeStation = {
    stationId: string,
    name: string,
    bikesAvailable: number,
    capacity: number,
};

export type Location = {
    latitude: number,
    longitude: number,
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
            sources: 'citybikessmoove',
            layers: 'bikestation',
        },
    });

    const { features }: { features: any[] } = data;

    const stationIds = features.map(({ properties }) => properties.id);

    return stationIds;
};

export const findStationIdsByLocation = async (
    hslGraphqlClient: NuxtAxiosInstance,
    location: Location,
    requestOptions: Partial<AxiosRequestConfig> = {},
): Promise<string[]> => {
    const resultsCount = DEFAULT_SEARCH_RESULTS_COUNT;

    const { data } = await hslGraphqlClient.request({
        ...requestOptions,
        data: {
            query: `{
                nearest(lat: ${location.latitude}, lon: ${location.longitude}, maxResults: ${resultsCount}, filterByPlaceTypes: BICYCLE_RENT) {
                    edges {
                        node {
                            place {
                                ...on BikeRentalStation {
                                    stationId
                                }
                            }
                        }
                    }
                }
            }`,
        },
    });

    const { data: apiData = {} } = data;
    const { nearest = {} } = apiData;
    const { edges = [] } = nearest;

    const stationIds = edges.map((edge: any) => {
        const { node = {} } = edge;
        const { place = {} } = node;
        const { stationId } = place;

        return stationId;
    });

    return stationIds;
};
