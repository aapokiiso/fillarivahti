export const useBikeStationIdsByName = (name: string) => {
  const url = `/api/stations/ids-search?q=${name}`

  return useFetch<string[]>(url, { key: url, default: () => [] })
}
