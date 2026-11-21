<script setup lang="ts">
import { siteContact } from '~/data/site-contact'
import { SEO_OFFER_CATALOG } from '~/data/seo'
import { useSiteTheme } from '~/composables/useSiteTheme'
import ThemePicker from '~/components/theme/ThemePicker.vue'

const siteUrl = useRuntimeConfig().public.siteUrl as string
const { initSiteTheme } = useSiteTheme()

onMounted(() => {
  void initSiteTheme()
})

useSchemaOrg([
  defineWebSite({
    name: 'کلینیک دندان‌پزشکی دکتر امیر رحمتی | دندان پزشکی دیجیتال در کرج',
    inLanguage: 'fa-IR',
    description:
      'دکتر امیر رحمتی — دندان پزشکی دیجیتال، ایمپلنت دیجیتال، لمینت و کامپوزیت.',
  }),
  {
    '@type': ['Dentist', 'MedicalBusiness', 'LocalBusiness'],
    '@id': `${siteUrl}/#clinic`,
    name: siteContact.name,
    alternateName: [
      'دکتر امیر رحمتی',
      'دندان پزشکی دیجیتال در کرج',
      'کلینیک دندان‌پزشکی دکتر امیر رحمتی',
    ],
    url: siteUrl,
    logo: `${siteUrl}/images/logo.svg`,
    image: `${siteUrl}/clinic/01-reception.jpg`,
    email: siteContact.email,
    telephone: siteContact.phoneHref.replace('tel:', ''),
    priceRange: '$$',
    medicalSpecialty: [
      'Dentistry',
      'CosmeticDentistry',
      'Prosthodontics',
      'OralSurgery',
    ],
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'IR',
      addressRegion: 'البرز',
      addressLocality: 'کرج',
      streetAddress: siteContact.address,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: siteContact.lat,
      longitude: siteContact.lng,
    },
    sameAs: [
      siteContact.instagramUrl,
      siteContact.mapUrl,
      'https://www.paziresh24.com/dr/دکتر-امیر-رحمتی/',
    ],
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Sunday', 'Tuesday', 'Thursday'],
        opens: '12:00',
        closes: '21:00',
      },
    ],
    areaServed: [
      { '@type': 'City', name: 'کرج' },
      { '@type': 'AdministrativeArea', name: 'البرز' },
    ],
    employee: {
      '@type': 'Person',
      '@id': `${siteUrl}/about#physician`,
      name: 'دکتر امیر رحمتی',
      jobTitle: 'جراح و دندان‌پزشک؛ متخصص درمان‌های دیجیتال و طراحی لبخند',
      identifier: siteContact.medicalLicense,
      worksFor: { '@id': `${siteUrl}/#clinic` },
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'خدمات دندان پزشکی دیجیتال در کرج',
      itemListElement: SEO_OFFER_CATALOG.map((name, index) => ({
        '@type': 'Offer',
        position: index + 1,
        itemOffered: {
          '@type': 'Service',
          name,
          provider: { '@id': `${siteUrl}/#clinic` },
          areaServed: 'کرج',
        },
      })),
    },
    knowsAbout: [
      'دندان پزشکی دیجیتال',
      'ایمپلنت دیجیتال',
      'لمینت',
      'کامپوزیت',
      'طراحی لبخند دیجیتال',
    ],
  },
])
</script>

<template>
  <div class="min-h-screen bg-surface text-ink" dir="rtl" lang="fa">
    <LayoutScrollProgress />
    <LayoutSiteTopBar />
    <LayoutSiteHeader />
    <!-- مهم: overflow روی ancestor باعث شکستن sticky سکشن کلینیک می‌شود -->
    <main>
      <slot />
      <div class="overflow-x-clip">
        <LayoutSiteGuidesFaq />
      </div>
    </main>
    <LayoutSiteFooter />
    <ThemePicker />
  </div>
</template>
