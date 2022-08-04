<template>
  <div class="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
    <!-- Sidebar component, swap this element with another sidebar if you like -->
    <div class="flex flex-col flex-grow pt-5 bg-amber-300 overflow-y-auto">
      <div class="flex items-center flex-shrink-0 px-4">
        <span class="text-2xl font-bold text-black leading-none">Fillarivahti</span>
      </div>
      <div class="mt-5 flex-1 flex flex-col">
        <nav class="flex-1 px-2 pb-4 space-y-1">
          <NuxtLink v-for="item in navigation" :key="item.route" :to="localePath({ name: item.route })" :class="[item.current ? 'bg-amber-200 text-black' : 'text-black hover:bg-amber-400', 'group flex items-center px-2 py-2 font-medium rounded-md']">
            <component :is="item.icon" class="mr-3 flex-shrink-0 h-6 w-6 text-amber-700" aria-hidden="true" />
            {{ $t(item.i18nLabel) }}
          </NuxtLink>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLocalePath } from '#i18n'

const { navigation } = useSidebar()

const localePath = useLocalePath()
</script>
