<template>
  <div>
    <p v-if="!pending">
      {{ stationIds }}
    </p>
    <p v-else>
      Loading...
    </p>
  </div>
</template>

<script setup>
const searchText = useSearchText()

const { idsByText } = useStationSearch()

const { data: stationIds, pending } = await idsByText(searchText.value)
</script>
