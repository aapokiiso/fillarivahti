<template>
    <article class="station-card">
        <h3 class="station-card__title">
            {{ station.name }}
        </h3>

        <CapacityStatus
            :bikes-available="station.bikesAvailable"
            :capacity="station.capacity"
            class="station-card__capacity-status"
        />

        <figure class="station-card__capacity-trend">
            <slot name="capacity-trend" />
        </figure>
    </article>
</template>

<script lang="ts">
// ESLint does not recognized PropType exported by the Composition API.
// eslint-disable-next-line import/named
import { defineComponent, PropType } from '@vue/composition-api';
import { BikeStation } from '~/api/stations';

export default defineComponent({
    props: {
        station: {
            type: Object as PropType<BikeStation>,
            required: true,
        },
    },
});
</script>

<style lang="scss" scoped>
.station-card {
    background-color: var(--color-white);
    border: 1px solid var(--color-light-gray-accent);
    border-radius: var(--space-unit-sm);
    margin: var(--space-unit-xs) 0;
    padding: var(--space-unit-sm) var(--space-unit);
}

.station-card__title {
    font-size: 1rem;
    margin: 0;
}
</style>
