<script setup lang="ts">
import { useLocalePath } from '#i18n'

const localePath = useLocalePath()

// TODO implement map view and remove this redirect
navigateTo(localePath({ name: 'list' }))
</script>
