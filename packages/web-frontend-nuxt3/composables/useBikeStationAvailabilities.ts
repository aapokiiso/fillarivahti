import { BikeStationAvailability, BikeStationAvailabilityPlain } from '~/types/BikeStation'

const mapAvailabilityResponse = (stationIds: string[], data: Record<string, BikeStationAvailabilityPlain[]>): Record<string, BikeStationAvailability[]> => stationIds
  .reduce((acc: Record<string, BikeStationAvailability[]>, stationId: string) => {
    const availabilities: BikeStationAvailability[] = (data[stationId] || [])
      .map((responseAvailability: BikeStationAvailabilityPlain) => {
        const { stationId, timestamp, capacity } = responseAvailability

        return {
          stationId,
          timestamp: new Date(timestamp),
          capacity,
        }
      })

    acc[stationId] = availabilities

    return acc
  }, {})

export const useBikeStationAvailabilitiesForToday = (stationIds: string[]) => {
  const url = `/api/stations/availability/today?${stationIds.map(id => `ids=${id}`).join('&')}`

  return useFetch<Record<string, BikeStationAvailability[]>>(url, {
    key: url,
    server: false,
    lazy: true,
    default: () => ({}),
    transform: data => mapAvailabilityResponse(stationIds, data as unknown as Record<string, BikeStationAvailabilityPlain[]>),
  })
}

export const useAverageBikeStationAvailabilitiesForWeekday = (stationIds: string[]) => {
  const url = `/api/stations/availability/weekday-average?${stationIds.map(id => `ids=${id}`).join('&')}`

  return useFetch<Record<string, BikeStationAvailability[]>>(url, {
    key: url,
    server: false,
    lazy: true,
    default: () => ({}),
    transform: data => mapAvailabilityResponse(stationIds, data as unknown as Record<string, BikeStationAvailabilityPlain[]>),
  })
}
