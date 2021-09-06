<template>
    <p
        class="capacity-status"
        :title="$t('capacityStatus.title')"
        :aria-label="
            $t('capacityStatus.ariaLabel', {
                bikesAvailable,
                capacity,
            })
        "
    >
        <span
            class="capacity-status__available"
            :class="{
                'is-high': isHighAvailability,
                'is-mid': isMidAvailability,
                'is-low': isLowAvailability,
            }"
        >
            {{ bikesAvailable }}
        </span>
        <span v-if="capacity" class="capacity-status__capacity">
            / {{ capacity }}
        </span>
    </p>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
    props: {
        bikesAvailable: {
            type: Number,
            required: true,
        },
        capacity: {
            type: Number,
            required: false,
            default: 0,
        },
        highAvailabilityLimit: {
            type: Number,
            default: 10,
        },
        midAvailabilityLimit: {
            type: Number,
            default: 6,
        },
    },
    computed: {
        isHighAvailability (): boolean {
            return this.bikesAvailable >= this.highAvailabilityLimit;
        },
        isMidAvailability (): boolean {
            return (
                this.bikesAvailable >= this.midAvailabilityLimit
                && this.bikesAvailable < this.highAvailabilityLimit
            );
        },
        isLowAvailability (): boolean {
            return this.bikesAvailable < this.midAvailabilityLimit;
        },
    },
});
</script>

<style lang="scss" scoped>
.capacity-status {
    margin: 0;
}

.capacity-status__available {
    font-weight: bold;

    &.is-low {
        color: var(--color-red);
    }

    &.is-mid {
        color: var(--color-yellow);
    }

    &.is-high {
        color: var(--color-green);
    }
}

.capacity-status__capacity {
    font-size: var(--font-size-sm);
}
</style>
