import type { LocationQuery } from 'vue-router'

const parseSearchTextFromQuery = (query: LocationQuery): string|null =>
  query.q
    ? String(query.q)
    : null

export const useSearchText = () => {
  const route = useRoute()

  const searchText = useState<string|null>('searchText', () => parseSearchTextFromQuery(route.query))

  watch(
    () => route.query,
    (newQuery) => {
      searchText.value = parseSearchTextFromQuery(newQuery)
    },
  )

  return searchText
}

const parseSearchLocationFromQuery = (query: LocationQuery): GeolocationCoordinates|null =>
  query.lat && query.lon
    ? {
        latitude: Number(query.lat),
        longitude: Number(query.lon),
        accuracy: 1,
        altitude: null,
        altitudeAccuracy: null,
        heading: null,
        speed: null,
      }
    : null

export const useSearchLocation = () => {
  const route = useRoute()

  const searchLocation = useState<GeolocationCoordinates|null>('searchLocation', () => parseSearchLocationFromQuery(route.query))

  watch(
    () => route.query,
    (newQuery) => {
      searchLocation.value = parseSearchLocationFromQuery(newQuery)
    },
  )

  return searchLocation
}

const parseSearchPageFromQuery = (query: LocationQuery): number =>
  query.p
    ? Number(query.p)
    : 1

export const useSearchPage = () => {
  const route = useRoute()

  const searchPage = useState<number>('searchPage')
  searchPage.value = parseSearchPageFromQuery(route.query)

  watch(
    () => route.query,
    (newQuery) => {
      searchPage.value = parseSearchPageFromQuery(newQuery)
    },
  )

  return searchPage
}

const parseSearchPageSizeFromQuery = (query: LocationQuery): number =>
  query.size
    ? Number(query.size)
    : 3

export const useSearchPageSize = () => {
  const route = useRoute()

  const searchPageSize = useState<number>('searchPageSize')
  searchPageSize.value = parseSearchPageSizeFromQuery(route.query)

  watch(
    () => route.query,
    (newQuery) => {
      searchPageSize.value = parseSearchPageSizeFromQuery(newQuery)
    },
  )

  return searchPageSize
}
