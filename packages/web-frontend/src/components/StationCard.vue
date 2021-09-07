<template>
    <article class="station-card">
        <header class="station-card__header">
            <h3 class="station-card__title">
                <span>{{ station.name }}</span>
                <a
                    :href="getExternalLinkUrl"
                    target="_blank"
                    class="station-card__external-link"
                    :title="$t('stationCard.journeyPlannerLinkLabel')"
                    :aria-label="$t('stationCard.journeyPlannerLinkLabel')"
                >
                    <ExternalLinkIcon />
                </a>
            </h3>

            <CapacityStatus
                :bikes-available="station.bikesAvailable"
                :capacity="station.capacity"
                class="station-card__capacity-status"
            />
        </header>

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
import ExternalLinkIcon from '~/assets/icons/external-link-alt-solid.svg?inline';

export default defineComponent({
    components: {
        ExternalLinkIcon,
    },
    props: {
        station: {
            type: Object as PropType<BikeStation>,
            required: true,
        },
    },
    computed: {
        getExternalLinkUrl (): string {
            return (
                `https://reittiopas.hsl.fi/pyoraasemat/${
                    this.station.stationId}`
            );
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

.station-card__header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
}

.station-card__title {
    display: flex;
    align-items: center;
    font-size: var(--font-size);
    margin: 0;
}

.station-card__external-link {
    width: var(--space-unit);
    height: var(--space-unit);
    margin-left: var(--space-unit-sm);
    color: var(--color-light-gray-accent);
    transition: color var(--transition-time);

    &:hover,
    &:focus {
        color: var(--color-blue);
    }
}
</style>
