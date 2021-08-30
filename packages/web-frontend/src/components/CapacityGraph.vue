<template>
  <div>
    <p v-if="currentCapacity">
      Current capacity: <span>{{ currentCapacity.capacity }}</span>
    </p>

    <p>Today's capacity: <span>{{ todayCapacities.map(capacity => capacity.capacity).join(', ') }}</span></p>
    <p>Weekday's average capacity: <span>{{ weekdayAverageCapacities.map(capacity => capacity.capacity).join(', ') }}</span></p>
  </div>
</template>

<script lang="ts">
// For some reason ESLint doesn't recognize PropType exported by the Composition API.
// eslint-disable-next-line import/named
import { defineComponent, PropType } from '@vue/composition-api';
import { Capacity } from '@/api/capacities';

export default defineComponent({
    props: {
        todayCapacities: {
            type: Array as PropType<Capacity[]>,
            required: true,
        },
        weekdayAverageCapacities: {
            type: Array as PropType<Capacity[]>,
            required: true,
        },
    },
    computed: {
        currentCapacity (): Capacity|null {
            const todayCapacities = this.todayCapacities as Capacity[];

            return todayCapacities.length
                ? todayCapacities[todayCapacities.length - 1]
                : null;
        },
    },
});
</script>
