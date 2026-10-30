// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/seo'],
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      htmlAttrs: { lang: 'fa', dir: 'rtl' },
      title: 'دندانپزشکی در کرج | کلینیک امیر رحمتی',
      titleTemplate: '%s',
      meta: [
        { name: 'theme-color', content: '#0f766e' },
        { name: 'format-detection', content: 'telephone=no' },
        {
          name: 'keywords',
          content:
            'دندانپزشکی در کرج, بهترین دندانپزشک کرج, دندان پزشکی دیجیتال در کرج, ایمپلنت در کرج, لمینت دندان کرج, کلینیک دندانپزشکی جهانشهر, دکتر امیر رحمتی',
        },
        { name: 'geo.region', content: 'IR-30' },
        { name: 'geo.placename', content: 'کرج' },
        { name: 'geo.position', content: '35.8294;50.9972' },
        { name: 'ICBM', content: '35.8294, 50.9972' },
      ],
    },
  },
  site: {
    url: process.env.NUXT_SITE_URL || 'https://dentalrahmati.ir',
    name: 'کلینیک دندان‌پزشکی امیر رحمتی | کرج',
    description:
      'کلینیک دندان‌پزشکی امیر رحمتی در کرج، جهانشهر — دندان‌پزشکی دیجیتال، ایمپلنت، لمینت، زیبایی و رزرو نوبت. بهترین مسیر درمان دندان در کرج.',
    defaultLocale: 'fa',
    trailingSlash: false,
  },
  sitemap: {
    exclude: ['/admin/**'],
    sources: ['/api/__sitemap__/urls'],
  },
  robots: {
    disallow: ['/admin', '/admin/*'],
  },
  ogImage: {
    enabled: true,
  },
  schemaOrg: {
    identity: {
      type: 'Dentist',
      name: 'کلینیک دندان‌پزشکی امیر رحمتی',
      url: process.env.NUXT_SITE_URL || 'https://dentalrahmati.ir',
      logo: '/images/logo.svg',
      description:
        'دندانپزشکی دیجیتال، ایمپلنت و لمینت در کرج، جهانشهر — کلینیک دکتر امیر رحمتی.',
    },
  },
  routeRules: {
    '/admin/**': { robots: false, ssr: false },
    '/team': { redirect: '/about' },
    '/team/**': { redirect: '/about' },
    '/guides': { redirect: '/articles' },
    '/guides/**': { redirect: '/articles' },
    '/catalog': { redirect: '/articles' },
    '/catalog/**': { redirect: '/articles' },
    '/offers': { redirect: '/' },
    '/offers/**': { redirect: '/' },
    // Baked at build time — always export API_ORIGIN when deploying.
    '/uploads/**': {
      proxy: `${
        process.env.API_ORIGIN
        || String(process.env.NUXT_PUBLIC_API_BASE || '').replace(/\/api\/?$/, '')
        || 'https://rahmati-dent-api.liara.run'
      }/uploads/**`,
    },
  },
  runtimeConfig: {
    public: {
      // Runtime override on Liara: NUXT_PUBLIC_API_BASE / NUXT_PUBLIC_SITE_URL
      apiBase:
        process.env.NUXT_PUBLIC_API_BASE
        || process.env.API_BASE_URL
        || 'https://rahmati-dent-api.liara.run/api',
      siteUrl:
        process.env.NUXT_PUBLIC_SITE_URL
        || process.env.NUXT_SITE_URL
        || 'https://rahmati-dent.liara.run',
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
})
