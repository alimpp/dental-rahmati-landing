const VISITOR_KEY = 'dr_analytics_vid'

function getVisitorId(): string {
  try {
    let id = localStorage.getItem(VISITOR_KEY)
    if (!id || id.length < 8) {
      id = (globalThis.crypto?.randomUUID?.() || `v_${Date.now()}_${Math.random().toString(36).slice(2)}`)
        .replace(/[^a-zA-Z0-9_-]/g, '')
        .slice(0, 64)
      localStorage.setItem(VISITOR_KEY, id)
    }
    return id
  }
  catch {
    return `s_${Date.now().toString(36)}`
  }
}

export default defineNuxtPlugin(() => {
  const router = useRouter()
  const config = useRuntimeConfig()
  const visitorId = import.meta.client ? getVisitorId() : ''

  const track = (path: string) => {
    if (!path || path.startsWith('/admin')) return
    $fetch('/analytics/hit', {
      baseURL: config.public.apiBase as string,
      method: 'POST',
      body: { path, visitorId },
    }).catch(() => {})
  }

  router.afterEach((to) => {
    track(to.path)
  })
})
