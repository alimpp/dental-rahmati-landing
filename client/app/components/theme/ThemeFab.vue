<script setup lang="ts">
import { useSiteTheme } from '~/composables/useSiteTheme'

const { openPicker, ready, initSiteTheme } = useSiteTheme()

onMounted(() => {
  if (!ready.value) void initSiteTheme()
})
</script>

<template>
  <ThemeIconButton
    class="fixed bottom-5 start-5 z-[70] size-11 rounded-full border border-mist bg-surface/95 shadow-lg backdrop-blur-md hover:border-green-deep hover:shadow-xl sm:bottom-8 sm:start-8"
    label="تغییر تم سایت"
    @click="openPicker"
  />
</template>
