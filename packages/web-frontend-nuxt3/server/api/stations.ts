import { useQueryStationIds } from '../utils/useQueryStationIds'
import type { BikeStation } from '~/types/BikeStation'

export default defineEventHandler(async (event) => {
  const ids = useQueryStationIds(useQuery(event))
  const { hslGraphqlEndpointUrl } = useRuntimeConfig()

  // TODO error handling
  // TODO move limits to config

  if (hslGraphqlEndpointUrl && ids.length > 0 && ids.length < 10) {
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
