<template>
  <p class="font-medium text-gray-900 leading-none">
    <span v-if="isEstimate && bikesAvailable !== null" class="mr-1 text-gray-500 font-bold leading-none">~</span>
    <span :class="availabilityStyle" class="text-lg leading-none">
      {{ bikesAvailable !== null ? bikesAvailable : '-' }}
    </span>
    <span v-if="capacity" class="ml-1 leading-none">
      / {{ capacity }}
    </span>
  </p>
</template>

<script setup lang="ts">
import { AvailabilityStatus, getAvailabilityStatus } from '~/helpers/bikeStationAvailabilityStatus'

const props = defineProps({
  bikesAvailable: {
    type: Number,
    default: null,
  },
  capacity: {
    type: Number,
    default: null,
  },
  isEstimate: {
    type: Boolean,
    default: false,
  },
})

const availabilityStyle = computed(() => {
  const availabilityStatus = getAvailabilityStatus(props.bikesAvailable, props.capacity)

  switch (availabilityStatus) {
    case AvailabilityStatus.Good:
      return 'text-green-500'
    case AvailabilityStatus.Low:
      return 'text-yellow-500'
    case AvailabilityStatus.Bad:
      return 'text-red-500'
    default:
      return 'text-gray-500'
  }
})
</script>
