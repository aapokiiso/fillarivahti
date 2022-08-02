<template>
  <div class="min-h-full">
    <main class="py-10">
      <div class="max-w-3xl mx-auto px-4 sm:px-6 md:flex md:items-center md:justify-between md:space-x-5 lg:max-w-7xl lg:px-8">
        <div class="flex items-center space-x-5">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">
              {{ station.name }}
            </h1>
            <p v-if="distanceInKilometers !== null" class="text-sm font-medium text-gray-500">
              {{ distanceInKilometers }} km away
            </p>
          </div>
        </div>
        <div class="mt-6 flex flex-col-reverse justify-stretch space-y-4 space-y-reverse sm:flex-row-reverse sm:justify-end sm:space-x-reverse sm:space-y-0 sm:space-x-3 md:mt-0 md:flex-row md:space-x-3">
          <NuxtLink
            :to="{name: 'index'}"
            class="inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500"
          >
            View on map
          </NuxtLink>
          <NuxtLink
            :to="`https://reittiopas.hsl.fi/pyoraasemat/${station.stationId}`"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center justify-center px-4 py-2 border border-transparent font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500"
          >
            <ExternalLinkIcon class="mr-3 flex-shrink-0 h-6 w-6 text-indigo-300" aria-hidden="true" />
            View on HSL.fi
          </NuxtLink>
        </div>
      </div>

      <div class="mt-8 max-w-3xl mx-auto grid grid-cols-1 gap-6 sm:px-6 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-3">
        <section aria-labelledby="timeline-title" class="lg:col-start-3 lg:col-span-1">
          <div class="bg-white px-4 py-5 shadow sm:rounded-lg sm:px-6">
            <h2 id="timeline-title" class="text-lg font-medium text-gray-900">
              Current capacity
            </h2>
            <dl class="grid grid-cols-1 gap-x-4 gap-y-4 mt-4">
              <div>
                <dt class="font-medium text-gray-500">
                  Right now
                </dt>
                <dd class="text-gray-900">
                  <BikeStationAvailabilityStatus :bikes-available="station.bikesAvailable" :capacity="station.capacity" />
                </dd>
              </div>
              <div>
                <dt class="font-medium text-gray-500">
                  In 30 minutes
                </dt>
                <dd class="text-gray-900 flex items-center">
                  <BikeStationAvailabilityStatus :bikes-available="estimatedBikesAvailable" :capacity="station.capacity" :is-estimate="true" />
                  <BikeStationAvailabilityTrend
                    v-if="estimatedBikesAvailable !== null"
                    class="flex-shrink-0 h-4 w-4 ml-2"
                    :estimated-bikes="estimatedBikesAvailable"
                    :current-bikes="station.bikesAvailable"
                    :capacity="station.capacity"
                  />
                </dd>
              </div>
            </dl>
          </div>
        </section>

        <div class="space-y-6 lg:col-start-1 lg:col-span-2">
          <section aria-labelledby="capacity-history-title">
            <div class="bg-white shadow sm:rounded-lg">
              <div class="px-4 py-5 sm:px-6">
                <h2 id="capacity-history-title" class="text-lg leading-6 font-medium text-gray-900">
                  Capacity today
                </h2>
                <p class="mt-1 max-w-2xl text-sm text-gray-500">
                  Lorem ipsum dolor sit amet.
                </p>
              </div>
              <div class="border-t border-gray-200 px-4 py-5 sm:px-6">
                <BikeStationAvailabilityGraph
                  v-if="!(todayAvailabilitiesPending || weekdayAverageAvailabilitiesPending)"
                  :station-capacity="station.capacity"
                  :today-capacities="todayAvailability"
                  :weekday-average-capacities="weekdayAverageAvailability"
                />
                <Skeletor
                  v-else
                  height="10rem"
                />
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import {
  ExternalLinkIcon,
} from '@heroicons/vue/solid'

import 'vue-skeletor/dist/vue-skeletor.css'
import { Skeletor } from 'vue-skeletor'

const route = useRoute()
const stationId = route.params.id

const { data: stations } = await useBikeStationsByIds([stationId])
const [station] = stations.value

const {
  data: todayAvailabilities,
  pending: todayAvailabilitiesPending,
} = await useBikeStationsAvailabilityForToday([stationId], {
  server: false,
  lazy: true,
  default: () => ({}),
})

const todayAvailability = ref(todayAvailabilities.value[stationId] || [])
watch(todayAvailabilities, (newStationsAvailability) => {
  todayAvailability.value = newStationsAvailability[stationId] || []
})

const {
  data: weekdayAverageAvailabilities,
  pending: weekdayAverageAvailabilitiesPending,
} = await useBikeStationsAverageAvailabilityForWeekday([stationId], {
  server: false,
  lazy: true,
  default: () => ({}),
})

const weekdayAverageAvailability = ref(weekdayAverageAvailabilities.value[stationId] || [])
watch(weekdayAverageAvailabilities, (newStationsAvailability) => {
  weekdayAverageAvailability.value = newStationsAvailability[stationId] || []
})

const {
  data: stationsEstimatedAvailability,
} = await useBikeStationsFurthestEstimatedAvailability([stationId], {
  lazy: true,
  default: () => ({}),
})

const estimatedAvailability = ref(stationsEstimatedAvailability.value[stationId])
watch(stationsEstimatedAvailability, (newStationsAvailability) => {
  estimatedAvailability.value = newStationsAvailability[stationId]
})

const estimatedBikesAvailable = computed(
  () => useBikeStationEstimatedBikesAvailable(station, estimatedAvailability.value),
)

const searchLocation = useLastUsedSearchLocation()
const distanceInMeters = computed(
  () => searchLocation.value
    ? useBikeStationDistanceInMeters(station, searchLocation.value)
    : null,
)
const distanceInKilometers = computed(
  () => distanceInMeters.value !== null
    ? Math.round(distanceInMeters.value / 100) / 10
    : null,
)
</script>
