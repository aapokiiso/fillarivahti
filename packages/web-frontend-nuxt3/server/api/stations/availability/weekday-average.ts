import { parseStationIdsFromQuery } from '../../../utils/parseStationIdsFromQuery'
import { BikeStationAvailabilityPlain } from '~/types/BikeStation'

export default defineEventHandler((event) => {
  const ids = parseStationIdsFromQuery(useQuery(event))
  const { availabilityEndpointUrl } = useRuntimeConfig()

  // TODO error handling

  return $fetch<Record<string, BikeStationAvailabilityPlain[]>>('/weekday-average', {
    baseURL: availabilityEndpointUrl,
    params: {
      stationIds: ids,
    },
  })
})
