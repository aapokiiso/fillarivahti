import {NuxtConfig} from '@nuxt/types';

const config: NuxtConfig = {
    axios: {
        progress: false,
    },
    buildModules: [
        '@nuxt/typescript-build'
    ],
    components: true,
    env: {
        hslGraphqlEndpointUrl: process.env.HSL_GRAPHQL_ENDPOINT_URL || 'https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql',
        // TODO: TLS and proper domain for default
        capacityEndpointUrl: process.env.CAPACITY_ENDPOINT_URL || 'http://34.88.107.181/'
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
