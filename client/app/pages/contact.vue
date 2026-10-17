<script setup lang="ts">
import HomeContactSection from '~/components/home/ContactSection.vue'

usePageSeo({
  title: 'تماس و آدرس کلینیک در کرج | جهانشهر کسری شمالی',
  description:
    'تماس با کلینیک دندان‌پزشکی امیر رحمتی در کرج: جهانشهر، خیابان کسری شمالی، کوچه غزال — نقشه، تلفن و فرم پیام.',
  keywords: 'آدرس دندانپزشکی کرج, کلینیک جهانشهر, کسری شمالی کوچه غزال, تماس دندانپزشک کرج',
  path: '/contact',
})
</script>

<template>
  <div class="bg-white">
    <SiteReveal variant="fade">
      <HomeContactSection />
    </SiteReveal>
  </div>
</template>
