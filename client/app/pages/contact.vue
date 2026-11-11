<script setup lang="ts">
import HomeContactSection from '~/components/home/ContactSection.vue'

usePageSeo({
  title: 'تماس و آدرس کلینیک امیر رحمتی | جهانشهر بلوار جمهوری کرج',
  description:
    'آدرس و تلفن کلینیک دندان‌پزشکی امیر رحمتی در کرج: جهانشهر، ابتدای بلوار جمهوری، نبش کوچه غزال، ساختمان فاتح طبقه ۳ واحد ۷.',
  keywords: 'آدرس دندانپزشکی کرج, کلینیک جهانشهر, بلوار جمهوری کوچه غزال, ساختمان فاتح, تماس دندانپزشک کرج',
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
