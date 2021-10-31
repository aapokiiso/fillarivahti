import { NuxtConfig } from '@nuxt/types';

const config: NuxtConfig = {
    buildModules: [
        '@nuxt/typescript-build',
        '@nuxtjs/svg',
        '@nuxtjs/google-fonts',
        '@nuxtjs/composition-api/module'
    ],
    components: true,
    css: [
        '~/assets/scss/main.scss',
    ],
    env: {
        hslGraphqlEndpointUrl: process.env.HSL_GRAPHQL_ENDPOINT_URL || 'https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql',
        addressSearchEndpointUrl: process.env.ADDRESS_SEARCH_ENDPOINT_URL || 'https://api.digitransit.fi/geocoding/v1/search',
        capacityEndpointUrl: process.env.CAPACITY_ENDPOINT_URL || 'https://http-api-dot-fillarivahti.appspot.com/'
    },
    googleFonts: {
        families: {
            'Open+Sans': {
                wght: [400, 700]
            },
        }
    },
    head: {
        meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        ],
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
                        capacityStatusLabel: 'Pyöriä nyt'
                    },
                    capacityGraph: {
                        todayLegend: 'Pyöriä tänään',
                        weekdayAverageLegend: 'Pyöriä keskimäärin {weekday}',
                        stationCapacityLegend: 'Aseman kapasiteetti',
                        weekdayForLegend: {
                            0: 'sunnuntaisin',
                            1: 'maanantaisin',
                            2: 'tiistaisin',
                            3: 'keskiviikkoisin',
                            4: 'torstaisin',
                            5: 'perjantaisin',
                            6: 'lauantaisin',
                        }
                    },
                    capacityEstimate: {
                        label: '{minutes}min kuluttua'
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
                    },
                    seasonEndNotice: '🎉 Kiitos kaudesta 2021! Kaupunkifillarit palaavat jälleen käyttöön huhtikuussa.'
                },
                en: {
                    siteTitle: 'Fillarivahti',
                    siteDescription: 'Fillarivahti visualizes the availability situation and trend of Helsinki area city bikes.',
                    stationCard: {
                        journeyPlannerLinkLabel: 'View station in HSL Journey Planner',
                        capacityStatusLabel: 'Bikes now'
                    },
                    capacityGraph: {
                        todayLegend: 'Bikes today',
                        weekdayAverageLegend: 'Bikes on average on {weekday}',
                        stationCapacityLegend: 'Station capacity',
                        weekdayForLegend: {
                            0: 'Sundays',
                            1: 'Mondays',
                            2: 'Tuesdays',
                            3: 'Wednesdays',
                            4: 'Thursdays',
                            5: 'Fridays',
                            6: 'Saturdays',
                        }
                    },
                    capacityEstimate: {
                        label: 'In {minutes}min'
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
                    },
                    seasonEndNotice: '🎉 Thank you for 2021! City bikes will return in April.'
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
