<template>
  <main>
    <p v-if="$fetchState.pending">
      Fetching stations...
    </p>
    <p v-else-if="$fetchState.error">
      Failed to fetch stations.
    </p>
    <div v-else>
      <ul v-for="station in stations" :key="station.stationId">
        <li>{{ station.name }}</li>
      </ul>
    </div>
  </main>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import { BikeStation, fetchStations } from '@/api/stations';

export default defineComponent({
    data () {
        return {
            stations: [] as BikeStation[],
        };
    },
    async fetch () {
        this.stations = await fetchStations();
    },
});
</script>
