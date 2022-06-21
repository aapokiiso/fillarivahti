import { BikeStation } from '~/types/BikeStation'

export const useStations = () => {
  const { stationIds } = useStationIds()

  const endpoint = computed(() => `/api/stations${stationIds.value.length ? '?' + stationIds.value.map(id => `ids=${id}`).join('&') : ''}`)

  const {
    data: stations,
    pending,
    refresh,
    error,
  } = useAsyncData<BikeStation[]>(
    endpoint.value,
    () => {
      if (stationIds.value.length) {
        return $fetch(endpoint.value)
      }

      return Promise.resolve([])
    },
    {
      default: () => [],
    },
  )

  watch(stationIds, () => refresh())

  return { stations, pending, refresh, error }
}
