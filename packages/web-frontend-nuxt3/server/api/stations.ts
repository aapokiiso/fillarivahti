import { parseStationIdsFromQuery } from '~/helpers/parseStationIdsFromQuery'
import type { BikeStation } from '~/types/BikeStation'

export default defineEventHandler(async (event) => {
  const ids = parseStationIdsFromQuery(useQuery(event))
  const { hslGraphqlEndpointUrl } = useRuntimeConfig()

  // TODO error handling

  if (ids.length > 0) {
    const idFilter = ids
      ? `(ids: [${ids.map(id => `"${id}"`).join(',')}])`
      : ''

    const result = await $fetch<{
      data: {
        bikeRentalStations: BikeStation[]
      }
    }>(hslGraphqlEndpointUrl, {
      method: 'POST',
      body: {
        query:
`
{
    bikeRentalStations${idFilter} {
        stationId
        name
        bikesAvailable
        capacity
        lat
        lon
    }
}
`,
      },
    })

    const { data } = result
    const { bikeRentalStations = [] } = data

    return bikeRentalStations
  }

  return []
})
