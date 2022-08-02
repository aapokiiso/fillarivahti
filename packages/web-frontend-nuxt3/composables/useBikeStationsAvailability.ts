import { UseFetchOptions } from 'nuxt/dist/app/composables'
import { BikeStation, BikeStationAvailability, BikeStationAvailabilityResponse } from '~/types/BikeStation'
import { mapBikeStationsAvailabilityResponse } from '~/helpers/mapBikeStationsAvailabilityResponse'

export const useBikeStationsAvailabilityForToday = <DataT extends Record<string, any> = Record<string, BikeStationAvailability[]>>(
  stationIds: string[],
  fetchOptions?: UseFetchOptions<DataT, (res: Record<string, BikeStationAvailabilityResponse[]>) => DataT>,
) => {
  type ResT = Record<string, BikeStationAvailabilityResponse[]>
  type Transform = (res: ResT) => Record<string, BikeStationAvailability[]>

  const url = `/api/stations/availability/today?${stationIds.map(id => `ids=${id}`).join('&')}`

  return useFetch<ResT, Error, any, ResT, Transform>(url, Object.assign({}, {
    key: url,
    transform: res => mapBikeStationsAvailabilityResponse(stationIds, res),
  }, fetchOptions))
}

export const useBikeStationsAverageAvailabilityForWeekday = <DataT extends Record<string, any> = Record<string, BikeStationAvailability[]>>(
  stationIds: string[],
  fetchOptions?: UseFetchOptions<DataT, (res: Record<string, BikeStationAvailabilityResponse[]>) => DataT>,
) => {
  type ResT = Record<string, BikeStationAvailabilityResponse[]>
  type Transform = (res: ResT) => Record<string, BikeStationAvailability[]>

  const url = `/api/stations/availability/weekday-average?${stationIds.map(id => `ids=${id}`).join('&')}`

  return useFetch<ResT, Error, any, ResT, Transform>(url, Object.assign({}, {
    key: url,
    transform: res => mapBikeStationsAvailabilityResponse(stationIds, res),
  }, fetchOptions))
}

export const useBikeStationsEstimatedAvailability = <DataT extends Record<string, any> = Record<string, BikeStationAvailability[]>>(
  stationIds: string[],
  fetchOptions?: UseFetchOptions<DataT, (res: Record<string, BikeStationAvailabilityResponse[]>) => DataT>,
) => {
  type ResT = Record<string, BikeStationAvailabilityResponse[]>
  type Transform = (res: ResT) => DataT

  const url = `/api/stations/availability/estimated?${stationIds.map(id => `ids=${id}`).join('&')}`

  return useFetch<ResT, Error, any, ResT, Transform>(url, Object.assign({}, {
    key: url,
    transform: res => mapBikeStationsAvailabilityResponse(stationIds, res),
  }, fetchOptions))
}

export const useBikeStationsFurthestEstimatedAvailability = <DataT extends Record<string, any> = Record<string, BikeStationAvailability>>(
  stationIds: string[],
  fetchOptions?: UseFetchOptions<DataT, (res: Record<string, BikeStationAvailabilityResponse[]>) => DataT>,
) => {
  return useBikeStationsEstimatedAvailability<DataT>(stationIds, Object.assign({}, {
    transform: (res) => {
      const data = mapBikeStationsAvailabilityResponse(stationIds, res)

      return Object.keys(data).reduce((acc, stationId) => {
        acc[stationId] = data[stationId][data[stationId].length - 1]

        return acc
      }, {})
    },
  }, fetchOptions))
}

export const useBikeStationEstimatedBikesAvailable = (station: BikeStation, estimatedAvailability?: BikeStationAvailability) => {
  return estimatedAvailability
    ? Math.round(estimatedAvailability.capacity * station.capacity)
    : null
}
