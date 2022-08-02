<template>
  <div class="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
    <!-- Sidebar component, swap this element with another sidebar if you like -->
    <div class="flex flex-col flex-grow pt-5 bg-indigo-700 overflow-y-auto">
      <div class="flex items-center flex-shrink-0 px-4">
        <img class="h-8 w-auto" src="https://tailwindui.com/img/logos/workflow-logo-indigo-300-mark-white-text.svg" alt="Workflow">
      </div>
      <div class="mt-5 flex-1 flex flex-col">
        <nav class="flex-1 px-2 pb-4 space-y-1">
          <NuxtLink v-for="item in navigation" :key="item.name" :to="{name: item.route}" :class="[item.current ? 'bg-indigo-800 text-white' : 'text-indigo-100 hover:bg-indigo-600', 'group flex items-center px-2 py-2 font-medium rounded-md']">
            <component :is="item.icon" class="mr-3 flex-shrink-0 h-6 w-6 text-indigo-300" aria-hidden="true" />
            {{ item.name }}
          </NuxtLink>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { navigation } = useSidebar()
</script>
