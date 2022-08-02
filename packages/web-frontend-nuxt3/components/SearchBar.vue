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
            placeholder="Search stations by name..."
            type="search"
            name="search"
          >
        </div>
      </form>
    </div>
    <div class="ml-4 flex items-center md:ml-6">
      <button
        type="button"
        class="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        :class="{'bg-gray-400 text-white hover:text-gray-700': searchLocation && !isCurrentLocation, 'bg-indigo-500 text-white hover:text-white': searchLocation && isCurrentLocation}"
        @click="onLocationSearchClick"
      >
        <span class="sr-only">Find nearby bike stations</span>
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

const searchText = useSearchText()

// Initialize search input value from current search text
const textInput = ref(searchText.value)
watch(searchText, (newSearchText) => {
  textInput.value = newSearchText
})

const router = useRouter()

const onTextSearchSubmit = (event) => {
  event.preventDefault()

  if (textInput.value) {
    router.push({
      name: 'list', // TODO go back to map view if coming from there
      query: { q: textInput.value },
    })
  } else {
    router.push({
      name: 'list',
      query: { },
    })
  }
}

const searchLocation = useSearchLocation()
const isCurrentLocation = ref(false)

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

    router.push({
      name: 'list',
      query: { lat: coords.latitude, lon: coords.longitude },
    })

    isCurrentLocation.value = true
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error)

    // TODO show error to user

    router.push({
      name: 'list',
      query: { },
    })
  }
}
</script>
