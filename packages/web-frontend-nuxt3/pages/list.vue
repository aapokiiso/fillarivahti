<template>
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-8">
    <div v-if="!pending">
      <div v-if="stations.length" class="mt-2 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="station in stations" :key="station.stationId" class="bg-white overflow-hidden shadow rounded-lg">
          <BikeStationCard :station="station" />
        </div>
      </div>
      <p v-else-if="stationsError">
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
const { pending: stationIdsPending } = await useStationIds()
const { data: stations, pending: stationsPending, error: stationsError } = await useStations()

// Comparatively complicated pending logic below due to sequential pending
// states between station IDs and stations data. Need to stay pending over the
// duration of both fetches.

const pending = ref(false)

watch(stationIdsPending, (nowPending) => {
  if (nowPending === true) {
    pending.value = true
  } else {
    // Wait for next tick to check if stations have started loading. If not,
    // done pending.
    setTimeout(() => {
      if (stationsPending.value === false) {
        pending.value = false
      }
    })
  }
})

watch(stationsPending, (nowPending) => {
  if (nowPending === false) {
    pending.value = false
  }
})
</script>
