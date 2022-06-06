import { defineNuxtConfig } from 'nuxt'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss'],
  typescript: {
    shim: false
  },
  env: {
    hslGraphqlEndpointUrl: process.env.HSL_GRAPHQL_ENDPOINT_URL || 'https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql',
    addressSearchEndpointUrl: process.env.ADDRESS_SEARCH_ENDPOINT_URL || 'https://api.digitransit.fi/geocoding/v1/search',
    capacityEndpointUrl: process.env.CAPACITY_ENDPOINT_URL || 'https://http-api-dot-fillarivahti.appspot.com/'
  }
})
