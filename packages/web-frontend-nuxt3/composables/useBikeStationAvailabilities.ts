import { BikeStationAvailability, BikeStationAvailabilityResponse } from '~/types/BikeStation'
import { mapBikeStationAvailabilitiesResponse } from '~/helpers/mapBikeStationAvailabilitiesResponse'

export const useBikeStationAvailabilitiesForToday = (stationIds: string[]) => {
  const url = `/api/stations/availability/today?${stationIds.map(id => `ids=${id}`).join('&')}`

  return useFetch<Record<string, BikeStationAvailability[]>>(url, {
    key: url,
    server: false,
    lazy: true,
    default: () => ({}),
    transform: data => mapBikeStationAvailabilitiesResponse(stationIds, data as unknown as Record<string, BikeStationAvailabilityResponse[]>),
  })
}

export const useAverageBikeStationAvailabilitiesForWeekday = (stationIds: string[]) => {
  const url = `/api/stations/availability/weekday-average?${stationIds.map(id => `ids=${id}`).join('&')}`

  return useFetch<Record<string, BikeStationAvailability[]>>(url, {
    key: url,
    server: false,
    lazy: true,
    default: () => ({}),
    transform: data => mapBikeStationAvailabilitiesResponse(stationIds, data as unknown as Record<string, BikeStationAvailabilityResponse[]>),
  })
}
