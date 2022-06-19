export const useStations = () => {
  const { stationIds } = useStationIds()

  const {
    data: stations,
    pending,
    refresh,
    error,
  } = useFetch(() => `/api/stations?${(stationIds.value || []).map(id => `ids=${id}`).join('&')}`)

  watch(stationIds, () => refresh())

  return { stations, pending, refresh, error }
}
