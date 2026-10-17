export function useMediaSrc() {
  const config = useRuntimeConfig()
  const origin = String(config.public.apiBase || '').replace(/\/api\/?$/, '')

  return (path?: string | null) => {
    if (!path) return ''
    if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
      return path
    }
    if (path.startsWith('/uploads/')) return `${origin}${path}`
    return path
  }
}
