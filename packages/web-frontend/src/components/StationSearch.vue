<template>
    <nav class="station-search">
        <SearchIcon class="station-search__search-icon" />
        <input
            v-model="queryInput"
            type="text"
            class="station-search__query-input"
            :placeholder="$t('stationSearch.inputPlaceholder')"
            :title="$t('stationSearch.inputHelp')"
            :aria-label="$t('stationSearch.inputHelp')"
            @input="onQueryInputDebounced"
        >
        <button
            class="station-search__location-button"
            :title="$t('stationSearch.locationHelp')"
            :aria-label="$t('stationSearch.locationHelp')"
            :class="{ 'is-active': location }"
            @click="onLocationButtonClick"
        >
            <LocationIcon class="station-search__location-icon" />
        </button>
    </nav>
</template>

<script lang="ts">
import { CancelTokenSource } from 'axios';
import { debounce } from 'debounce';
import { defineComponent } from '@vue/composition-api';
import {
    findStationIdsByAddress,
    findStationIdsByLocation,
    Location,
} from '~/api/stations';
import SearchIcon from '~/assets/icons/search-solid.svg?inline';
import LocationIcon from '~/assets/icons/map-marker-alt-solid.svg?inline';

export default defineComponent({
    components: {
        SearchIcon,
        LocationIcon,
    },
    props: {
        minQueryLength: {
            type: Number,
            default: 3,
        },
        inputDebounceMillis: {
            type: Number,
            default: 300,
        },
    },
    data () {
        return {
            cancelToken: null as CancelTokenSource | null,
            queryInput: '',
            // Location will be undefined when not set and null when requested
            // but rejected.
            location: undefined as Location | null | undefined,
        };
    },
    computed: {
        query (): string {
            return this.queryInput.trim();
        },
        isValidQuery (): boolean {
            return this.query.length >= this.minQueryLength;
        },
    },
    watch: {
        location () {
            if (typeof this.location !== 'undefined') {
                this.searchByLocation();
            }
        },
    },
    created () {
        // Debounced / throttled methods can't be added directly to methods,
        // since that messes up their 'this' scoping.
        this.onQueryInputDebounced = debounce(
            this.onQueryInput,
            this.inputDebounceMillis,
        );
    },
    methods: {
        onQueryInput () {
            this.location = undefined;

            if (this.isValidQuery) {
                this.searchByQuery();
            }
        },
        onLocationButtonClick () {
            this.queryInput = '';

            this.updateLocation();
        },
        async searchByQuery (): Promise<void> {
            const { context } = this.$nuxt;

            if (process.client) {
                if (this.cancelToken) {
                    this.cancelToken.cancel();
                }
                this.cancelToken = this.$axios.CancelToken.source();
            }

            this.$emit('search-pending');

            try {
                const stationIds = await findStationIdsByAddress(
                    context.$addressSearchClient,
                    this.query,
                    {
                        cancelToken: this.cancelToken
                            ? this.cancelToken.token
                            : undefined,
                    },
                );

                this.$emit('search-results', stationIds);
            } catch (error) {
                if (!this.$axios.isCancel(error)) {
                    this.$emit('search-error');
                }
            }
        },
        async searchByLocation (): Promise<void> {
            const { context } = this.$nuxt;

            try {
                if (process.client) {
                    if (this.cancelToken) {
                        this.cancelToken.cancel();
                    }
                    this.cancelToken = this.$axios.CancelToken.source();
                }

                this.$emit('search-pending');

                if (this.location) {
                    const stationIds = await findStationIdsByLocation(
                        context.$hslGraphqlClient,
                        this.location,
                        {
                            cancelToken: this.cancelToken
                                ? this.cancelToken.token
                                : undefined,
                        },
                    );

                    this.$emit('search-results', stationIds);
                } else {
                    this.$emit('search-results', []);
                }
            } catch (error) {
                if (!this.$axios.isCancel(error)) {
                    this.$emit('search-error');
                }
            }
        },
        async updateLocation (): Promise<void> {
            if (process.client) {
                const locationRequest: Promise<Location> = new Promise(
                    (resolve, reject) => {
                        navigator.geolocation.getCurrentPosition(
                            (position: any) =>
                                resolve(position.coords),
                            reject,
                        );
                    },
                );

                try {
                    this.location = await locationRequest;
                } catch (error) {
                    console.error(error);

                    this.location = null;
                }
            }
        },
    },
});
</script>

<style lang="scss" scoped>
/// Footnotes:
/// [1] Account for icons overlaid on top of the search input.

.station-search {
    position: relative;
}

.station-search__query-input {
    border-radius: var(--space-unit-xxs);
    border: 1px solid var(--color-light-gray-accent);
    padding: var(--space-unit-sm) calc(3 * var(--space-unit)); // [1]
    font-size: var(--font-size);
    width: 100%;
}

.station-search__search-icon {
    position: absolute;
    color: var(--color-mid-gray);
    width: var(--space-unit);
    left: var(--space-unit);
    top: 50%;
    transform: translateY(-50%);
}

.station-search__location-button {
    position: absolute;
    border: none;
    background: none;
    font-size: var(--font-size);
    padding: 0 var(--space-unit);
    color: var(--color-dark-gray);
    right: 0;
    top: 0;
    height: 100%;
    cursor: pointer;

    &.is-active {
        color: var(--color-yellow);
    }
}

.station-search__location-icon {
    width: var(--space-unit);
}
</style>
