<script setup lang="ts">
import HomeAboutSection from '~/components/home/AboutSection.vue'
import GuidesPreview from '~/modules/guide/components/GuidesPreview.vue'

usePageSeo({
  title: 'درباره دکتر امیر رحمتی | بهترین دندانپزشک کرج جهانشهر',
  description:
    'آشنایی با دکتر امیر رحمتی و کلینیک دندانپزشکی در کرج جهانشهر، کسری شمالی کوچه غزال؛ دیجیتال، ایمپلنت و لمینت.',
  keywords: 'بهترین دندانپزشک کرج, دکتر امیر رحمتی, کلینیک دندانپزشکی جهانشهر, دندانپزشکی در کرج',
  path: '/about',
  image: '/images/logo.svg',
})
</script>

<template>
  <div class="bg-surface">
    <SiteReveal variant="tilt">
      <HomeAboutSection full />
    </SiteReveal>
    <SiteReveal variant="zoom" delay="40ms">
      <GuidesPreview />
    </SiteReveal>
  </div>
</template>
