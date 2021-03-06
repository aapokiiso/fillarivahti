export default defineEventHandler(async (event) => {
  const { text = '' } = useQuery(event)
  const { addressSearchEndpointUrl } = useRuntimeConfig()

  // TODO error handling
  // TODO move limits to env config

  if (text.length >= 3 && text.length < 256) {
    const result = await $fetch<{
      features: {
        properties: {
          id: string
        }
      }[]
    }>(addressSearchEndpointUrl, {
      params: {
        text,
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
