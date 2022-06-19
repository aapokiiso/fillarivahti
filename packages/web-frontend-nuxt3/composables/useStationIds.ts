export const useStationIds = () => {
  const searchText = useSearchText()

  const {
    data: stationIds,
    pending,
    refresh,
    error,
  } = useFetch(() => `/api/stations/address-search?address=${searchText.value}`)

  watch(searchText, () => refresh())

  return { stationIds, pending, refresh, error }
}
