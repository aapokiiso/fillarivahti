import { AxiosRequestConfig } from 'axios';
import { NuxtAxiosInstance } from '@nuxtjs/axios';

export type Capacity = {
    stationId: string,
    timestamp: Date,
    capacity: number
};

type ResponseCapacity = {
    stationId: string,
    timestamp: string, // UTC date string
    capacity: number
};

const mapStationIds = (stationIds: string[]): URLSearchParams => new URLSearchParams(
    stationIds.map((stationId: string) => ['stationIds[]', stationId]),
);

const mapCapacityResponse = (stationIds: string[], data: Record<string, ResponseCapacity[]>): Record<string, Capacity[]> => stationIds
    .reduce((acc: Record<string, Capacity[]>, stationId: string) => {
        const capacities: Capacity[] = (data[stationId] || [])
            .map((responseCapacity: ResponseCapacity) => {
                const { stationId, timestamp, capacity } = responseCapacity;

                return {
                    stationId,
                    timestamp: new Date(timestamp),
                    capacity,
                };
            });

        acc[stationId] = capacities;

        return acc;
    }, {});

export const fetchTodayForStations = async (
    capacityClient: NuxtAxiosInstance,
    stationIds: string[],
    requestOptions: Partial<AxiosRequestConfig> = {},
): Promise<Record<string, Capacity[]>> => {
    const { data } = await capacityClient.get('/today', {
        ...requestOptions,
        params: mapStationIds(stationIds),
    });

    return mapCapacityResponse(stationIds, data);
};

export const fetchTodayForStation = async (
    capacityClient: NuxtAxiosInstance,
    stationId: string,
    requestOptions: Partial<AxiosRequestConfig> = {},
): Promise<Capacity[]> => {
    const capacities = await fetchTodayForStations(capacityClient, [stationId], requestOptions);

    return capacities[stationId] || [];
};

export const fetchWeekdayAverageForStations = async (
    capacityClient: NuxtAxiosInstance,
    stationIds: string[],
    requestOptions: Partial<AxiosRequestConfig> = {},
): Promise<Record<string, Capacity[]>> => {
    const { data } = await capacityClient.get('/weekday-average', {
        ...requestOptions,
        params: mapStationIds(stationIds),
    });

    return mapCapacityResponse(stationIds, data);
};

export const fetchWeekdayAverageForStation = async (
    capacityClient: NuxtAxiosInstance,
    stationId: string,
    requestOptions: Partial<AxiosRequestConfig> = {},
): Promise<Capacity[]> => {
    const capacities = await fetchWeekdayAverageForStations(capacityClient, [stationId], requestOptions);

    return capacities[stationId] || [];
};
