/**
 * Resolve media paths for <img>/<video>.
 * `/uploads/*` must hit the API host directly — Nuxt routeRules proxy is
 * baked at build time and breaks on Liara when API_ORIGIN isn't set then.
 */
export function useMediaSrc() {
  const config = useRuntimeConfig()
  const origin = String(config.public.apiBase || '').replace(/\/api\/?$/, '')

  return (path?: string | null) => {
    if (!path) return ''
    if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
      return path
    }
    if (path.startsWith('/uploads/')) {
      return origin ? `${origin}${path}` : path
    }
    return path
  }
}
