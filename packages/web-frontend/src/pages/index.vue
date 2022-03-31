<template>
    <main>
        <div class="content-wrapper">
            <StationSearch
                class="station-search"
                @search-pending="onStationSearchPending"
                @search-results="onStationSearchResults"
                @search-error="onStationSearchError"
            />

            <section class="station-list">
                <p v-if="isPending" class="station-list__pending">
                    {{ $t("stationList.pending") }}
                </p>

                <p v-if="isError" class="station-list__error">
                    {{ $t("stationList.error") }}
                </p>

                <div v-if="canShowStations">
                    <p v-if="!stations.length" class="station-list__empty">
                        {{ $t("stationList.empty") }}
                    </p>

                    <div
                        v-for="station in stations"
                        v-else
                        :key="station.stationId"
                    >
                        <StationCard :station="station">
                            <template #capacity-estimate>
                                <CapacityEstimate
                                    v-if="!isStationPending(station.stationId)"
                                    :station-capacity="station.capacity"
                                    :today-capacities="
                                        todayCapacities[station.stationId]
                                    "
                                    :weekday-average-capacities="
                                        weekdayAverageCapacities[
                                            station.stationId
                                        ]
                                    "
                                />
                            </template>

                            <template #capacity-trend>
                                <CapacityGraph
                                    v-if="!isStationPending(station.stationId)"
                                    :station-capacity="station.capacity"
                                    :today-capacities="
                                        todayCapacities[station.stationId]
                                    "
                                    :weekday-average-capacities="
                                        weekdayAverageCapacities[
                                            station.stationId
                                        ]
                                    "
                                />
                                <PuSkeleton
                                    v-else
                                    height="var(--space-unit-xxl)"
                                />
                            </template>
                        </StationCard>
                    </div>
                </div>
            </section>

            <AboutDriver class="about-driver" />
        </div>
    </main>
</template>

<script lang="ts">
// TODO:
// For some reason ESLint does not recognize the MetaInfo export. Have to
// investigate this later when cleaning up head & meta information.
// eslint-disable-next-line import/named
import { MetaInfo } from 'vue-meta';
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
    head (): MetaInfo {
        const i18nHead = this.$nuxtI18nHead({ addSeoAttributes: true });

        return {
            title: this.$t('siteTitle') as string,
            htmlAttrs: {
                ...i18nHead.htmlAttrs,
            },
            link: [...i18nHead.link],
            meta: [
                {
                    hid: 'description',
                    name: 'description',
                    content: this.$t('siteDescription') as string,
                },
                ...i18nHead.meta,
            ],
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
        isStationPending (stationId: string): boolean {
            return !(
                this.todayCapacities[stationId]
                && this.weekdayAverageCapacities[stationId]
            );
        },
        async loadStations (stationIds: string[]): Promise<void> {
            this.isError = false;

            if (!stationIds.length) {
                this.stations = [];
                this.todayCapacities = {};
                this.weekdayAverageCapacities = {};

                return;
            }

            const { context } = this.$nuxt;

            if (process.client) {
                if (this.cancelToken) {
                    this.cancelToken.cancel();
                }
                this.cancelToken = this.$axios.CancelToken.source();
            }

            this.isPending = true;

            try {
                this.stations = await fetchStationsByIds(
                    context.$hslGraphqlClient,
                    stationIds,
                    {
                        cancelToken: this.cancelToken
                            ? this.cancelToken.token
                            : undefined,
                    },
                );

                this.isPending = false;
            } catch (error) {
                this.isPending = false;

                if (!this.$axios.isCancel(error)) {
                    console.error(error);

                    this.isError = true;
                }
            }

            try {
                const [todayCapacities, weekdayAverageCapacities]
                    = await Promise.all([
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

                this.todayCapacities = todayCapacities;
                this.weekdayAverageCapacities = weekdayAverageCapacities;
            } catch (error) {
                if (!this.$axios.isCancel(error)) {
                    console.error(error);

                    // Initialize capacities as empty in case of an error.

                    this.todayCapacities = stationIds.reduce(
                        (
                            acc: Record<string, Capacity[]>,
                            stationId: string,
                        ) => {
                            acc[stationId] = [];

                            return acc;
                        },
                        {},
                    );

                    this.weekdayAverageCapacities = Object.assign(
                        {},
                        this.todayCapacities,
                    );
                }
            }
        },
    },
});
</script>

<style lang="scss" scoped>
.about-driver,
.station-search {
    margin: var(--space-unit-sm) 0;
}

.station-list {
    margin: var(--space-unit) 0;
}
</style>
