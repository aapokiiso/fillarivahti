import { getDistance } from 'geolib'
import { BikeStation } from '~/types/BikeStation'

export const useBikeStationsByIds = (stationIds: string[]) => {
  const url = `/api/stations?${stationIds.map(id => `ids=${id}`).join('&')}`

  return useFetch<BikeStation[]>(url, { key: url, default: () => [] })
}

export const useBikeStationDistanceInMeters = (station: BikeStation, location: GeolocationCoordinates): number =>
  getDistance(
    { latitude: station.lat, longitude: station.lon },
    { latitude: location.latitude, longitude: location.longitude },
  )
