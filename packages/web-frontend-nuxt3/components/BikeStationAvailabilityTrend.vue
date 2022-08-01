<template>
  <span v-if="canShowTrend" class="text-gray-500">
    <TrendingUpIcon v-if="isTrendingUp" aria-hidden="true" />
    <TrendingDownIcon v-else-if="isTrendingDown" aria-hidden="true" />
    <MinusIcon v-else aria-hidden="true" />
  </span>
</template>

<script setup lang="ts">
import { TrendingUpIcon, TrendingDownIcon, MinusIcon } from '@heroicons/vue/solid'

const props = defineProps({
  estimatedBikes: {
    type: Number,
    default: null,
  },
  currentBikes: {
    type: Number,
    default: null,
  },
  capacity: {
    type: Number,
    default: null,
  },
  trendingThreshold: {
    type: Number,
    default: 0.15,
  },
})

const canShowTrend = computed(
  () => props.estimatedBikes !== null && props.currentBikes !== null,
)

const percentDiff = computed(
  () => props.capacity > 0
    ? (props.estimatedBikes - props.currentBikes) / props.capacity
    : 0,
)

const isTrendingUp = computed(
  () => percentDiff.value >= props.trendingThreshold,
)

const isTrendingDown = computed(
  () => percentDiff.value <= props.trendingThreshold * -1,
)
</script>
