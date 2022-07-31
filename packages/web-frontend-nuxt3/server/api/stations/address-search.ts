export default defineEventHandler(async (event) => {
  const { address = '' } = useQuery(event)
  const { addressSearchEndpointUrl } = useRuntimeConfig()

  // TODO error handling
  // TODO move limits to env config

  if (address.length >= 3) {
    const result = await $fetch<{
      features: {
        properties: {
          id: string
        }
      }[]
    }>(addressSearchEndpointUrl, {
      params: {
        text: address,
        sources: 'citybikessmoove,citybikesvantaa',
        layers: 'bikestation',
      },
    })

    const { features } = result

    const stationIds = features.map(({ properties }) => properties.id)

    return stationIds
  }

  return []
})
