import type { LocationQuery } from 'vue-router'

const parseSearchTextFromQuery = (query: LocationQuery) => String(query.q || '')

export const useSearchText = () => {
  const route = useRoute()

  const searchText = useState<string>('searchText', () => parseSearchTextFromQuery(route.query))

  watch(
    () => route.query,
    (newQuery) => {
      searchText.value = parseSearchTextFromQuery(newQuery)
    },
  )

  return searchText
}
