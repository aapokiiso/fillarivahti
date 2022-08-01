import { BikeStationAvailability, BikeStationAvailabilityResponse } from '~~/types/BikeStation'

export const mapBikeStationAvailabilitiesResponse = (stationIds: string[], data: Record<string, BikeStationAvailabilityResponse[]>): Record<string, BikeStationAvailability[]> => stationIds
  .reduce((acc: Record<string, BikeStationAvailability[]>, stationId: string) => {
    const availabilities: BikeStationAvailability[] = (data[stationId] || [])
      .map((responseAvailability: BikeStationAvailabilityResponse) => {
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
