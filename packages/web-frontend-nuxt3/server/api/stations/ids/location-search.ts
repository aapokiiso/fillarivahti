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
                stationId: string
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

  const stationIds = edges.map((edge) => {
    const { node } = edge
    const { place } = node
    const { stationId } = place

    return stationId
  })

  return stationIds
})
