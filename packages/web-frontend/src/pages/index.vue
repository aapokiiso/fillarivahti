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
        <li>
          <NuxtLink :to="{name: 'stations-id', params: {id: station.stationId}}">
            {{ station.name }}
          </NuxtLink>
        </li>
      </ul>
    </div>
  </main>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import { BikeStation, fetchStations } from '~/api/stations';

export default defineComponent({
    data () {
        return {
            stations: [] as BikeStation[],
        };
    },
    async fetch () {
        // eslint-disable-next-line no-warning-comments
        // TODO: Implement proper station search
        this.stations = await fetchStations(['062', '162']);
    },
});
</script>
