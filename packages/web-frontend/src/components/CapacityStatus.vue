<template>
    <p class="capacity-status" :aria-label="ariaLabel">
        <span v-if="label" class="capacity-status__label">
            {{ label }}
        </span>

        <span class="capacity-status__value">
            <span class="capacity-status__available" :class="availabilityClassName">
                {{ bikesAvailable }}
            </span>
            <span v-if="capacity" class="capacity-status__capacity">
                / {{ capacity }}
            </span>
        </span>
    </p>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
    props: {
        label: {
            type: String,
            default: null,
        },
        ariaLabel: {
            type: String,
            default: null,
        },
        bikesAvailable: {
            type: Number,
            required: true,
        },
        capacity: {
            type: Number,
            required: false,
            default: 0,
        },
        maxBadAvailability: {
            type: Number,
            default: 0.15,
        },
        maxLowAvailability: {
            type: Number,
            default: 0.325,
        },
    },
    computed: {
        availabilityPercentage (): number {
            return this.bikesAvailable / this.capacity;
        },
        maxBadAvailabilityCount (): number {
            return Math.round(this.capacity * this.maxBadAvailability);
        },
        maxLowAvailabilityCount (): number {
            return Math.round(this.capacity * this.maxLowAvailability);
        },
        availabilityClassName (): string {
            if (this.bikesAvailable <= this.maxBadAvailabilityCount) {
                return 'is-bad';
            } else if (this.bikesAvailable <= this.maxLowAvailabilityCount) {
                return 'is-low';
            }

            return 'is-good';
        },
    },
});
</script>

<style lang="scss" scoped>
.capacity-status {
    margin: 0;
    display: flex;
    align-items: center;
    font-size: var(--font-size-sm);
}

.capacity-status__label {
    margin: 0;
    display: flex;

    &::after {
        content: ':';
    }
}

.capacity-status__value {
    margin-left: var(--space-unit-xs);
}

.capacity-status__available {
    font-weight: bold;
    font-size: var(--font-size);

    &.is-bad {
        color: var(--color-red);
    }

    &.is-low {
        color: var(--color-yellow);
    }

    &.is-good {
        color: var(--color-green);
    }
}
</style>
