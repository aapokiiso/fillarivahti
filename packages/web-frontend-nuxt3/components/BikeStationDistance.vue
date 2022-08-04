<template>
  <p class="text-gray-500 flex items-center">
    <span class="mr-1">
      <span class="sr-only">{{ $t('bikeStationDistance.iconLabel') }}</span>
      <LocationMarkerIcon class="h-4 w-4" aria-hidden="true" />
    </span>
    {{ $t('bikeStationDistance.kilometers', { distance: formattedDistanceInKilometers }) }}
  </p>
</template>

<script setup lang="ts">
import {
  LocationMarkerIcon,
} from '@heroicons/vue/outline'

import { useI18n } from '#i18n'
const { localeProperties } = useI18n()

const props = defineProps<{
  distanceInMeters: number,
}>()

const distanceInKilometers = computed(
  () => Math.round(props.distanceInMeters / 100) / 10,
)

const localeIsoCode = computed(() => localeProperties.value.iso)

const formattedDistanceInKilometers = computed(() => distanceInKilometers.value.toLocaleString(localeIsoCode.value))
</script>
