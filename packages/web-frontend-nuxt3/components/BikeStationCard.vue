<template>
  <div class="bg-white overflow-hidden shadow rounded-lg">
    <div class="p-5">
      <dl>
        <dt class="font-medium text-gray-500 truncate flex items-center justify-between">
          <span class="leading-none">{{ station.name }}</span>
          <BikeStationDistance
            v-if="distanceInMeters !== null"
            class="leading-none"
            :distance-in-meters="distanceInMeters"
          />
        </dt>
        <dd class="mt-2 flex items-center">
          <BikeStationAvailabilityStatus :bikes-available="station.bikesAvailable" :capacity="station.capacity" />
          <BikeStationAvailabilityTrend
            v-if="estimatedBikesAvailable !== null"
            class="flex-shrink-0 h-4 w-4 ml-2"
            :estimated-bikes="estimatedBikesAvailable"
            :current-bikes="station.bikesAvailable"
            :capacity="station.capacity"
          />
        </dd>
      </dl>
    </div>
    <div class="bg-gray-50 px-5 py-3">
      <div>
        <NuxtLink
          :to="localePath({name: 'stations-id', params: {id: station.stationId}})"
          class="font-medium text-amber-700 hover:text-amber-900"
        >
          {{ $t('bikeStationCard.viewDetails') }}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { BikeStation, BikeStationAvailability } from '~/types/BikeStation'
import { useLocalePath } from '#i18n'

const localePath = useLocalePath()

const props = defineProps<{
  station: BikeStation,
  estimatedAvailability?: BikeStationAvailability,
}>()

const estimatedBikesAvailable = useBikeStationEstimatedBikesAvailable(props.station, props.estimatedAvailability)

const currentLocation = useCurrentLocation()
const distanceInMeters = computed(
  () => currentLocation.value
    ? useBikeStationDistanceInMeters(props.station, currentLocation.value)
    : null,
)
</script>
