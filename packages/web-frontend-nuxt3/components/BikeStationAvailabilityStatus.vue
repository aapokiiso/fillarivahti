<template>
  <p class="font-medium text-gray-900">
    <span v-if="isEstimate && bikesAvailable !== null" class="mr-1 text-gray-500 font-bold">~</span>
    <span :class="availabilityStyle" class="text-lg">
      {{ bikesAvailable !== null ? bikesAvailable : '-' }}
    </span>
    <span v-if="capacity" class="ml-1">
      / {{ capacity }}
    </span>
  </p>
</template>

<script setup lang="ts">
const props = defineProps({
  bikesAvailable: {
    type: Number,
    default: null,
  },
  capacity: {
    type: Number,
    default: null,
  },
  maxBadAvailability: {
    type: Number,
    default: 0.15,
  },
  maxLowAvailability: {
    type: Number,
    default: 0.325,
  },
  isEstimate: {
    type: Boolean,
    default: false,
  },
})

const maxBadAvailabilityCount = computed(() => Math.round(props.capacity * props.maxBadAvailability))
const maxLowAvailabilityCount = computed(() => Math.round(props.capacity * props.maxLowAvailability))

const availabilityStyle = computed(() => {
  if (props.bikesAvailable === null) {
    return 'text-gray-500'
  } else if (props.bikesAvailable <= maxBadAvailabilityCount.value) {
    return 'text-red-500'
  } else if (props.bikesAvailable <= maxLowAvailabilityCount.value) {
    return 'text-yellow-500'
  }

  return 'text-green-500'
})
</script>
