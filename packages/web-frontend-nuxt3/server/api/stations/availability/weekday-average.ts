import { parseStationIdsFromQuery } from '~/helpers/parseStationIdsFromQuery'
import { BikeStationAvailabilityResponse } from '~/types/BikeStation'

export default defineEventHandler(async (event) => {
  const stationIds = parseStationIdsFromQuery(useQuery(event))
  const { availabilityEndpointUrl } = useRuntimeConfig()

  // TODO error handling
  // TODO pagination (max IDs limit)

  if (stationIds.length > 0) {
    return await $fetch<Record<string, BikeStationAvailabilityResponse[]>>('/weekday-average', {
      baseURL: availabilityEndpointUrl,
      params: {
        stationIds,
      },
    })
  }

  return []
})
