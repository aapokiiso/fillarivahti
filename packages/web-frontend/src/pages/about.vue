<template>
    <main>
        <div class="content-wrapper">
            <h1>{{ $t('about.title') }}</h1>

            <section>
                <p>{{ $t("about.summary") }}</p>
            </section>

            <section>
                <h2>{{ $t("credits.title") }}</h2>

                <p>{{ $t("credits.hsl") }}</p>

                <p>{{ $t("credits.about") }}</p>
                <p><a href="https://github.com/aapokiiso/fillarivahti">{{ $t('credits.githubLink') }}</a></p>

                <h3>{{ $t("credits.licensesTitle") }}</h3>
                <ul>
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
