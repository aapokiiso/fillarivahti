import {NuxtConfig} from '@nuxt/types';

const config: NuxtConfig = {
    buildModules: [
        '@nuxt/typescript-build'
    ],
    components: true,
    env: {
        // TODO: TLS and proper domain for default
        CAPACITY_ENPOINT_URL: process.env.CAPACITY_ENDPOINT_URL || 'http://34.88.107.181/'
    },
    plugins: [
        '~/plugins/composition-api',
        '~/plugins/hsl-graphql-client',
        '~/plugins/http-api-client',
    ],
    srcDir: 'src',
};

export default config;
