export const useStationIds = async () => {
  const searchText = useSearchText()

  // TODO: Replace useFetch with $fetch, useFetch meant only for pages, components, plugins.

  const {
    data: stationIds,
    pending,
    refresh,
    error,
  } = await useFetch(() => `/api/stations/address-search?address=${searchText.value}`)

  watch(searchText, () => refresh())

  return { stationIds, pending, refresh, error }
}
