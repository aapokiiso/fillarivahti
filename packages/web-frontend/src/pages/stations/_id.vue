<template>
  <main>
    <p v-if="$fetchState.pending">
      Fetching station...
    </p>
    <p v-else-if="$fetchState.error">
      Failed to fetch station.
    </p>
    <div v-else>
      <h1 v-if="station">
        {{ station.name }}
      </h1>
      <CapacityGraph
        :today-capacities="todayCapacities"
        :weekday-average-capacities="weekdayAverageCapacities"
      />
      <NuxtLink to="/">
        Back to stations
      </NuxtLink>
    </div>
  </main>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import { BikeStation, fetchStation } from '~/api/stations';
import { Capacity, fetchTodayForStation, fetchWeekdayAverageForStation } from '~/api/capacities';

export default defineComponent({
    data () {
        return {
            station: undefined as BikeStation|undefined,
            todayCapacities: [] as Capacity[],
            weekdayAverageCapacities: [] as Capacity[],
        };
    },
    async fetch () {
        const { context } = this.$nuxt;
        const stationId = context.params.id;

        const [station, todayCapacities, weekdayAverageCapacities] = await Promise.all([
            fetchStation(context.$hslGraphqlClient, stationId),
            fetchTodayForStation(context.$capacityClient, stationId),
            fetchWeekdayAverageForStation(context.$capacityClient, stationId),
        ]);

        this.station = station;
        this.todayCapacities = todayCapacities;
        this.weekdayAverageCapacities = weekdayAverageCapacities;
    },
});
</script>
