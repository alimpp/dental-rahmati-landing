export default defineNuxtPlugin(() => {
  const router = useRouter()
  const config = useRuntimeConfig()

  const track = (path: string) => {
    if (!path || path.startsWith('/admin')) return
    $fetch('/analytics/hit', {
      baseURL: config.public.apiBase as string,
      method: 'POST',
      body: { path },
    }).catch(() => {})
  }

  router.afterEach((to) => {
    track(to.path)
  })
})
