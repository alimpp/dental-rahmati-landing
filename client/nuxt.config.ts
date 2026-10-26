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
    '/admin/**': { robots: false },
    '/team': { redirect: '/guides' },
    '/team/**': { redirect: '/guides' },
    '/catalog': { redirect: '/articles' },
    '/catalog/**': { redirect: '/articles' },
    '/offers': { redirect: '/' },
    '/offers/**': { redirect: '/' },
    '/uploads/**': {
      proxy: `${process.env.API_ORIGIN || 'http://localhost:4000'}/uploads/**`,
    },
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE_URL || 'http://localhost:4000/api',
      siteUrl: process.env.NUXT_SITE_URL || 'https://dentalrahmati.ir',
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
})
