<template>
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-8">
    <div v-if="!stationsPending" class="mt-2 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <div v-for="station in stations" :key="station.stationId" class="bg-white overflow-hidden shadow rounded-lg">
        <BikeStationCard :station="station" />
      </div>
    </div>
    <p v-else>
      Loading...
    </p>
  </div>
</template>

<script setup lang="ts">
const { stations, pending: stationsPending } = useStations()
</script>
