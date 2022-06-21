export const useStationIds = () => {
  const searchText = useSearchText()

  const endpoint = computed(() => `/api/stations/address-search?address=${searchText.value}`)

  const {
    data: stationIds,
    pending,
    refresh,
    error,
  } = useAsyncData<string[]>(
    endpoint.value,
    () => {
      if (searchText.value.length >= 3) {
        return $fetch(endpoint.value)
      }

      return Promise.resolve([])
    },
    {
      default: () => [],
    },
  )

  watch(searchText, () => refresh())

  return { stationIds, pending, refresh, error }
}
