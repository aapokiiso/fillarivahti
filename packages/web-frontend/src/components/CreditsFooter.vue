<template>
    <footer class="credits-footer">
        <NuxtLink
            :to="localePath('credits')"
            class="credits-footer__link"
            :title="$t('creditsPage.label')"
            :aria-label="$t('creditsPage.label')"
        >
            🙏
        </NuxtLink>
    </footer>
</template>

<style lang="scss" scoped>
.credits-footer {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: var(--color-light-gray-accent);
    font-size: var(--font-size-sm);
}

.credits-footer__link {
    text-align: center;
    display: block;
    padding: var(--space-unit-xs) 0;
}
</style>
