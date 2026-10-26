type SlugItem = { slug?: string }

function asList(payload: unknown): SlugItem[] {
  if (!payload || typeof payload !== 'object') return []
  const data = 'data' in payload ? (payload as { data: unknown }).data : payload
  if (Array.isArray(data)) return data as SlugItem[]
  if (data && typeof data === 'object' && Array.isArray((data as { items?: unknown }).items)) {
    return (data as { items: SlugItem[] }).items
  }
  return []
}

async function fetchList(base: string, path: string) {
  try {
    return asList(await $fetch(path, { baseURL: base }))
  } catch {
    return []
  }
}

async function fetchArticles(base: string) {
  const items: SlugItem[] = []
  for (let page = 1; page <= 20; page += 1) {
    try {
      const payload = await $fetch(`/articles?limit=50&page=${page}`, { baseURL: base })
      const chunk = asList(payload)
      items.push(...chunk)
      const data =
        payload && typeof payload === 'object' && 'data' in payload
          ? (payload as { data: { pageCount?: number } }).data
          : null
      const pageCount = data?.pageCount ?? 1
      if (page >= pageCount || !chunk.length) break
    } catch {
      break
    }
  }
  return items
}

export default defineSitemapEventHandler(async () => {
  const config = useRuntimeConfig()
  const apiBase = String(config.public.apiBase || 'http://localhost:4000/api')
  const [articles, guides, services, portfolio] = await Promise.all([
    fetchArticles(apiBase),
    fetchList(apiBase, '/guides'),
    fetchList(apiBase, '/services'),
    fetchList(apiBase, '/portfolio'),
  ])

  return [
    { loc: '/', changefreq: 'daily', priority: 1 },
    { loc: '/about', changefreq: 'monthly', priority: 0.8 },
    { loc: '/articles', changefreq: 'daily', priority: 0.9 },
    { loc: '/guides', changefreq: 'weekly', priority: 0.8 },
    { loc: '/portfolio', changefreq: 'weekly', priority: 0.7 },
    { loc: '/contact', changefreq: 'monthly', priority: 0.8 },
    { loc: '/consultation', changefreq: 'monthly', priority: 0.8 },
    { loc: '/practice-areas', changefreq: 'weekly', priority: 0.8 },
    ...articles
      .filter((item) => item.slug)
      .map((item) => ({
        loc: `/articles/${item.slug}`,
        changefreq: 'weekly' as const,
        priority: 0.7,
      })),
    ...guides
      .filter((item) => item.slug)
      .map((item) => ({
        loc: `/guides/${item.slug}`,
        changefreq: 'monthly' as const,
        priority: 0.6,
      })),
    ...portfolio
      .filter((item) => item.slug)
      .map((item) => ({
        loc: `/portfolio/${item.slug}`,
        changefreq: 'monthly' as const,
        priority: 0.6,
      })),
    ...services
      .filter((item) => item.slug)
      .map((item) => ({
        loc: `/practice-areas/${item.slug}`,
        changefreq: 'monthly' as const,
        priority: 0.7,
      })),
  ]
})
