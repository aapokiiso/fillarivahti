import { defineNuxtConfig } from 'nuxt'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  build: { transpile: ['@heroicons/vue', 'chart.js'] },
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/i18n',
  ],
  typescript: {
    shim: false,
  },
  runtimeConfig: {
    hslGraphqlEndpointUrl: 'https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql',
    addressSearchEndpointUrl: 'https://api.digitransit.fi/geocoding/v1/search',
    availabilityEndpointUrl: 'https://http-api-dot-fillarivahti.appspot.com/',
    maxSearchTextLength: 32,
    public: {
      mapboxToken: '',
    },
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
