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
  const origin = String(config.public.siteUrl || '').replace(/\/$/, '') || 'https://dentalrahmati.ir'

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
    ogSiteName: 'کلینیک دندان‌پزشکی امیر رحمتی | کرج',
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
  })
}
