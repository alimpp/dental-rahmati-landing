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
      title: 'دندان پزشکی دیجیتال در کرج | دکتر امیر رحمتی',
      titleTemplate: '%s',
      meta: [
        { name: 'theme-color', content: '#0f766e' },
        { name: 'format-detection', content: 'telephone=no' },
        {
          name: 'keywords',
          content:
            'دندان پزشکی دیجیتال, ایمپلنت دیجیتال, خدمات دندان پزشکی دیجیتال, دکتر امیر رحمتی, دندان پزشکی در کرج, ایمپلنت, لمینت, کامپوزیت',
        },
        { name: 'geo.region', content: 'IR-30' },
        { name: 'geo.placename', content: 'کرج' },
        { name: 'geo.position', content: '35.8282;50.9791' },
        { name: 'ICBM', content: '35.8282, 50.9791' },
      ],
    },
  },
  site: {
    url: process.env.NUXT_SITE_URL || process.env.NUXT_PUBLIC_SITE_URL || 'https://dramirrahmati.com',
    name: 'کلینیک دندان‌پزشکی دکتر امیر رحمتی | دندان پزشکی دیجیتال در کرج',
    description:
      'دکتر امیر رحمتی — دندان پزشکی دیجیتال، ایمپلنت دیجیتال، لمینت، کامپوزیت و طراحی لبخند.',
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
      name: 'کلینیک دندان‌پزشکی دکتر امیر رحمتی',
      url: process.env.NUXT_SITE_URL || process.env.NUXT_PUBLIC_SITE_URL || 'https://dramirrahmati.com',
      logo: '/images/logo.svg',
      description:
        'دندان پزشکی دیجیتال، ایمپلنت دیجیتال، لمینت و کامپوزیت — دکتر امیر رحمتی.',
    },
  },
  routeRules: {
    // Admin is cookie-auth + client modules; SSR on refresh caused 500s on some pages.
    '/admin/**': { ssr: false, robots: false },
    '/admin/login': { ssr: false, robots: false },
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
      // Override at runtime on Liara with NUXT_PUBLIC_API_BASE / NUXT_PUBLIC_SITE_URL
      apiBase:
        process.env.NUXT_PUBLIC_API_BASE
        || process.env.API_BASE_URL
        || 'http://localhost:4000/api',
      siteUrl:
        process.env.NUXT_PUBLIC_SITE_URL
        || process.env.NUXT_SITE_URL
        || 'https://dramirrahmati.com',
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
})
