export const useBikeStationIdsByName = (name: string) => {
  const url = `/api/stations/ids/text-search?text=${name}`

  return useFetch<string[]>(url, { key: url, default: () => [] })
}

export const useBikeStationIdsByLocation = (coords: GeolocationCoordinates) => {
  const { latitude, longitude } = coords

  const url = `/api/stations/ids/location-search?latitude=${latitude}&longitude=${longitude}`

  return useFetch<string[]>(url, { key: url, default: () => [] })
}
