<template>
    <main>
        <div class="content-wrapper">
            <StationSearch
                @search-results="onStationSearchResults"
            />
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
import axios, { CancelTokenSource } from 'axios';
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
            cancelToken: null as CancelTokenSource | null,
        };
    },
    async fetch () {
        // TODO: Implement proper station search

        const demoStationIds = ['062', '162'];

        await this.loadStations(demoStationIds);
    },
    methods: {
        onStationSearchResults (stationIds: string[]): void {
            this.loadStations(stationIds);
        },
        async loadStations (stationIds: string[]): Promise<void> {
            const { context } = this.$nuxt;

            if (this.cancelToken) {
                this.cancelToken.cancel();
            }
            this.cancelToken = axios.CancelToken.source();

            try {
                const [stations, todayCapacities, weekdayAverageCapacities]
                = await Promise.all([
                    fetchStationsByIds(context.$hslGraphqlClient, stationIds, {
                        cancelToken: this.cancelToken.token,
                    }),
                    fetchTodayForStations(context.$capacityClient, stationIds, {
                        cancelToken: this.cancelToken.token,
                    }),
                    fetchWeekdayAverageForStations(
                        context.$capacityClient,
                        stationIds,
                        { cancelToken: this.cancelToken.token },
                    ),
                ]);

                this.stations = stations;
                this.todayCapacities = todayCapacities;
                this.weekdayAverageCapacities = weekdayAverageCapacities;
            } catch (error) {
                if (!axios.isCancel(error)) {
                    // TODO: show error
                }
            }
        },
    },
});
</script>
