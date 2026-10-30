<script setup lang="ts">
import FaqSection from '~/modules/faq/components/FaqSection.vue'
</script>

<template>
  <div class="site-faq">
    <SiteReveal variant="drop" delay="40ms">
      <FaqSection />
    </SiteReveal>
  </div>
</template>
