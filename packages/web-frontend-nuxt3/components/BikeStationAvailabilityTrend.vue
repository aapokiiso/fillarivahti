<template>
  <span v-if="isTrendingUp || isTrendingDown" class="text-gray-500">
    <span v-if="isTrendingUp">
      <span class="sr-only">{{ $t('bikeStationAvailabilityTrend.trendingUp') }}</span>
      <TrendingUpIcon aria-hidden="true" />
    </span>
    <span v-if="isTrendingDown">
      <span class="sr-only">{{ $t('bikeStationAvailabilityTrend.trendingDown') }}</span>
      <TrendingDownIcon aria-hidden="true" />
    </span>
  </span>
</template>

<script setup lang="ts">
import { TrendingUpIcon, TrendingDownIcon } from '@heroicons/vue/solid'
import * as trendingHelpers from '~~/helpers/bikeStationAvailabilityTrending'

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
})

const isTrendingUp = computed(
  () => trendingHelpers.isTrendingUp(
    props.estimatedBikes,
    props.currentBikes,
    props.capacity,
  ),
)

const isTrendingDown = computed(
  () => trendingHelpers.isTrendingDown(
    props.estimatedBikes,
    props.currentBikes,
    props.capacity,
  ),
)
</script>
