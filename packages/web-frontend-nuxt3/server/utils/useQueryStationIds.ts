import { QueryObject } from 'ufo'

export const useQueryStationIds = (query: QueryObject): string[] => {
  const { ids } = query

  if (Array.isArray(ids)) {
    return (ids as unknown[])
      .filter(stationId => typeof stationId === 'string') as string[]
  }

  if (typeof ids === 'string') {
    return [ids]
  }

  return []
}
