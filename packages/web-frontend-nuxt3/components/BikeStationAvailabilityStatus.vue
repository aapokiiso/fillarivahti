<template>
  <p class="text-lg font-medium text-gray-900">
    <span :class="availabilityStyle">
      {{ bikesAvailable }}
    </span>
    <span v-if="capacity" class="text-sm">
      / {{ capacity }}
    </span>
  </p>
</template>

<script setup lang="ts">
const props = defineProps({
  bikesAvailable: {
    type: Number,
    required: true,
  },
  capacity: {
    type: Number,
    required: true,
  },
  maxBadAvailability: {
    type: Number,
    default: 0.15,
  },
  maxLowAvailability: {
    type: Number,
    default: 0.325,
  },
})

const maxBadAvailabilityCount = computed(() => Math.round(props.capacity * props.maxBadAvailability))
const maxLowAvailabilityCount = computed(() => Math.round(props.capacity * props.maxLowAvailability))

const availabilityStyle = computed(() => {
  if (props.bikesAvailable <= maxBadAvailabilityCount.value) {
    return 'text-red-500'
  } else if (props.bikesAvailable <= maxLowAvailabilityCount.value) {
    return 'text-yellow-500'
  }

  return 'text-green-500'
})
</script>
