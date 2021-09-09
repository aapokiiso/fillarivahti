<template>
    <footer class="about-driver">
        <NuxtLink
            :to="localePath('about')"
            class="about-driver__link"
        >
            {{ $t('about.linkLabel') }}
        </NuxtLink>
    </footer>
</template>

<style lang="scss" scoped>
.about-driver__link {
    border-radius: var(--space-unit-xxs);
    text-align: center;
    display: block;
    padding: var(--space-unit-xs) 0;
    background-color: var(--color-light-gray-accent);
    color: inherit;
    text-decoration: none;
    transition: background-color var(--transition-time);

    &:hover,
    &:focus {
        background-color: var(--color-mid-gray);
    }
}
</style>
