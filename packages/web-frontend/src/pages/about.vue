<template>
    <main>
        <div class="content-wrapper">
            <h1>{{ $t('about.title') }}</h1>

            <section>
                <p>{{ $t("about.summary") }}</p>

                <p>{{ $t("about.sources") }}</p>
                <p><a href="https://github.com/aapokiiso/fillarivahti">{{ $t('about.githubLink') }}</a></p>
            </section>

            <section>
                <h2>{{ $t("credits.title") }}</h2>

                <p>{{ $t("credits.hsl") }}</p>

                <h3>{{ $t("credits.licensesTitle") }}</h3>
                <ul>
                    <li>
                        <a href="https://data.markuskainu.fi/opendata/kaupunkipyorat/">
                            {{ $t("credits.historicalData") }}
                        </a>
                    </li>
                    <li>
                        <a href="https://fontawesome.com/license">
                            {{ $t("credits.fontAwesome") }}
                        </a>
                    </li>
                </ul>
            </section>

            <NuxtLink :to="localePath('/')">
                {{ $t("about.backLinkLabel") }}
            </NuxtLink>
        </div>
    </main>
</template>

<script lang="ts">
// TODO:
// For some reason ESLint does not recognize the MetaInfo export. Have to
// investigate this later when cleaning up head & meta information.
// eslint-disable-next-line import/named
import { MetaInfo } from 'vue-meta';
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
    head (): MetaInfo {
        const i18nHead = this.$nuxtI18nHead({ addSeoAttributes: true });

        return {
            title: this.$t('siteTitle') as string,
            htmlAttrs: {
                ...i18nHead.htmlAttrs,
            },
            link: [
                ...i18nHead.link,
            ],
            meta: [
                {
                    hid: 'description',
                    name: 'description',
                    content: this.$t('siteDescription') as string,
                },
                ...i18nHead.meta,
            ],
        };
    },
});
</script>
