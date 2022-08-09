<template>
  <div ref="mapElement" />
</template>

<script setup lang="ts">
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

import { generateStyle } from 'hsl-map-style'

import { Ref } from 'vue'
import { useLocalePath } from '#i18n'
import { BikeStation, BikeStationAvailability } from '~/types/BikeStation'
import { waitForElementConnected } from '~/helpers/waitForElementConnected'
import { isTrendingUp, isTrendingDown } from '~/helpers/bikeStationAvailabilityTrending'
import { AvailabilityStatus, getAvailabilityStatus } from '~/helpers/bikeStationAvailabilityStatus'

const localePath = useLocalePath()

const visibleStationIds = ref([])
const visibleStations: Ref<BikeStation[]> = ref([])
const visibleStationsEstimatedAvailability: Ref<Record<string, BikeStationAvailability>> = ref({})

watch(visibleStationIds, async (stationIds) => {
  const { data: stations } = await useBikeStationsByIds(stationIds)
  const { data: stationsEstimatedAvailability } = await useBikeStationsFurthestEstimatedAvailability(stationIds)

  visibleStations.value = stations.value
  visibleStationsEstimatedAvailability.value = stationsEstimatedAvailability.value
})

// declare a ref to hold the element reference
// the name must match template ref value
const mapElement = ref()

const { mapboxToken } = useRuntimeConfig()
mapboxgl.accessToken = mapboxToken

const center = useState<[number, number]>(
  'bikeStationMapCenter',
  () => [24.941389, 60.171944], // Helsinki central railway station
)

const hasBeenInteractedWith = useState<boolean>(
  'bikeStationMapHasBeenInteractedWith',
  () => false,
)

const availabilityCaseIcons = {
  stable: {
    url: '/images/icons/icon-map-availability-case.png',
    name: 'icon-map-availability-case',
  },
  'trending-up': {
    url: '/images/icons/icon-map-availability-trending-up-case.png',
    name: 'icon-map-availability-trending-up-case',
  },
  'trending-down': {
    url: '/images/icons/icon-map-availability-trending-down-case.png',
    name: 'icon-map-availability-trending-down-case',
  },
}

const hslStyle = generateStyle({
  components: {
    citybikes: {
      enabled: true,
    },
  },
})

hslStyle.sprite = 'https://raw.githubusercontent.com/HSLdevcom/hsl-map-style/master/sprite@3x'
const stationIconLayer = hslStyle.layers.find(({ id }) => id === 'citybike_icon')
stationIconLayer.layout['icon-image'] = 'icon-citybike-station2'
stationIconLayer.layout['icon-size'] = 2
stationIconLayer.layout['icon-allow-overlap'] = true

const updateVisibleStationIds = (map) => {
  const features = map.queryRenderedFeatures({
    layers: ['citybike_icon'],
  })

  visibleStationIds.value = features.map(({ properties }) => properties.id)
}

const renderStationsAvailability = (map, stations: BikeStation[], stationsEstimatedAvailability: Record<string, BikeStationAvailability>) => {
  if (map.getLayer('citybike_station_availability_case')) {
    map.removeLayer('citybike_station_availability_case')
  }

  const caseIconMatch = stations.length
    ? stations.reduce((acc, station) => {
      const { stationId, bikesAvailable } = station
      const { capacity: estimatesBikesAvailable } = stationsEstimatedAvailability[stationId]

      let icon
      if (isTrendingUp(estimatesBikesAvailable, bikesAvailable, station.capacity)) {
        icon = availabilityCaseIcons['trending-up']
      } else if (isTrendingDown(estimatesBikesAvailable, bikesAvailable, station.capacity)) {
        icon = availabilityCaseIcons['trending-down']
      } else {
        icon = availabilityCaseIcons.stable
      }

      return [...acc, stationId, icon.name]
    }, [])
    : ['', '']

  map.addLayer({
    id: 'citybike_station_availability_case',
    minzoom: 14,
    source: 'citybike',
    'source-layer': 'stations',
    type: 'symbol',
    layout: {
      'icon-image': ['match', ['get', 'id'], ...caseIconMatch, ''],
      'icon-allow-overlap': true,
      'icon-size': 0.5,
      'icon-anchor': 'left',
      'icon-offset': [-35, -95],
    },
  })

  if (map.getLayer('citybike_station_availability')) {
    map.removeLayer('citybike_station_availability')
  }

  const bikesAvailableMatch = stations.length
    ? stations.reduce((acc, station) => [...acc, station.stationId, String(station.bikesAvailable)], [])
    : ['', '']

  const availabilityColorMatch = stations.length
    ? stations.reduce((acc, station) => {
      const { stationId, bikesAvailable, capacity } = station
      const availabilityStatus = getAvailabilityStatus(bikesAvailable, capacity)

      let color
      switch (availabilityStatus) {
        case AvailabilityStatus.Good:
          color = '#22c55e'
          break
        case AvailabilityStatus.Low:
          color = '#eab308'
          break
        case AvailabilityStatus.Bad:
          color = '#ef4444'
          break
        default:
          color = '#6b7280'
          break
      }

      return [...acc, stationId, color]
    }, [])
    : ['', '']

  map.addLayer({
    id: 'citybike_station_availability',
    minzoom: 14,
    source: 'citybike',
    'source-layer': 'stations',
    type: 'symbol',
    layout: {
      'text-field': ['format', ['string', ['match', ['get', 'id'], ...bikesAvailableMatch, '']]],
      'text-font': ['literal', ['Gotham Rounded Medium']], // HSL default
      'text-offset': [0, -2.75],
    },
    paint: {
      'text-color': ['match', ['get', 'id'], ...availabilityColorMatch, '#6b7280'],
    },
  })
}

onMounted(async () => {
  // Map element is not guaranteed to be connected to the DOM on mounted,
  // which causes rendering issues with Mapbox. Wait for it to connect before
  // initializing the map.
  await waitForElementConnected(mapElement.value)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const map = new mapboxgl.Map({
    container: mapElement.value,
    style: hslStyle,
    center: center.value,
    zoom: 14,
    minZoom: 10,
  })

  Object.values(availabilityCaseIcons).forEach(({ url, name }) => {
    map.loadImage(url, (err, image) => {
      if (err) { throw err }
      if (!map.hasImage(name)) {
        map.addImage(name, image)
      }
    })
  })

  const searchLocation = useSearchLocation()

  const geolocate = new mapboxgl.GeolocateControl({
    geolocation: {
      getCurrentPosition (
        success: (result: GeolocationPosition) => void,
        error: (err) => void,
      ) {
        if (searchLocation.value) {
          success({
            coords: searchLocation.value,
            timestamp: null,
          })
        } else {
          error({
            code: GeolocationPositionError.POSITION_UNAVAILABLE,
          })
        }
      },
    },
  })

  map.addControl(geolocate)

  watch(searchLocation, () => geolocate.trigger())

  watch(visibleStations, newStations => renderStationsAvailability(map, newStations, visibleStationsEstimatedAvailability.value))

  map.on('load', () => {
    // Do not center back on geolocation if user has moved the map around (going
    // back and forth between the map view and station views)
    if (searchLocation.value && !hasBeenInteractedWith.value) {
      geolocate.trigger()
    }

    updateVisibleStationIds(map)
  })

  map.on('moveend', () => {
    updateVisibleStationIds(map)

    const { lng, lat } = map.getCenter()
    center.value = [lng, lat]
  })

  map.on('dragend', () => {
    hasBeenInteractedWith.value = true
  })

  map.on('click', (event) => {
    const features = map.queryRenderedFeatures(event.point, {
      layers: ['citybike_icon', 'citybike_station_availability_case', 'citybike_station_availability'],
    })

    const [bikeStation] = features || []

    if (bikeStation) {
      navigateTo(localePath({ name: 'stations-id', params: { id: bikeStation.properties.id } }))
    }
  })
})
</script>
