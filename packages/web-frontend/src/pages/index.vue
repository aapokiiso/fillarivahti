<template>
    <main>
        <div class="content-wrapper">
            <StationSearch
                @search-pending="onStationSearchPending"
                @search-results="onStationSearchResults"
                @search-error="onStationSearchError"
            />

            <p v-if="isPending" class="station-list__pending">
                Fetching stations...
            </p>

            <p v-if="isError" class="station-list__error">
                Something went wrong :(
            </p>

            <section v-if="canShowStations" class="station-list">
                <p v-if="!stations.length" class="station-list__empty">
                    No stations found.
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
import { CancelTokenSource } from 'axios';
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
            isPending: false,
            isError: false,
        };
    },
    computed: {
        canShowStations () {
            return !this.isPending && !this.isError;
        },
    },
    methods: {
        onStationSearchPending (): void {
            this.isError = false;
            this.isPending = true;
        },
        onStationSearchResults (stationIds: string[]): void {
            this.isPending = false;

            this.loadStations(stationIds);
        },
        onStationSearchError (): void {
            this.isPending = false;
            this.isError = true;
        },
        async loadStations (stationIds: string[]): Promise<void> {
            const { context } = this.$nuxt;

            if (process.client) {
                if (this.cancelToken) {
                    this.cancelToken.cancel();
                }
                this.cancelToken = this.$axios.CancelToken.source();
            }

            this.isError = false;
            this.isPending = true;

            try {
                if (stationIds.length) {
                    const [
                        stations,
                        todayCapacities,
                        weekdayAverageCapacities,
                    ] = await Promise.all([
                        fetchStationsByIds(
                            context.$hslGraphqlClient,
                            stationIds,
                            {
                                cancelToken: this.cancelToken
                                    ? this.cancelToken.token
                                    : undefined,
                            },
                        ),
                        fetchTodayForStations(
                            context.$capacityClient,
                            stationIds,
                            {
                                cancelToken: this.cancelToken
                                    ? this.cancelToken.token
                                    : undefined,
                            },
                        ),
                        fetchWeekdayAverageForStations(
                            context.$capacityClient,
                            stationIds,
                            {
                                cancelToken: this.cancelToken
                                    ? this.cancelToken.token
                                    : undefined,
                            },
                        ),
                    ]);

                    this.stations = stations;
                    this.todayCapacities = todayCapacities;
                    this.weekdayAverageCapacities = weekdayAverageCapacities;
                } else {
                    this.stations = [];
                    this.todayCapacities = {};
                    this.weekdayAverageCapacities = {};
                }

                this.isPending = false;
            } catch (error) {
                if (!this.$axios.isCancel(error)) {
                    this.isError = true;
                }
            }
        },
    },
});
</script>

<style lang="scss" scoped>
.station-list {
    margin-top: var(--space-unit);
}
</style>
