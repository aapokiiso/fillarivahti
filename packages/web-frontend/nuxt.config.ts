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
                { charset: 'utf-8' },
                { name: 'viewport', content: 'width=device-width, initial-scale=1' },
                {
                    hid: 'description',
                    name: 'description',
                    content: this.$t('siteDescription')
                },
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
                    siteDescription: 'Fillarivahti näyttää Helsingin seudun kaupunkipyörien saatavuuden tämänhetkisen tilanteen ja suunnan.',
                    stationCard: {
                        journeyPlannerLinkTitle: 'Katso asema HSL Reittioppaassa',
                    },
                    capacityStatus: {
                        title: 'Pyöriä juuri nyt',
                        ariaLabel: '{bikesAvailable} / {capacity} pyörää saatavilla juuri nyt'
                    },
                    stationSearch: {
                        inputPlaceholder: 'Hae pyöräasemia...',
                        inputHelp: 'Hae pyöräasemia nimen tai osoitteen mukaan',
                        locationHelp: 'Hae pyöräasemia läheltäsi'
                    },
                    stationList: {
                        pending: 'Asemia ladataan...',
                        error: 'Jotain meni pieleen :( Sivun päivitys voi auttaa',
                        empty: 'Ei asemia. Voit kokeilla hakea niitä hakusanan tai sijaintisi perusteella.',
                    },
                    creditsPage: {
                        title: 'Kiitokset',
                        hsl: 'Tää oli tosi hauska tehdä! Isot kiitokset HSL:lle ja DigiTransitille loistavista rajapinnoista ja isosta kasasta avointa dataa 😍',
                        about: 'Jos kiinnostaa tutkailla miten saitti on rakennettu, lähdekoodi löytyy Githubista. Samassa paketissa on myös saatavuustietojen seuranta ja rajapinta josta niitä voi kysellä.',
                        githubLink: 'Linkki Githubiin',
                        licensesTitle: 'Lisenssit',
                        fontAwesome: 'Font Awesome -ikonikirjasto',
                        backLink: 'Takaisin asemalistaan',
                    }
                },
                en: {
                    siteTitle: 'Fillarivahti',
                    siteDescription: 'Fillarivahti visualizes the availability situation and trend of Helsinki area city bikes.',
                    stationCard: {
                        journeyPlannerLinkTitle: 'View station in HSL Journey Planner',
                    },
                    capacityStatus: {
                        title: 'Bikes available right now',
                        ariaLabel: '{bikesAvailable} out of {capacity} bikes available right now'
                    },
                    stationSearch: {
                        inputPlaceholder: 'Search for bike stations...',
                        inputHelp: 'Search for bike stations by their name or address',
                        locationHelp: 'Search for bike stations near you'
                    },
                    stationList: {
                        pending: 'Fetching stations...',
                        error: 'Something went wrong :( Reloading the site might help',
                        empty: 'No stations found. You can try to find them by their name or your location.',
                    },
                    creditsPage: {
                        title: 'Credits',
                        hsl: 'This was super fun to make! Big thanks for HSL and DigiTransit for providing such great APIs and boatloads of open data 😍',
                        about: 'If you\'re interested to check out how the site is built, the sources are available on Github. The repository includes the availability recorder and the API for reading them, as well.',
                        githubLink: 'Link to Github',
                        licensesTitle: 'Licenses',
                        fontAwesome: 'Font Awesome icon library',
                        backLink: 'Back to station list',
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
                strategy: 'prefix_except_default',
                baseUrl: 'https://fillarivahti.fi',
                parsePages: false,
                pages: {
                    credits: {
                        fi: '/kiitokset',
                        en: '/credits',
                    }
                }
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
