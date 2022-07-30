import { BikeStation } from '~/types/BikeStation'

export const useStations = async () => {
  const useStationsFetch = useFetchFactory<BikeStation[]>('stations', { defaultValue: [] })

  const { data: stationIds } = await useStationIds()

  const endpoint = computed(
    () => stationIds.value.length
      ? `/api/stations?${stationIds.value.map(id => `ids=${id}`).join('&')}`
      : '',
  )

  return useStationsFetch(endpoint)
}
