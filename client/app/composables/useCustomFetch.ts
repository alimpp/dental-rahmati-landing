import { useAdminToken } from '~/composables/useAdminToken'

export const useCustomFetch = () => {
  const config = useRuntimeConfig()
  const token = useAdminToken()

  return $fetch.create({
    baseURL: config.public.apiBase as string,

    onRequest({ options }) {
      const value = token.value
      if (!value) return
      const headers = new Headers(options.headers as HeadersInit | undefined)
      if (!headers.has('Authorization')) {
        headers.set('Authorization', `Bearer ${value}`)
      }
      options.headers = headers
    },

    onRequestError({ error }) {
      if (import.meta.dev) {
        console.warn('[api]', error instanceof Error ? error.message : error)
      }
    },
  })
}
