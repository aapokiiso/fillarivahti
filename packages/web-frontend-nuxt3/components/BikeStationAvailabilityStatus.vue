<template>
  <p class="font-medium text-gray-900 flex items-end">
    <span v-if="isEstimate" class="mr-2 flex-shrink-0">
      <TrendingUpIcon class="h-4 w-4 text-gray-500" aria-hidden="true" />
    </span>
    <span :class="availabilityStyle" class="text-lg leading-none">
      {{ bikesAvailable }}
    </span>
    <span v-if="capacity" class="ml-1 leading-none">
      / {{ capacity }}
    </span>
  </p>
</template>

<script setup lang="ts">
import { TrendingUpIcon } from '@heroicons/vue/solid'

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
  isEstimate: {
    type: Boolean,
    default: false,
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
