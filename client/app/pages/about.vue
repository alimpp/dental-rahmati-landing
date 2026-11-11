<script setup lang="ts">
import HomeAboutSection from '~/components/home/AboutSection.vue'
import GuidesPreview from '~/modules/guide/components/GuidesPreview.vue'

usePageSeo({
  title: 'درباره دکتر امیر رحمتی | دندانپزشک کرج جهانشهر',
  description:
    'آشنایی با دکتر امیر رحمتی و کلینیک دندانپزشکی در کرج جهانشهر، بلوار جمهوری نبش کوچه غزال؛ زیبایی، ایمپلنت، دیجیتال و لیزر.',
  keywords: 'دکتر امیر رحمتی, بهترین دندانپزشک کرج, کلینیک دندانپزشکی جهانشهر, دندانپزشکی در کرج, ساختمان فاتح',
  path: '/about',
  image: '/clinic/01-facade.jpg',
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
