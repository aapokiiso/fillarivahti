import {NuxtConfig} from '@nuxt/types';

const config: NuxtConfig = {
    srcDir: 'src',
    buildModules: [
        '@nuxt/typescript-build'
    ],
    plugins: [
        '@/plugins/composition-api'
    ]
};

export default config;
