<script setup lang="ts">
import { useLocalePath } from '#i18n'

const localePath = useLocalePath()

navigateTo(localePath({ name: 'map' }), { redirectCode: 301 })
</script>
