import { SITE_ORIGIN } from '~/data/seo'

type PageSeoInput = {
  title: MaybeRefOrGetter<string>
  description: MaybeRefOrGetter<string>
  image?: MaybeRefOrGetter<string | undefined | null>
  keywords?: MaybeRefOrGetter<string | undefined | null>
  path?: MaybeRefOrGetter<string | undefined>
  type?: 'website' | 'article' | 'profile'
  noindex?: boolean
  published?: MaybeRefOrGetter<string | undefined | null>
}

const DEFAULT_OG = '/banners/clinic-hero.jpg'

export function usePageSeo(input: PageSeoInput) {
  const route = useRoute()
  const config = useRuntimeConfig()
  const origin = String(config.public.siteUrl || '').replace(/\/$/, '') || SITE_ORIGIN

  const canonical = computed(() => {
    const p = toValue(input.path) || route.path || '/'
    const clean = p === '/' ? '/' : p.replace(/\/$/, '')
    return `${origin}${clean}`
  })

  const image = computed(() => {
    const raw = toValue(input.image)
    if (!raw) return `${origin}${DEFAULT_OG}`
    if (raw.startsWith('http')) return raw
    return `${origin}${raw.startsWith('/') ? raw : `/${raw}`}`
  })

  useSeoMeta({
    title: () => toValue(input.title),
    description: () => toValue(input.description),
    ogTitle: () => toValue(input.title),
    ogDescription: () => toValue(input.description),
    ogType: input.type || 'website',
    ogUrl: () => canonical.value,
    ogImage: () => image.value,
    ogLocale: 'fa_IR',
    ogSiteName: 'کلینیک دندان‌پزشکی دکتر امیر رحمتی | دندان پزشکی دیجیتال در کرج',
    twitterCard: 'summary_large_image',
    twitterTitle: () => toValue(input.title),
    twitterDescription: () => toValue(input.description),
    twitterImage: () => image.value,
    keywords: () => toValue(input.keywords) || undefined,
    robots: input.noindex ? 'noindex, nofollow' : 'index, follow',
    articlePublishedTime: () => toValue(input.published) || undefined,
  })

  useHead({
    link: [{ rel: 'canonical', href: () => canonical.value }],
    meta: [
      { name: 'geo.region', content: 'IR-30' },
      { name: 'geo.placename', content: 'کرج' },
      { name: 'geo.position', content: '35.8282;50.9791' },
      { name: 'ICBM', content: '35.8282, 50.9791' },
      { name: 'author', content: 'دکتر امیر رحمتی' },
    ],
  })
}
