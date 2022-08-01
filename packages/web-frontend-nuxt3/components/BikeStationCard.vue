<template>
  <div class="bg-white overflow-hidden shadow rounded-lg">
    <div class="p-5">
      <div class="flex items-center">
        <BikeStationAvailabilityTrend
          class="flex-shrink-0 h-6 w-6 mr-5"
          :estimated-bikes="estimatedBikesAvailable"
          :current-bikes="station.bikesAvailable"
          :capacity="station.capacity"
        />
        <div class="w-0 flex-1">
          <dl>
            <dt class="text-sm font-medium text-gray-500 truncate">
              {{ station.name }}
            </dt>
            <dd>
              <BikeStationAvailabilityStatus :bikes-available="station.bikesAvailable" :capacity="station.capacity" />
            </dd>
          </dl>
        </div>
      </div>
    </div>
    <div class="bg-gray-50 px-5 py-3">
      <div class="text-sm">
        <NuxtLink
          :to="{name: 'stations-id', params: {id: station.stationId}}"
          class="font-medium text-cyan-700 hover:text-cyan-900"
        >
          View details
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { BikeStation, BikeStationAvailability } from '~/types/BikeStation'

const props = defineProps<{
  station: BikeStation,
  estimatedAvailability?: BikeStationAvailability,
}>()

const estimatedBikesAvailable = computed(
  () => props.estimatedAvailability
    ? Math.round(props.estimatedAvailability.capacity * props.station.capacity)
    : null,
)
</script>
