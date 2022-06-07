<template>
  <div>
    <ol v-if="!stationsPending">
      <li v-for="station in stations" :key="station.stationId">
        {{ station.name }}
      </li>
    </ol>
    <p v-else>
      Loading...
    </p>
  </div>
</template>

<script setup>
const { stations, pending: stationsPending } = await useStations()
</script>
