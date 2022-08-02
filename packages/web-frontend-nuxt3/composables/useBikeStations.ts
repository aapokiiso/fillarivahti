import { BikeStation } from '~/types/BikeStation'

export const useBikeStationsByIds = (stationIds: string[]) => {
  const url = `/api/stations?${stationIds.map(id => `ids=${id}`).join('&')}`

  return useFetch<BikeStation[]>(url, { key: url, default: () => [] })
}
