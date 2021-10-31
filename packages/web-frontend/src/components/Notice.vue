<template>
    <p class="notice">
        <slot name="content" />
    </p>
</template>

<style lang="scss" scoped>
.notice {
    text-align: center;
    padding: var(--space-unit-xs) 0;
}
</style>
