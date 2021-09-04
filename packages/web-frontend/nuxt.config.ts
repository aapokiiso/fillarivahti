import { NuxtConfig } from '@nuxt/types';

const config: NuxtConfig = {
    buildModules: [
        '@nuxt/typescript-build',
        '@nuxtjs/svg'
    ],
    components: true,
    css: [
        '~/assets/scss/main.scss',
    ],
    env: {
        hslGraphqlEndpointUrl: process.env.HSL_GRAPHQL_ENDPOINT_URL || 'https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql',
        addressSearchEndpointUrl: process.env.ADDRESS_SEARCH_ENDPOINT_URL || 'https://api.digitransit.fi/geocoding/v1/search',
        capacityEndpointUrl: process.env.CAPACITY_ENDPOINT_URL || 'https://api.fillarivahti.fi/'
    },
    head() {
        const i18nHead = this.$nuxtI18nHead({ addSeoAttributes: true })

        return {
            title: this.$t('siteTitle'),
            htmlAttrs: {
                ...i18nHead.htmlAttrs,
            },
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
                ...i18nHead.link
            ],
            meta: [
                ...i18nHead.meta
            ],
        };
    },
    i18n: {
        locales: [
            {
                code: 'fi',
                iso: 'fi-FI'
            },
            {
                code: 'en',
                iso: 'en-US'
            },
        ],
        defaultLocale: 'fi',
        vueI18n: {
            fallbackLocale: 'en',
            messages: {
                fi: {
                    siteTitle: 'Fillarivahti',
                    capacityStatus: 'Pyöriä juuri nyt',
                    stationSearch: {
                        inputPlaceholder: 'Hae pyöräasemia...',
                        inputHelp: 'Hae pyöräasemia nimen tai osoitteen mukaan',
                        locationHelp: 'Hae pyöräasemia läheltäsi'
                    },
                    stationList: {
                        pending: 'Asemia ladataan...',
                        error: 'Jotain meni pieleen :( Sivun päivitys voi auttaa',
                        empty: 'Ei asemia. Voit kokeilla hakea niitä hakusanan tai sijaintisi perusteella.',
                    }
                },
                en: {
                    siteTitle: 'Fillarivahti',
                    capacityStatus: 'Bikes right now',
                    stationSearch: {
                        inputPlaceholder: 'Search for bike stations...',
                        inputHelp: 'Search for bike stations by their name or address',
                        locationHelp: 'Search for bike stations near you'
                    },
                    stationList: {
                        pending: 'Fetching stations...',
                        error: 'Something went wrong :( Reloading the site might help',
                        empty: 'No stations found. You can try to find them by their name or your location.',
                    }
                },
            }
        }
    },
    loading: false,
    modules: [
        '@nuxtjs/axios',
        [
            '@nuxtjs/i18n',
            {
                baseUrl: 'https://fillarivahti.fi',
            }
        ],
    ],
    plugins: [
        '~/plugins/composition-api',
        '~/plugins/axios',
        { src: '~/plugins/chartjs.ts', ssr: false }
    ],
    srcDir: 'src',
};

export default config;
