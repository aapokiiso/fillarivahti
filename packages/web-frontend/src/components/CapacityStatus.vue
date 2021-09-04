<template>
    <p class="capacity-status">
        <span>{{ $t('capacityStatus') }}</span>
        <span class="capacity-status__bikes-available">{{
            bikesAvailable
        }}</span>
        <span v-if="capacity">/</span>
        <span v-if="capacity">{{ capacity }}</span>
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
    },
});
</script>

<style lang="scss" scoped>
.capacity-status {
    color: var(--color-mid-gray-accent);
    font-size: var(--font-size-sm);
    margin: 0;
}

.capacity-status__bikes-available {
    font-weight: bold;
}
</style>
