<template>
  <div class="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white shadow">
    <button type="button" class="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden" @click="isSidebarOpen = true">
      <span class="sr-only">Open sidebar</span>
      <MenuAlt2Icon class="h-6 w-6" aria-hidden="true" />
    </button>

    <SearchBar />
  </div>
</template>

<script setup lang="ts">
import {
  MenuAlt2Icon,
} from '@heroicons/vue/outline'

const { isSidebarOpen } = useSidebar()
</script>
