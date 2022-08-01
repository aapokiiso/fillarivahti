import { parseStationIdsFromQuery } from '../../../utils/parseStationIdsFromQuery'
import { BikeStationAvailabilityResponse } from '~/types/BikeStation'

export default defineEventHandler(async (event) => {
  const stationIds = parseStationIdsFromQuery(useQuery(event))
  const { availabilityEndpointUrl } = useRuntimeConfig()

  // TODO error handling

  const todayAvailabilities = await $fetch<Record<string, BikeStationAvailabilityResponse[]>>('/today', {
    baseURL: availabilityEndpointUrl,
    params: {
      stationIds,
    },
  })

  const weekdayAverageAvailabilities = await $fetch<Record<string, BikeStationAvailabilityResponse[]>>('/weekday-average', {
    baseURL: availabilityEndpointUrl,
    params: {
      stationIds,
    },
  })
})
