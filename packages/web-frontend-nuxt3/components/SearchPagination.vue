<template>
  <nav class="py-6 sm:flex sm:items-center sm:justify-between" aria-label="Pagination">
    <div v-if="canHaveNextButton" class="mb-6 flex-1 flex justify-between sm:mb-0 sm:justify-end sm:order-last">
      <button
        :class="{ 'invisible': !canShowPrevButton }"
        class="relative inline-flex items-center px-4 py-2 border border-gray-300 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        @click="onPrevClick"
      >
        {{ $t('pagination.previous') }}
      </button>
      <button
        v-if="canHaveNextButton"
        :disabled="!canShowNextButton"
        class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 font-medium rounded-md text-gray-700 bg-white enabled:hover:bg-gray-50 disabled:opacity-50"
        @click="onNextClick"
      >
        {{ $t('pagination.next') }}
      </button>
    </div>
    <div class="text-center sm:order-first">
      <p class="text-gray-700">
        {{ $t('pagination.status', { pageStart, pageEnd, totalCount }) }}
      </p>
    </div>
  </nav>
</template>

<script setup lang="ts">
const props = defineProps<{
  currentPage: number,
  pageSize: number,
  totalCount: number,
  onPrevClick(event: Event): void,
  onNextClick(event: Event): void,
}>()

const pageStart = computed(() => Math.max(props.currentPage * props.pageSize - props.pageSize, 1))
const pageEnd = computed(() => Math.min(props.currentPage * props.pageSize, props.totalCount))

const canShowPrevButton = computed(() => pageStart.value > 1)
const canHaveNextButton = computed(() => props.totalCount > props.pageSize)
const canShowNextButton = computed(() => pageEnd.value < props.totalCount)
</script>
