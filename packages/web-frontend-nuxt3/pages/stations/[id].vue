<template>
  <div class="py-8 max-w-3xl mx-auto lg:max-w-7xl">
    <div v-if="canGoBackToResults" class="mb-4 px-4 sm:px-6 lg:px-8">
      <button
        class="inline-flex items-center justify-center font-medium text-amber-700 hover:text-amber-900"
        @click="router.back()"
      >
        <ArrowLeftIcon class="mr-2 flex-shrink-0 h-4 w-4" aria-hidden="true" />
        {{ $t('bikeStationDetails.backToResults') }}
      </button>
    </div>

    <div class="px-4 sm:px-6 md:flex md:items-center md:justify-between md:space-x-5 lg:px-8">
      <div class="flex items-center space-x-5">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">
            {{ station.name }}
          </h1>
          <BikeStationDistance v-if="distanceInMeters !== null" class="text-sm font-medium" :distance-in-meters="distanceInMeters" />
        </div>
      </div>
      <div class="mt-6 flex flex-col-reverse justify-stretch space-y-4 space-y-reverse sm:flex-row-reverse sm:justify-end sm:space-x-reverse sm:space-y-0 sm:space-x-3 md:mt-0 md:flex-row md:space-x-3">
        <NuxtLink
          :to="`https://reittiopas.hsl.fi/pyoraasemat/${station.stationId}`"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center justify-center px-4 py-2 border border-transparent font-medium rounded-md shadow-sm text-black bg-amber-300 hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-amber-500"
        >
          <ExternalLinkIcon class="mr-2 flex-shrink-0 h-4 w-4 text-amber-700" aria-hidden="true" />
          {{ $t('bikeStationDetails.viewOnHsl') }}
        </NuxtLink>
      </div>
    </div>

    <div class="mt-8 grid grid-cols-1 gap-6 sm:px-6 lg:grid-flow-col-dense lg:grid-cols-3">
      <div class="lg:col-start-1 lg:col-span-1">
        <section aria-labelledby="availability-details-title">
          <div class="bg-white shadow sm:rounded-lg">
            <div class="px-4 py-5 sm:px-6">
              <h2 id="availability-details-title" class="text-lg font-medium text-gray-900">
                {{ $t('bikeStationDetails.availabilityDetailsTitle') }}
              </h2>
            </div>
            <div class="border-t border-gray-200 px-4 py-5 sm:px-6">
              <dl class="grid grid-cols-1 gap-x-4 gap-y-4">
                <div>
                  <dt class="font-medium text-gray-500">
                    {{ $t('bikeStationDetails.currentAvailabilityTitle') }}
                  </dt>
                  <dd class="text-gray-900">
                    <BikeStationAvailabilityStatus :bikes-available="station.bikesAvailable" :capacity="station.capacity" />
                  </dd>
                </div>
                <div>
                  <dt class="font-medium text-gray-500">
                    {{ $t('bikeStationDetails.estimatedAvailabilityTitle') }}
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
          </div>
        </section>
      </div>

      <div class="space-y-6 lg:col-start-2 lg:col-span-2">
        <section aria-labelledby="availability-history-title">
          <div class="bg-white shadow sm:rounded-lg">
            <div class="px-4 py-5 sm:px-6">
              <h2 id="availability-history-title" class="text-lg font-medium text-gray-900">
                {{ $t('bikeStationDetails.availabilityHistoryTitle') }}
              </h2>
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
  </div>
</template>

<script setup>
import {
  ExternalLinkIcon,
  ArrowLeftIcon,
} from '@heroicons/vue/solid'

import 'vue-skeletor/dist/vue-skeletor.css'
import { Skeletor } from 'vue-skeletor'

import { useLocalePath } from '#i18n'

const localePath = useLocalePath()

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

const router = useRouter()

// TODO check that referer is actually a search results page
const canGoBackToResults = process.client && window.history.state.back
</script>
