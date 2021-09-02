<template>
    <main>
        <div class="content-wrapper">
            <section class="station-list">
                <p v-if="$fetchState.pending">
                    Fetching stations...
                </p>
                <p v-else-if="$fetchState.error">
                    Failed to fetch stations.
                </p>
                <div
                    v-for="station in stations"
                    v-else
                    :key="station.stationId"
                >
                    <StationCard :station="station">
                        <template #capacity-trend>
                            <CapacityGraph
                                :today-capacities="
                                    todayCapacities[station.stationId]
                                "
                                :weekday-average-capacities="
                                    weekdayAverageCapacities[station.stationId]
                                "
                            />
                        </template>
                    </StationCard>
                </div>
            </section>
        </div>
    </main>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import {
    Capacity,
    fetchTodayForStations,
    fetchWeekdayAverageForStations,
} from '~/api/capacities';
import { BikeStation, fetchStationsByIds } from '~/api/stations';

export default defineComponent({
    data () {
        return {
            stations: [] as BikeStation[],
            todayCapacities: {} as Record<string, Capacity[]>,
            weekdayAverageCapacities: {} as Record<string, Capacity[]>,
        };
    },
    async fetch () {
        const { context } = this.$nuxt;

        // eslint-disable-next-line no-warning-comments
        // TODO: Implement proper station search

        const demoStationIds = ['062', '162'];

        const [stations, todayCapacities, weekdayAverageCapacities]
            = await Promise.all([
                fetchStationsByIds(context.$hslGraphqlClient, demoStationIds),
                fetchTodayForStations(context.$capacityClient, demoStationIds),
                fetchWeekdayAverageForStations(
                    context.$capacityClient,
                    demoStationIds,
                ),
            ]);

        this.stations = stations;
        this.todayCapacities = todayCapacities;
        this.weekdayAverageCapacities = weekdayAverageCapacities;
    },
});
</script>
