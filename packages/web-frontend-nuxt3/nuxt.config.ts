import { defineNuxtConfig } from 'nuxt'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/i18n',
  ],
  typescript: {
    shim: false,
  },
  runtimeConfig: {
    hslGraphqlEndpointUrl: process.env.HSL_GRAPHQL_ENDPOINT_URL || 'https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql',
    addressSearchEndpointUrl: process.env.ADDRESS_SEARCH_ENDPOINT_URL || 'https://api.digitransit.fi/geocoding/v1/search',
    availabilityEndpointUrl: process.env.AVAILABILITY_ENDPOINT_URL || 'https://http-api-dot-fillarivahti.appspot.com/',
    maxSearchTextLength: typeof process.env.MAX_SEARCH_TEXT_LENGTH !== 'undefined' ? Number(process.env.MAX_SEARCH_TEXT_LENGTH) : 32,
    maxStationsPerPage: typeof process.env.MAX_STATIONS_PER_PAGE !== 'undefined' ? Number(process.env.MAX_STATIONS_PER_PAGE) : 12,
  },
  i18n: {
    baseUrl: 'https://fillarivahti.fi',
    locales: [
      {
        code: 'en',
        iso: 'en-US',
        file: 'en.json',
        name: 'English',
      },
      {
        code: 'fi',
        iso: 'fi-FI',
        file: 'fi.json',
        name: 'Finnish',
      },
    ],
    defaultLocale: 'fi',
    langDir: 'locales',
    vueI18n: {
      fallbackLocale: 'en',
    },
  },
})
