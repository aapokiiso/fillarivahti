import { NuxtConfig } from '@nuxt/types';

const config: NuxtConfig = {
    buildModules: [
        '@nuxt/typescript-build',
        '@nuxtjs/svg',
        '@nuxtjs/google-fonts',
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
    googleFonts: {
        families: {
            'Open+Sans': {
                wght: [400, 700]
            },
        }
    },
    head() {
        const i18nHead = this.$nuxtI18nHead({ addSeoAttributes: true })

        return {
            title: this.$t('siteTitle'),
            htmlAttrs: {
                ...i18nHead.htmlAttrs,
            },
            link: [
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
                        journeyPlannerLinkLabel: 'Katso asema HSL Reittioppaassa',
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
                        backLink: 'Takaisin asemalistaan',
                    },
                    about: {
                        title: 'Tietoja',
                        linkLabel: 'Tietoja',
                        backLinkLabel: 'Takaisin asemalistaan',
                        summary: 'Fillarivahti seuraa taustalla Helsingin ja Espoon kaupunkipyörien saatavuutta. Jokaisesta pyöräasemasta piirtyy kuva, jossa näkyy keltaisella tämänpäiväinen saatavuustilanne, ja harmaalla viikonpäivän keskiarvo. Musta katkoviiva kuvaa aseman täyttä kapasiteettia ja auttaa hahmottamaan saatavuustilannetta.',
                        sources: 'Jos kiinnostaa tutkailla miten saitti on rakennettu, lähdekoodi löytyy Githubista. Samassa paketissa on myös saatavuustietojen seuranta ja rajapinta josta niitä voi kysellä.',
                        githubLink: 'Linkki Githubiin',
                    },
                    credits: {
                        title: 'Kiitokset',
                        hsl: 'Kiitokset HSL:lle ja DigiTransitille loistavista rajapinnoista, ja Markus Kainulle isosta kasasta historiallista pyörien saatavuusdataa!',
                        about: 'Jos kiinnostaa tutkailla miten saitti on rakennettu, lähdekoodi löytyy Githubista. Samassa paketissa on myös saatavuustietojen seuranta ja rajapinta josta niitä voi kysellä.',
                        githubLink: 'Linkki Githubiin',
                        licensesTitle: 'Lisenssit',
                        historicalData: 'Historialliset pyörien saatavuustiedot (Markus Kainu)',
                        fontAwesome: 'Font Awesome -ikonikirjasto',
                    }
                },
                en: {
                    siteTitle: 'Fillarivahti',
                    siteDescription: 'Fillarivahti visualizes the availability situation and trend of Helsinki area city bikes.',
                    stationCard: {
                        journeyPlannerLinkLabel: 'View station in HSL Journey Planner',
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
                    about: {
                        title: 'About',
                        linkLabel: 'About',
                        backLinkLabel: 'Back to station list',
                        summary: 'Fillarivahti records the availability of each bike station in Helsinki and Espoo. The yellow line graphs today\'s availability, and the gray area shows the weekday\'s average availability. The black, dashed line visualizes full capacity, and helps put things in perspective.',
                        sources: 'If you\'re interested to check out how the site is built, the sources are available on Github. The repository includes the availability recorder and the API for reading them, as well.',
                        githubLink: 'Link to Github',
                    },
                    credits: {
                        title: 'Credits',
                        hsl: 'Thanks to HSL and DigiTransit for providing open APIs, and to Markus Kainu for collecting historical bike availability data!',
                        licensesTitle: 'Licenses',
                        historicalData: 'Historical bike availability data (Markus Kainu)',
                        fontAwesome: 'Font Awesome icon library',
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
                baseUrl: 'https://fillarivahti.fi'
            }
        ],
    ],
    plugins: [
        '~/plugins/composition-api',
        '~/plugins/axios',
        { src: '~/plugins/chartjs.ts', ssr: false },
        '~/plugins/loading-skeleton',
    ],
    srcDir: 'src',
};

export default config;
