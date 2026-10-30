<template>
  <div>
    <SiteReveal variant="fade" delay="0ms">
      <BannerSlider />
    </SiteReveal>
    <SiteReveal variant="fade" delay="0ms">
      <PromisesSection />
    </SiteReveal>
    <SiteReveal variant="fade" delay="0ms">
      <ServicesSection />
    </SiteReveal>
    <SiteReveal variant="fade" delay="30ms">
      <ClinicInviteSection />
    </SiteReveal>
    <SiteReveal variant="zoom" delay="20ms">
      <HomeInstagramSection />
    </SiteReveal>
    <SiteReveal variant="fade" delay="30ms">
      <HomeStatsStrip />
    </SiteReveal>
    <SiteReveal variant="up" delay="40ms">
      <HomeCasePathSection />
    </SiteReveal>
    <SiteReveal variant="soft" delay="40ms">
      <TestimonialsSection />
    </SiteReveal>

    <SiteReveal variant="up" delay="0ms">
      <ArticlesPreview />
    </SiteReveal>
    <SiteReveal variant="up" delay="40ms">
      <HomeAboutSection />
    </SiteReveal>
    <SiteReveal variant="soft" delay="0ms">
      <HomeContactSection />
    </SiteReveal>
    <SiteReveal variant="fade" delay="40ms">
      <HomeCtaBand />
    </SiteReveal>
  </div>
</template>

<script setup lang="ts">
import BannerSlider from '~/modules/banner/components/BannerSlider.vue'
import PromisesSection from '~/modules/promise/components/PromisesSection.vue'
import ServicesSection from '~/modules/service/components/ServicesSection.vue'
import HomeAboutSection from '~/components/home/AboutSection.vue'
import HomeContactSection from '~/components/home/ContactSection.vue'
import HomeInstagramSection from '~/components/home/InstagramSection.vue'
import ArticlesPreview from '~/modules/article/components/ArticlesPreview.vue'
import TestimonialsSection from '~/modules/testimonial/components/TestimonialsSection.vue'
import ClinicInviteSection from '~/components/clinic/ClinicInviteSection.vue'

usePageSeo({
  title: 'دندانپزشکی در کرج | کلینیک امیر رحمتی جهانشهر',
  description:
    'کلینیک دندان‌پزشکی امیر رحمتی در کرج جهانشهر: دیجیتال، ایمپلنت، لمینت، ارتودنسی و رزرو نوبت — کسری شمالی، کوچه غزال.',
  keywords:
    'دندانپزشکی در کرج, بهترین دندانپزشک کرج, دندان پزشکی دیجیتال در کرج, ایمپلنت در کرج, لمینت دندان کرج, کلینیک دندانپزشکی جهانشهر, دکتر امیر رحمتی',
  path: '/',
  image: '/clinic/01-facade.jpg',
})
</script>
