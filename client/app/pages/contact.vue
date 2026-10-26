<script setup lang="ts">
import HomeContactSection from '~/components/home/ContactSection.vue'

usePageSeo({
  title: 'تماس و آدرس کلینیک امیر رحمتی | جهانشهر کسری شمالی کرج',
  description:
    'آدرس و تلفن کلینیک دندان‌پزشکی امیر رحمتی در کرج: جهانشهر، خیابان کسری شمالی، کوچه غزال — نقشه، ساعات کاری و فرم پیام.',
  keywords: 'آدرس دندانپزشکی کرج, کلینیک جهانشهر, کسری شمالی کوچه غزال, تماس دندانپزشک کرج, دکتر امیر رحمتی',
  path: '/contact',
  image: '/clinic/01-facade.jpg',
})
</script>

<template>
  <div class="bg-surface">
    <SiteReveal variant="fade">
      <HomeContactSection />
    </SiteReveal>
  </div>
</template>
