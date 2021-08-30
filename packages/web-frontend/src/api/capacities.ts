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
    stationIds.map((stationId: string) => ['stationId[]', stationId]),
);

const mapCapacityResponse = (data: Record<string, ResponseCapacity[]>): Record<string, Capacity[]> => Object.keys(data)
    .reduce((acc: Record<string, Capacity[]>, stationId: string) => {
        const capacities: Capacity[] = data[stationId].map((responseCapacity: ResponseCapacity) => {
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

export const fetchTodayForStations = async (capacityClient: NuxtAxiosInstance, stationIds: string[]): Promise<Record<string, Capacity[]>> => {
    const { data } = await capacityClient.get('/today', {
        params: mapStationIds(stationIds),
    });

    return mapCapacityResponse(data);
};

export const fetchTodayForStation = async (capacityClient: NuxtAxiosInstance, stationId: string): Promise<Capacity[]> => {
    const capacities = await fetchTodayForStations(capacityClient, [stationId]);

    return capacities[stationId] || [];
};

export const fetchWeekdayAverageForStations = async (capacityClient: NuxtAxiosInstance, stationIds: string[]): Promise<Record<string, Capacity[]>> => {
    const { data } = await capacityClient.get('/weekday-average', {
        params: mapStationIds(stationIds),
    });

    return mapCapacityResponse(data);
};

export const fetchWeekdayAverageForStation = async (capacityClient: NuxtAxiosInstance, stationId: string): Promise<Capacity[]> => {
    const capacities = await fetchWeekdayAverageForStations(capacityClient, [stationId]);

    return capacities[stationId] || [];
};
