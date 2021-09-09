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
