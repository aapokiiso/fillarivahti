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

// Actual search location is kept in sync with the URL query string, but this
// can be used to access the last used search location when not available via
// the URL.
export const useLastUsedSearchLocation = () => {
  const searchLocation = useSearchLocation()

  const lastUsedSearchLocation = useState<GeolocationCoordinates|null>('searchLocationLastUsed', () => searchLocation.value)

  watch(searchLocation, (newLocation) => {
    if (newLocation) {
      lastUsedSearchLocation.value = newLocation
    }
  })

  return lastUsedSearchLocation
}
