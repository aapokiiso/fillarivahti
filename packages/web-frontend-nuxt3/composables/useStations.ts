export const useStations = async () => {
  const { stationIds } = await useStationIds()

  // TODO: Replace useFetch with $fetch, useFetch meant only for pages, components, plugins.

  const {
    data: stations,
    pending,
    refresh,
    error,
  } = await useFetch(() => `/api/stations?${stationIds.value.map(id => `ids=${id}`).join('&')}`)

  watch(stationIds, () => refresh())

  return { stations, pending, refresh, error }
}
