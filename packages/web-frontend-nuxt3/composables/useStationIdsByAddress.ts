export const useStationIdsByAddress = (address: string) => {
  const url = `/api/stations/address-search?address=${address}`

  return useFetch<string[]>(url, { key: url, default: () => [] })
}
