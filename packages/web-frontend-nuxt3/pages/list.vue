<template>
  <div class="max-w-7xl mx-auto px-4 pt-4 pb-8 sm:px-6 lg:px-8 lg:pt-8">
    <div v-if="!pending">
      <div v-if="stations.length">
        <div class="mt-2 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div v-for="station in stations" :key="station.stationId" class="bg-white overflow-hidden shadow rounded-lg">
            <BikeStationCard :station="station" :estimated-availability="stationsEstimatedAvailability[station.stationId]" />
          </div>
        </div>
        <SearchPagination
          :current-page="searchPage"
          :page-size="searchPageSize"
          :total-count="stationsTotalCount"
          :on-prev-click="onPaginationPrevClick"
          :on-next-click="onPaginationNextClick"
        />
      </div>
      <p v-else-if="hasNetworkError">
        {{ $t('bikeStationSearch.networkError') }}
      </p>
      <p v-else>
        {{ $t('bikeStationSearch.noResults') }}
      </p>
    </div>
    <p v-else>
      {{ $t('bikeStationSearch.pending') }}
    </p>
  </div>
</template>

<script setup lang="ts">
const searchText = useSearchText()
const searchLocation = useSearchLocation()
const searchPage = useSearchPage()
const searchPageSize = useSearchPageSize()

const pending = ref(true)

const { data: stationIdsResult, error: stationIdsError } = searchLocation.value
  ? await useBikeStationIdsByLocation(searchLocation.value, { page: searchPage.value, pageSize: searchPageSize.value })
  : await useBikeStationIdsByName(searchText.value, { page: searchPage.value, pageSize: searchPageSize.value })

const stationIds = ref(stationIdsResult.value.stationIds)
const stationsTotalCount = ref(stationIdsResult.value.totalCount)

const { data: stations, error: stationsError } = await useBikeStationsByIds(stationIds.value)
const { data: stationsEstimatedAvailability } = await useBikeStationsFurthestEstimatedAvailability(stationIds.value, {
  lazy: true,
  default: () => ({}),
})

pending.value = false

const hasNetworkError = computed(() => stationIdsError.value || stationsError.value)

const route = useRoute()
const listRouteName = route.name

watch([searchText, searchLocation, searchPage, searchPageSize], async ([newText, newLocation, newSearchPage, newSearchPageSize]) => {
  // Skip empty load due to search query being removed from the URL when
  // navigating to another page.
  if (route.name !== listRouteName) {
    return
  }

  pending.value = true

  const { data: newStationIdsResult, error: newStationIdsError } = newLocation
    ? await useBikeStationIdsByLocation(newLocation, { page: newSearchPage, pageSize: newSearchPageSize })
    : await useBikeStationIdsByName(newText, { page: newSearchPage, pageSize: newSearchPageSize })

  stationIds.value = newStationIdsResult.value.stationIds
  stationsTotalCount.value = newStationIdsResult.value.totalCount
  stationIdsError.value = newStationIdsError.value

  const { data: newStations, error: newStationsError } = await useBikeStationsByIds(stationIds.value)
  stations.value = newStations.value
  stationsError.value = newStationsError.value

  const { data: newStationsEstimatedAvailability } = await useBikeStationsFurthestEstimatedAvailability(stationIds.value, {
    lazy: true,
    default: () => ({}),
  })
  stationsEstimatedAvailability.value = newStationsEstimatedAvailability.value

  pending.value = false
})

const onPaginationPrevClick = () => {
  const newPage = searchPage.value > 2 ? searchPage.value - 1 : null

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { p: _, ...rest } = route.query

  const query = newPage
    ? Object.assign({}, rest, { p: newPage })
    : rest

  navigateTo({
    query,
  })
}

const onPaginationNextClick = () => {
  const query = Object.assign({}, route.query, {
    p: (searchPage.value || 1) + 1,
  })

  navigateTo({
    query,
  })
}
</script>
