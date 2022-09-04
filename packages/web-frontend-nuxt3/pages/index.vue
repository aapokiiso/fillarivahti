<script setup lang="ts">
import { useLocalePath } from '#i18n'

const localePath = useLocalePath()

navigateTo(localePath({ name: 'list' }), { redirectCode: 301 })
</script>
