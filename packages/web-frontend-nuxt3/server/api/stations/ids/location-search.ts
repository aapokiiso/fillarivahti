export default defineEventHandler(async (event) => {
  const query = useQuery(event)

  const latitude = Number(query.latitude)
  const longitude = Number(query.longitude)

  const { hslGraphqlEndpointUrl } = useRuntimeConfig()

  // TODO error handling

  const result = await $fetch<{
    data: {
      nearest: {
        edges: [
          {
            node: {
              place: {
                stationId: string,
                lat: number,
                lon: number,
              }
            }
          }
        ]
      }
    }
  }>(hslGraphqlEndpointUrl, {
    method: 'POST',
    body: {
      query:
`
{
  nearest(lat: ${latitude}, lon: ${longitude}, filterByPlaceTypes: BICYCLE_RENT) {
      edges {
          node {
              place {
                  ...on BikeRentalStation {
                      stationId
                  }
              }
          }
      }
  }
}
`,
    },
  })

  const { data } = result
  const { nearest } = data
  const { edges } = nearest

  // API does not offer full pagination
  const limit = Number(query.limit)
  const offset = Number(query.offset) || 0
  const edgesPage = limit
    ? edges.slice(offset, offset + limit)
    : edges

  const stationIds = edgesPage.map((edge) => {
    const { node } = edge
    const { place } = node
    const { stationId } = place

    return stationId
  })

  return { stationIds, totalCount: edges.length }
})
