import { NuxtConfig } from '@nuxt/types';

const config: NuxtConfig = {
    axios: {
        progress: false,
    },
    buildModules: [
        '@nuxt/typescript-build'
    ],
    components: true,
    css: [
        '~/assets/scss/main.scss',
    ],
    env: {
        hslGraphqlEndpointUrl: process.env.HSL_GRAPHQL_ENDPOINT_URL || 'https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql',
        // TODO: TLS and proper domain for default
        capacityEndpointUrl: process.env.CAPACITY_ENDPOINT_URL || 'http://34.88.107.181/'
    },
    head: {
        link: [
            {
                rel: 'preconnect',
                href: 'https://fonts.googleapis.com'
            },
            {
                rel: 'preconnect',
                href: 'https://fonts.gstatic.com',
                crossOrigin: '',
            },
            {
                rel: 'stylesheet',
                href: 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;700&display=swap'
            },
        ]
    },
    modules: [
        '@nuxtjs/axios'
    ],
    plugins: [
        '~/plugins/composition-api',
        '~/plugins/axios',
    ],
    srcDir: 'src',
};

export default config;
