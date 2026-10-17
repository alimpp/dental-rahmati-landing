<script setup lang="ts">
import { siteContact } from '~/data/site-contact'

const siteUrl = useRuntimeConfig().public.siteUrl as string

useSchemaOrg([
  defineWebSite({
    name: 'کلینیک دندان‌پزشکی امیر رحمتی | دندانپزشکی در کرج',
    inLanguage: 'fa-IR',
    description:
      'دندان‌پزشکی دیجیتال، ایمپلنت و لمینت در کرج جهانشهر — کلینیک دکتر امیر رحمتی.',
  }),
  {
    '@type': ['Dentist', 'MedicalBusiness', 'LocalBusiness'],
    '@id': `${siteUrl}/#clinic`,
    name: siteContact.name,
    alternateName: ['دندانپزشکی امیر رحمتی کرج', 'کلینیک دندانپزشکی جهانشهر'],
    url: siteUrl,
    logo: `${siteUrl}/images/logo.svg`,
    image: `${siteUrl}/banners/clinic-hero.jpg`,
    email: siteContact.email,
    telephone: siteContact.phoneHref.replace('tel:', ''),
    priceRange: '$$',
    medicalSpecialty: ['Dentistry', 'CosmeticDentistry', 'OralSurgery'],
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'IR',
      addressRegion: 'البرز',
      addressLocality: 'کرج',
      streetAddress: 'جهانشهر، خیابان کسری شمالی، کوچه غزال',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: siteContact.lat,
      longitude: siteContact.lng,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday'],
        opens: '09:00',
        closes: '20:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Thursday',
        opens: '09:00',
        closes: '14:00',
      },
    ],
    areaServed: [
      { '@type': 'City', name: 'کرج' },
      { '@type': 'AdministrativeArea', name: 'البرز' },
    ],
    employee: {
      '@type': 'Person',
      name: 'دکتر امیر رحمتی',
      jobTitle: 'دندانپزشک',
      worksFor: { '@id': `${siteUrl}/#clinic` },
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'خدمات دندانپزشکی در کرج',
      itemListElement: [
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'دندان‌پزشکی دیجیتال در کرج' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'ایمپلنت دندان در کرج' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'لمینت دندان در کرج' } },
      ],
    },
  },
])
</script>

<template>
  <div class="min-h-screen bg-surface text-ink" dir="rtl" lang="fa">
    <LayoutScrollProgress />
    <LayoutSiteTopBar />
    <LayoutSiteHeader />
    <main class="overflow-x-clip">
      <slot />
      <LayoutSiteGuidesFaq />
    </main>
    <LayoutSiteFooter />
  </div>
</template>
