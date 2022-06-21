<template>
  <div class="bg-white overflow-hidden shadow rounded-lg">
    <div class="p-5">
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <component :is="TrendingUpIcon" class="h-6 w-6 text-gray-500" aria-hidden="true" />
        </div>
        <div class="ml-5 w-0 flex-1">
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
import { TrendingUpIcon } from '@heroicons/vue/solid'
import { BikeStation } from '~/types/BikeStation'

defineProps<{
  station: BikeStation
}>()
</script>
