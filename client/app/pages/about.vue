<script setup lang="ts">
import HomeAboutSection from '~/components/home/AboutSection.vue'
import GuidesPreview from '~/modules/guide/components/GuidesPreview.vue'
import { aboutProfile } from '~/data/about-profile'
import { SEO_PAGES } from '~/data/seo'
import { siteContact } from '~/data/site-contact'

usePageSeo({
  title: SEO_PAGES.about.title,
  description: SEO_PAGES.about.description,
  keywords: SEO_PAGES.about.keywords,
  path: '/about',
  image: '/clinic/01-reception.jpg',
  type: 'profile',
})

const siteUrl = useRuntimeConfig().public.siteUrl as string

useSchemaOrg([
  defineBreadcrumb({
    itemListElement: [
      { name: 'خانه', item: '/' },
      { name: 'درباره ما', item: '/about' },
    ],
  }),
  {
    '@type': 'Person',
    '@id': `${siteUrl}/about#physician`,
    name: aboutProfile.name,
    jobTitle: aboutProfile.headline,
    description: aboutProfile.summary.join(' '),
    url: `${siteUrl}/about`,
    image: `${siteUrl}/clinic/01-reception.jpg`,
    telephone: siteContact.phoneHref.replace('tel:', ''),
    email: siteContact.email,
    identifier: siteContact.medicalLicense,
    worksFor: { '@id': `${siteUrl}/#clinic` },
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'IR',
      addressRegion: 'البرز',
      addressLocality: 'کرج',
      streetAddress: siteContact.address,
    },
    knowsAbout: [
      'دندان پزشکی دیجیتال',
      'ایمپلنت دیجیتال',
      'لمینت',
      'کامپوزیت',
      'طراحی لبخند دیجیتال',
    ],
    sameAs: [
      siteContact.instagramUrl,
      'https://www.paziresh24.com/dr/دکتر-امیر-رحمتی/',
    ],
  },
])
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
