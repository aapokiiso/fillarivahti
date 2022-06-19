<template>
  <div class="flex-1 px-4 flex justify-between">
    <div class="flex-1 flex">
      <form class="w-full flex md:ml-0" action="#" method="GET">
        <label for="search-field" class="sr-only">Search bike stations</label>
        <div class="relative w-full text-gray-400 focus-within:text-gray-600">
          <div class="absolute inset-y-0 left-0 flex items-center pointer-events-none">
            <SearchIcon class="h-5 w-5" aria-hidden="true" />
          </div>
          <input
            id="search-field"
            :value="searchText"
            class="block w-full h-full pl-8 pr-3 py-2 border-transparent text-gray-900 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-0 focus:border-transparent sm:text-sm"
            placeholder="Search"
            type="search"
            name="search"
            @input="onSearchInput"
          >
        </div>
      </form>
    </div>
    <div class="ml-4 flex items-center md:ml-6">
      <button type="button" class="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
        <span class="sr-only">Find nearby bike stations</span>
        <LocationMarkerIcon class="h-6 w-6" aria-hidden="true" />
      </button>
    </div>
  </div>
</template>

<script setup>
import {
  LocationMarkerIcon,
} from '@heroicons/vue/outline'

import { SearchIcon } from '@heroicons/vue/solid'

import debounce from 'debounce'

const searchText = useSearchText()

const onSearchInput = debounce((event) => { searchText.value = event.target.value }, 300)
</script>