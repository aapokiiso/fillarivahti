import { parseStationIdsFromQuery } from '~/helpers/parseStationIdsFromQuery'
import { BikeStationAvailabilityResponse } from '~/types/BikeStation'

export default defineEventHandler((event) => {
  const stationIds = parseStationIdsFromQuery(useQuery(event))
  const { availabilityEndpointUrl } = useRuntimeConfig()

  // TODO error handling

  return $fetch<Record<string, BikeStationAvailabilityResponse[]>>('/today', {
    baseURL: availabilityEndpointUrl,
    params: {
      stationIds,
    },
  })
})
