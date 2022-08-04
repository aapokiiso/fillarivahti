<template>
  <p class="text-sm font-medium text-gray-500">
    {{ $t('bikeStationDistance.kilometers', { distance: formattedDistanceInKilometers }) }}
  </p>
</template>

<script setup lang="ts">
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
