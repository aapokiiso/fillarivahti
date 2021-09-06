<template>
    <main>
        <div class="content-wrapper">
            <h1>{{ $t("creditsPage.title") }}</h1>

            <p>{{ $t("creditsPage.hsl") }}</p>

            <p>{{ $t("creditsPage.about") }}</p>
            <p><a href="https://github.com/aapokiiso/fillarivahti">{{ $t('creditsPage.githubLink') }}</a></p>

            <h2>{{ $t("creditsPage.licensesTitle") }}</h2>
            <ul>
                <li>
                    <a href="https://fontawesome.com/license">
                        {{ $t("creditsPage.fontAwesome") }}
                    </a>
                </li>
            </ul>

            <NuxtLink :to="localePath('/')">
                {{ $t("creditsPage.backLink") }}
            </NuxtLink>
        </div>
    </main>
</template>
