import { parseStationIdsFromQuery } from '../../../utils/parseStationIdsFromQuery'
import { BikeStationAvailabilityResponse } from '~/types/BikeStation'

export default defineEventHandler((event) => {
  const ids = parseStationIdsFromQuery(useQuery(event))
  const { availabilityEndpointUrl } = useRuntimeConfig()

  // TODO error handling

  return $fetch<Record<string, BikeStationAvailabilityResponse[]>>('/weekday-average', {
    baseURL: availabilityEndpointUrl,
    params: {
      stationIds: ids,
    },
  })
})
