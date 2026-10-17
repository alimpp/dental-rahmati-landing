<script setup lang="ts">
import GuidesPreview from '~/modules/guide/components/GuidesPreview.vue'
import FaqSection from '~/modules/faq/components/FaqSection.vue'

const route = useRoute()

const showGuidesPreview = computed(() => {
  const path = route.path.replace(/\/$/, '') || '/'
  return path === '/'
})
</script>

<template>
  <div class="site-guides-faq">
    <SiteReveal v-if="showGuidesPreview" variant="zoom" delay="0ms">
      <GuidesPreview />
    </SiteReveal>
    <SiteReveal variant="drop" delay="40ms">
      <FaqSection />
    </SiteReveal>
  </div>
</template>
