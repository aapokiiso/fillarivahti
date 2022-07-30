export const useStationIds = () => {
  const useStationIdsFetch = useFetchFactory<string[]>('stationIds', { defaultValue: [] })

  const searchText = useSearchText()

  const endpoint = computed(
    () => searchText.value.length >= 3
      ? `/api/stations/address-search?address=${searchText.value}`
      : '',
  )

  return useStationIdsFetch(endpoint)
}
