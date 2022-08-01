<template>
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-8">
    <div v-if="!pending">
      <div v-if="stations.length" class="mt-2 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="station in stations" :key="station.stationId" class="bg-white overflow-hidden shadow rounded-lg">
          <BikeStationCard :station="station" :estimated-availability="getFurthestEstimatedAvailability(station.stationId)" />
        </div>
      </div>
      <p v-else-if="stationIdsError || stationsError">
        Failed to load stations.
      </p>
      <p v-else>
        No stations found.
      </p>
    </div>
    <p v-else>
      Loading...
    </p>
  </div>
</template>

<script setup lang="ts">
import { BikeStationAvailability } from '~/types/BikeStation.js'

const address = useSearchText()

const pending = ref(true)

const { data: stationIds, error: stationIdsError } = await useStationIdsByAddress(address.value)
const { data: stations, error: stationsError } = await useStationsByIds(stationIds.value)
const { data: estimatedAvailabilities } = await useEstimatedBikeStationAvailabilities(stationIds.value)

pending.value = false

const route = useRoute()
watch(address, async (newAddress) => {
  // Avoid empty load when search query is removed from the URL when navigating
  // to another page.
  if (route.name === 'list') {
    pending.value = true

    const { data: newStationIds, error: newStationIdsError } = await useStationIdsByAddress(newAddress)
    stationIds.value = newStationIds.value
    stationIdsError.value = newStationIdsError.value

    const { data: newStations, error: newStationsError } = await useStationsByIds(stationIds.value)
    stations.value = newStations.value
    stationsError.value = newStationsError.value

    const { data: newEstimatedAvailabilities } = await useEstimatedBikeStationAvailabilities(stationIds.value)
    estimatedAvailabilities.value = newEstimatedAvailabilities.value

    pending.value = false
  }
})

const getFurthestEstimatedAvailability = (stationId: string): BikeStationAvailability|null => {
  const stationEstimates = estimatedAvailabilities.value[stationId] || []

  return stationEstimates.length
    ? stationEstimates[stationEstimates.length - 1]
    : null
}
</script>
