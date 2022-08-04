export default defineEventHandler(async (event) => {
  const query = useQuery(event)
  const { addressSearchEndpointUrl, maxSearchTextLength } = useRuntimeConfig()

  // TODO error handling

  const text = String(query.text) || ''

  if (text.length >= 3 && text.length <= maxSearchTextLength) {
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

    // API does not offer full pagination
    const limit = Number(query.limit)
    const offset = Number(query.offset) || 0
    const featuresPage = limit
      ? features.slice(offset, offset + limit)
      : features

    const stationIds = featuresPage.map(({ properties }) => properties.id)

    return { stationIds, totalCount: features.length }
  }

  return { stationIds: [], totalCount: 0 }
})
