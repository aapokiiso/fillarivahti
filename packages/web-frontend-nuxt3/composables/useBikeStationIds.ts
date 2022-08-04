export const useBikeStationIdsByName = (name: string, { page, pageSize }: { page: number, pageSize: number }) => {
  const pageIndex = Math.max(page, 1) - 1
  const offset = pageIndex * pageSize

  const url = `/api/stations/ids/text-search?text=${name}&limit=${pageSize}&offset=${offset}`

  return useFetch<{stationIds: string[], totalCount: number}>(url, {
    key: url,
    default: () => ({ stationIds: [], totalCount: 0 }),
  })
}

export const useBikeStationIdsByLocation = (coords: GeolocationCoordinates, { page, pageSize }: { page: number, pageSize: number }) => {
  const { latitude, longitude } = coords

  const pageIndex = Math.max(page, 1) - 1
  const offset = pageIndex * pageSize

  const url = `/api/stations/ids/location-search?latitude=${latitude}&longitude=${longitude}&limit=${pageSize}&offset=${offset}`

  return useFetch<{stationIds: string[], totalCount: number}>(url, {
    key: url,
    default: () => ({ stationIds: [], totalCount: 0 }),
  })
}
