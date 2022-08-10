<template>
  <div class="flex-1 px-4 flex justify-between">
    <div class="flex-1 flex">
      <form class="w-full flex md:ml-0" action="#" method="GET" @submit="onTextSearchSubmit">
        <label for="search-field" class="sr-only">Search bike stations</label>
        <div class="relative w-full text-gray-400 focus-within:text-gray-600">
          <div class="absolute inset-y-0 left-0 flex items-center pointer-events-none">
            <SearchIcon class="h-5 w-5" aria-hidden="true" />
          </div>
          <input
            id="search-field"
            v-model="textInput"
            class="block w-full h-full pl-8 pr-3 py-2 border-transparent text-gray-900 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-0 focus:border-transparent"
            :placeholder="$t('bikeStationSearch.textInputPlaceholder')"
            :title="$t('bikeStationSearch.textInputHelp')"
            :aria-label="$t('bikeStationSearch.textInputHelp')"
            type="search"
            name="search"
          >
        </div>
      </form>
    </div>
    <div class="ml-4 flex items-center md:ml-6">
      <button
        type="button"
        class="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
        :class="{'bg-gray-400 text-white hover:text-gray-700': searchLocation && !isLocationMarkerHighlighted, 'bg-amber-500 text-white hover:text-white': isLocationMarkerHighlighted}"
        @click="onLocationSearchClick"
      >
        <span class="sr-only">{{ $t('bikeStationSearch.locationHelp') }}</span>
        <LocationMarkerIcon class="h-6 w-6" aria-hidden="true" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  LocationMarkerIcon,
} from '@heroicons/vue/outline'

import { SearchIcon } from '@heroicons/vue/solid'

import { useLocalePath, useLocaleRoute } from '#i18n'
import { useCurrentLocation } from '~~/composables/useMap'

const localePath = useLocalePath()
const localeRoute = useLocaleRoute()

const searchText = useSearchText()

// Initialize search input value from current search text
const textInput = ref(searchText.value)
watch(searchText, (newSearchText) => {
  textInput.value = newSearchText
})

const onTextSearchSubmit = (event) => {
  event.preventDefault()

  if (textInput.value) {
    navigateTo(localePath({
      name: 'list',
      query: { q: textInput.value },
    }))
  } else {
    navigateTo(localePath({
      name: 'list',
      query: { },
    }))
  }
}

const currentLocation = useCurrentLocation()
const searchLocation = useSearchLocation()

const currentRoute = useRoute()
const { name: mapRouteName } = localeRoute({ name: 'map' })
const isMapRoute = computed(() => currentRoute.name === mapRouteName)

const isLocationMarkerHighlighted = computed(() => (searchLocation.value || isMapRoute.value) && currentLocation.value)

const onLocationSearchClick = async () => {
  const locationRequest: Promise<GeolocationCoordinates> = new Promise(
    (resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (pos: GeolocationPosition) => resolve(pos.coords),
        reject,
      )
    },
  )

  try {
    const coords = await locationRequest

    currentLocation.value = coords

    if (!isMapRoute.value) {
      navigateTo(localePath({
        name: 'list',
        query: { lat: coords.latitude, lon: coords.longitude },
      }))
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error)

    // TODO show error to user

    if (!isMapRoute.value) {
      navigateTo(localePath({
        name: 'list',
        query: { },
      }))
    }
  }
}
</script>
