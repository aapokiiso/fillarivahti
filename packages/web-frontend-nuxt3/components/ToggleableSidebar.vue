<template>
  <TransitionRoot as="template" :show="isSidebarOpen">
    <Dialog as="div" class="relative z-40 md:hidden" @close="isSidebarOpen = false">
      <TransitionChild
        as="template"
        enter="transition-opacity ease-linear duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="transition-opacity ease-linear duration-300"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-gray-600 bg-opacity-75" />
      </TransitionChild>

      <div class="fixed inset-0 flex z-40">
        <TransitionChild
          as="template"
          enter="transition ease-in-out duration-300 transform"
          enter-from="-translate-x-full"
          enter-to="translate-x-0"
          leave="transition ease-in-out duration-300 transform"
          leave-from="translate-x-0"
          leave-to="-translate-x-full"
        >
          <DialogPanel class="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-amber-300">
            <TransitionChild
              as="template"
              enter="ease-in-out duration-300"
              enter-from="opacity-0"
              enter-to="opacity-100"
              leave="ease-in-out duration-300"
              leave-from="opacity-100"
              leave-to="opacity-0"
            >
              <div class="absolute top-0 right-0 -mr-12 pt-2">
                <button type="button" class="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" @click="isSidebarOpen = false">
                  <span class="sr-only">{{ $t('sidebar.close') }}</span>
                  <XIcon class="h-6 w-6 text-white" aria-hidden="true" />
                </button>
              </div>
            </TransitionChild>
            <div class="flex-shrink-0 flex items-center px-4">
              <span class="text-2xl font-bold text-black leading-none">Fillarivahti</span>
            </div>
            <div class="mt-5 flex-1 h-0 overflow-y-auto">
              <nav class="px-2 space-y-1">
                <NuxtLink v-for="item in navigation" :key="item.route" :to="localePath({name: item.route})" :class="[item.current ? 'bg-amber-200 text-black' : 'text-black hover:bg-amber-400', 'group flex items-center px-2 py-2 text-base font-medium rounded-md']" @click="isSidebarOpen = false">
                  <component :is="item.icon" class="mr-4 flex-shrink-0 h-6 w-6 text-amber-700" aria-hidden="true" />
                  {{ $t(item.i18nLabel) }}
                </NuxtLink>
              </nav>
            </div>
          </DialogPanel>
        </TransitionChild>
        <div class="flex-shrink-0 w-14" aria-hidden="true">
          <!-- Dummy element to force sidebar to shrink to fit close icon -->
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import {
  Dialog,
  DialogPanel,
  TransitionChild,
  TransitionRoot,
} from '@headlessui/vue'

import {
  XIcon,
} from '@heroicons/vue/outline'

import { useLocalePath } from '#i18n'

const { navigation, isSidebarOpen } = useSidebar()

const localePath = useLocalePath()
</script>
