<template>
    <nav class="station-search">
        <input
            v-model="queryInput"
            type="text"
            class="station-search__query"
            placeholder="Search stations..."
            title="Search for stations by their name or address"
            @input="onQueryInputDebounced"
        >
    </nav>
</template>

<script lang="ts">
import axios, { CancelTokenSource } from 'axios';
import { debounce } from 'debounce';
import { defineComponent } from '@vue/composition-api';
import { findStationIdsByAddress } from '~/api/stations';

export default defineComponent({
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
            queryInput: '',
            cancelToken: null as CancelTokenSource | null,
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
    created () {
        this.onQueryInputDebounced = debounce(this.onQueryInput, this.inputDebounceMillis);
    },
    methods: {
        onQueryInput () {
            if (this.isValidQuery) {
                this.searchByQuery();
            }
        },
        async searchByQuery (): Promise<void> {
            const { context } = this.$nuxt;

            if (this.cancelToken) {
                this.cancelToken.cancel();
            }
            this.cancelToken = axios.CancelToken.source();

            this.$emit('search-pending');

            try {
                const stationIds = await findStationIdsByAddress(
                    context.$addressSearchClient,
                    this.query,
                    {
                        cancelToken: this.cancelToken.token,
                    },
                );

                this.$emit('search-results', stationIds);
            } catch (error) {
                if (!axios.isCancel(error)) {
                    this.$emit('search-error');
                }
            }
        },
    },
});
</script>
