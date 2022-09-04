export const useCurrentLocation = () => useState<GeolocationCoordinates|null>('currentLocation', () => null)

export const useMapCenter = () => useState<[number, number]>('mapCenter', () => {
  const currentLocation = useCurrentLocation()

  return currentLocation.value
    ? [currentLocation.value.longitude, currentLocation.value.latitude]
    : [24.941389, 60.171944] // Helsinki central railway station
})

export const useMapZoom = () => useState<number>('mapZoom', () => 14)
