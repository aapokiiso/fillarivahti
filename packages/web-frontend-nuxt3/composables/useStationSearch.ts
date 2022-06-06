export const useStationSearch = () => {
  // TODO: fix any type
  const idsByText = async (searchText: string): Promise<any> => {
    const { data, pending, refresh, error } = await useFetch<{
        features: {
            properties: {
                id: string,
            }
        }[]
    }>('/', {
      baseURL: 'https://api.digitransit.fi/geocoding/v1/search', // TODO from env
      params: {
        text: searchText,
        sources: 'citybikessmoove,citybikesvantaa',
        layers: 'bikestation'
      },
      pick: ['features']
    })

    const { features } = data.value

    const stationIds = features.map(({ properties }) => properties.id)

    return { data: stationIds, pending, refresh, error }
  }

  return { idsByText }
}
