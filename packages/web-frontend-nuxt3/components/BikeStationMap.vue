<template>
  <div ref="mapElement" />
</template>

<script setup lang="ts">
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

import { generateStyle } from 'hsl-map-style'

import { useLocalePath } from '#i18n'
const localePath = useLocalePath()

// declare a ref to hold the element reference
// the name must match template ref value
const mapElement = ref()

const { mapboxToken } = useRuntimeConfig()
mapboxgl.accessToken = mapboxToken

const hslStyle = generateStyle({
  components: {
    citybikes: { enabled: true },
  },
})

onMounted(async () => {
  const waitForElementConnected = async (element: Node) => {
    if (!element.isConnected) {
      await new Promise(resolve => setTimeout(resolve, 10))
      waitForElementConnected(element)
    }
  }

  // Map element is not guaranteed to be connected to the DOM on mounted,
  // which causes rendering issues with Mapbox. Wait for it to connect before
  // initializing the map.
  if (process.client) {
    await waitForElementConnected(mapElement.value)

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const map = new mapboxgl.Map({
      container: mapElement.value,
      style: hslStyle,
      center: [24.941389, 60.171944], // Helsinki central railway station
      zoom: 14,
      minZoom: 10,
    })

    map.on('click', (event) => {
      const features = map.queryRenderedFeatures(event.point, {
        layers: ['citybike_icon'],
      })

      const [bikeStation] = features || []

      if (bikeStation) {
        navigateTo(localePath({ name: 'stations-id', params: { id: bikeStation.properties.id } }))
      }
    })
  }
})
</script>
