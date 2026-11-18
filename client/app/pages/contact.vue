<script setup lang="ts">
import HomeContactSection from '~/components/home/ContactSection.vue'
import { SEO_PAGES } from '~/data/seo'

usePageSeo({
  title: SEO_PAGES.contact.title,
  description: SEO_PAGES.contact.description,
  keywords: SEO_PAGES.contact.keywords,
  path: '/contact',
  image: '/clinic/01-reception.jpg',
})

useSchemaOrg([
  defineBreadcrumb({
    itemListElement: [
      { name: 'خانه', item: '/' },
      { name: 'تماس با ما', item: '/contact' },
    ],
  }),
  defineWebPage({
    name: SEO_PAGES.contact.title,
    description: SEO_PAGES.contact.description,
  }),
])
</script>

<template>
  <div class="bg-surface">
    <SiteReveal variant="fade">
      <HomeContactSection as-page />
    </SiteReveal>
  </div>
</template>
