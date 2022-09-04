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
import { useCurrentLocation } from '~~/composables/useMap'

const localePath = useLocalePath()

const visibleStationIds = ref([])
const visibleStations: Ref<BikeStation[]> = ref([])
const visibleStationsEstimatedAvailability: Ref<Record<string, BikeStationAvailability>> = ref({})

watch(visibleStationIds, async (stationIds) => {
  const { data: stations } = await useBikeStationsByIds(stationIds)

  visibleStations.value = stations.value
})

watch(visibleStationIds, async (stationIds) => {
  const { data: stationsEstimatedAvailability } = await useBikeStationsFurthestEstimatedAvailability(stationIds)

  visibleStationsEstimatedAvailability.value = stationsEstimatedAvailability.value
})

// declare a ref to hold the element reference
// the name must match template ref value
const mapElement = ref()

const { mapboxToken } = useRuntimeConfig()
mapboxgl.accessToken = mapboxToken

const mapIcons = {
  bikeStation: {
    url: '/images/icons/icon-map-bike-station.png',
    name: 'icon-map-bike-station',
  },
  availabilityCaseStable: {
    url: '/images/icons/icon-map-availability-case-stable.png',
    name: 'icon-map-availability-case',
  },
  availabilityCaseTrendingUp: {
    url: '/images/icons/icon-map-availability-case-trending-up.png',
    name: 'icon-map-availability-trending-up-case',
  },
  availabilityCaseTrendingDown: {
    url: '/images/icons/icon-map-availability-case-trending-down.png',
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

const stationIconLayer = hslStyle.layers.find(({ id }) => id === 'citybike_icon')
stationIconLayer.layout['icon-image'] = mapIcons.bikeStation.name
stationIconLayer.layout['icon-size'] = 0.5
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
      const { stationId, bikesAvailable, capacity } = station

      const estimatedBikesAvailable = useBikeStationEstimatedBikesAvailable(station, stationsEstimatedAvailability[stationId])

      let icon
      if (estimatedBikesAvailable !== null) {
        if (isTrendingUp(estimatedBikesAvailable, bikesAvailable, capacity)) {
          icon = mapIcons.availabilityCaseTrendingUp
        } else if (isTrendingDown(estimatedBikesAvailable, bikesAvailable, capacity)) {
          icon = mapIcons.availabilityCaseTrendingDown
        } else {
          icon = mapIcons.availabilityCaseStable
        }
      } else {
        icon = mapIcons.availabilityCaseStable
      }

      return [...acc, stationId, icon.name]
    }, [])
    : null

  if (caseIconMatch) {
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
        'icon-offset': [-35, -80],
      },
    })
  }

  if (map.getLayer('citybike_station_availability')) {
    map.removeLayer('citybike_station_availability')
  }

  const bikesAvailableMatch = stations.length
    ? stations.reduce((acc, station) => [...acc, station.stationId, String(station.bikesAvailable)], [])
    : null

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
    : null

  if (bikesAvailableMatch && availabilityColorMatch) {
    map.addLayer({
      id: 'citybike_station_availability',
      minzoom: 14,
      source: 'citybike',
      'source-layer': 'stations',
      type: 'symbol',
      layout: {
        'text-field': ['format', ['string', ['match', ['get', 'id'], ...bikesAvailableMatch, '']]],
        'text-font': ['literal', ['Gotham Rounded Medium']], // HSL default
        'text-offset': [0, -2.25],
      },
      paint: {
        'text-color': ['match', ['get', 'id'], ...availabilityColorMatch, '#6b7280'],
      },
    })
  }
}

onMounted(async () => {
  // Map element is not guaranteed to be connected to the DOM on mounted,
  // which causes rendering issues with Mapbox. Wait for it to connect before
  // initializing the map.
  await waitForElementConnected(mapElement.value)

  const center = useMapCenter()
  const zoom = useMapZoom()

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const map = new mapboxgl.Map({
    container: mapElement.value,
    style: hslStyle,
    center: center.value,
    zoom: zoom.value,
    minZoom: 10,
  })

  Object.values(mapIcons).forEach(({ url, name }) => {
    map.loadImage(url, (err, image) => {
      if (err) { throw err }
      if (!map.hasImage(name)) {
        map.addImage(name, image)
      }
    })
  })

  const currentLocation = useCurrentLocation()

  const geolocate = new mapboxgl.GeolocateControl({
    geolocation: {
      getCurrentPosition (
        success: (result: GeolocationPosition) => void,
        error: (err) => void,
      ) {
        if (currentLocation.value) {
          success({
            coords: currentLocation.value,
            timestamp: null,
          })
        } else {
          error({
            code: GeolocationPositionError.POSITION_UNAVAILABLE,
          })
        }
      },
    },
    showAccuracyCircle: false,
  })

  geolocate.on('geolocate', (event) => {
    const { longitude, latitude } = event.coords

    map.flyTo({
      center: [longitude, latitude],
      zoom: 14,
    })
  })

  map.addControl(geolocate)

  watch(currentLocation, newLocation => newLocation && geolocate.trigger())

  watch([visibleStations, visibleStationsEstimatedAvailability], ([newStations, newStationsEstimatedAvailability]) =>
    renderStationsAvailability(map, newStations, newStationsEstimatedAvailability))

  map.on('load', () => {
    if (currentLocation.value) {
      const { lng: centerLng, lat: centerLat } = map.getCenter()
      if (currentLocation.value.latitude === centerLat && currentLocation.value.longitude === centerLng) {
        // Already centered on current location, no move event will be triggered
        // by geolocation so visible stations must be updated manually.
        updateVisibleStationIds(map)
      }
      geolocate.trigger()
    } else {
      updateVisibleStationIds(map)
    }

    // Ensures map fills container element, there was some flakiness without
    // this manual resize after load.
    map.resize()
  })

  map.on('dragstart', () => {
    // Removes current location highlight from search bar when user moves map by
    // hand, which makes it possible to re-position the map on the current
    // location.
    currentLocation.value = null
  })

  // The "moveend" event is flaky, and fires before bike station icons are
  // rendered when triggered by geolocation. Circumvent by tracking moving state
  // manually and updating station IDs only when rendering idles after moving.
  let moving = false
  map.on('movestart', () => { moving = true })
  map.on('idle', () => {
    if (moving) {
      moving = false

      const { lng, lat } = map.getCenter()
      center.value = [lng, lat]

      updateVisibleStationIds(map)
    }
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

<style>
.mapboxgl-ctrl-geolocate {
  display: none !important;
}
</style>
