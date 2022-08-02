<template>
  <span v-if="isTrendingUp || isTrendingDown" class="text-gray-500">
    <TrendingUpIcon v-if="isTrendingUp" aria-hidden="true" />
    <TrendingDownIcon v-else-if="isTrendingDown" aria-hidden="true" />
  </span>
</template>

<script setup lang="ts">
import { TrendingUpIcon, TrendingDownIcon } from '@heroicons/vue/solid'

const props = defineProps({
  estimatedBikes: {
    type: Number,
    required: true,
  },
  currentBikes: {
    type: Number,
    required: true,
  },
  capacity: {
    type: Number,
    required: true,
  },
  percentOfCapacityDiffThreshold: {
    type: Number,
    default: 0.1,
  },
  justNoticeableDiffThreshold: {
    type: Number,
    default: 0.1,
  },
})

// Accounts for trends on stations with a lot of bikes, where an
// addition/removal of several bikes might not cross the just-noticeable
// difference threshold, but constitutes a clear trend nonetheless.
const percentOfCapacityDiff = computed(
  () => props.capacity > 0
    ? (props.estimatedBikes - props.currentBikes) / props.capacity
    : 0,
)

// Accounts for trends on stations with a few bikes, where an addition/removal
// of even one or two bikes makes a noticeable difference, even if
// percentage-wise the change is small.
const justNoticeableDiff = computed(
  () => props.currentBikes > 0
    ? (props.estimatedBikes - props.currentBikes) / props.currentBikes
    : props.estimatedBikes > 0 ? 1 : 0,
)

const isTrendingUp = computed(
  () => percentOfCapacityDiff.value >= props.percentOfCapacityDiffThreshold && justNoticeableDiff.value >= props.justNoticeableDiffThreshold,
)

const isTrendingDown = computed(
  () => percentOfCapacityDiff.value <= props.percentOfCapacityDiffThreshold * -1 && justNoticeableDiff.value <= props.justNoticeableDiffThreshold * -1,
)
</script>
