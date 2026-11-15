<template>
  <div>
    <SiteReveal variant="fade" delay="0ms">
      <BannerSlider />
    </SiteReveal>
    <SiteReveal variant="soft" delay="40ms">
      <PromisesSection />
    </SiteReveal>
    <SiteReveal variant="up" delay="40ms">
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
import { SEO_HOME, SEO_KEYWORD_STRING } from '~/data/seo'

usePageSeo({
  title: SEO_HOME.title,
  description: SEO_HOME.description,
  keywords: SEO_KEYWORD_STRING,
  path: '/',
  image: SEO_HOME.image,
})

useSchemaOrg([
  defineWebPage({
    name: SEO_HOME.title,
    description: SEO_HOME.description,
  }),
  defineBreadcrumb({
    itemListElement: [{ name: 'خانه', item: '/' }],
  }),
])

const route = useRoute()

onMounted(() => {
  if (route.hash !== '#review-form') return
  requestAnimationFrame(() => {
    document.getElementById('review-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  })
})

watch(
  () => route.hash,
  (hash) => {
    if (hash !== '#review-form') return
    requestAnimationFrame(() => {
      document.getElementById('review-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  },
)
</script>
