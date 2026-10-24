import { applyThemeCss } from '~/modules/theme/utils/apply-theme'
import type { TTheme } from '~/modules/theme/types/index.type'

const STORAGE_KEY = 'rahmati_site_theme_id'

function unwrapList(raw: unknown): TTheme[] {
  if (Array.isArray(raw)) return raw
  if (raw && typeof raw === 'object') {
    const obj = raw as Record<string, unknown>
    if (Array.isArray(obj.data)) return obj.data as TTheme[]
  }
  return []
}

function unwrapItem(raw: unknown): TTheme | null {
  if (!raw || typeof raw !== 'object') return null
  const obj = raw as Record<string, unknown>
  if (obj.id && obj.colors) return raw as TTheme
  if (obj.data && typeof obj.data === 'object') {
    const nested = obj.data as TTheme
    if (nested?.id && nested?.colors) return nested
  }
  return null
}

export function useSiteTheme() {
  const config = useRuntimeConfig()
  const apiBase = computed(() => String(config.public.apiBase || 'http://localhost:4001/api'))

  const loading = ref(false)
  const ready = useState('site-theme-ready', () => false)
  const themes = useState<TTheme[]>('site-themes', () => [])
  const activeTheme = useState<TTheme | null>('site-theme-active', () => null)
  const pickerOpen = useState('site-theme-picker', () => false)

  async function apiGet<T>(path: string, query?: Record<string, string>) {
    return await $fetch<T>(path, {
      baseURL: apiBase.value,
      query,
    })
  }

  async function fetchThemes(all = false) {
    try {
      const raw = await apiGet<unknown>('/themes', all ? { all: 'true' } : undefined)
      return unwrapList(raw)
    }
    catch (err) {
      if (import.meta.dev) console.warn('[theme] list failed', err)
      return []
    }
  }

  async function fetchDefault() {
    try {
      const raw = await apiGet<unknown>('/themes/default')
      return unwrapItem(raw)
    }
    catch (err) {
      if (import.meta.dev) console.warn('[theme] default failed', err)
      return null
    }
  }

  async function fetchById(id: string) {
    try {
      const raw = await apiGet<unknown>(`/themes/${id}`)
      return unwrapItem(raw)
    }
    catch {
      return null
    }
  }

  async function initSiteTheme(force = false) {
    if (!import.meta.client) return
    if (!force && ready.value && activeTheme.value) {
      applyThemeCss(activeTheme.value)
      return
    }

    loading.value = true
    try {
      themes.value = await fetchThemes(false)

      let savedId: string | null = null
      try {
        savedId = localStorage.getItem(STORAGE_KEY)
      }
      catch {
        savedId = null
      }

      let resolved: TTheme | null = null
      if (savedId) {
        resolved = await fetchById(savedId)
        if (resolved && !resolved.isActive) resolved = null
      }
      if (!resolved) {
        resolved = themes.value.find(t => t.isDefault) || null
      }
      if (!resolved) {
        resolved = await fetchDefault()
      }
      if (!resolved && themes.value.length) {
        resolved = themes.value[0]!
      }

      if (resolved) {
        applyThemeCss(resolved)
        activeTheme.value = resolved
      }
      ready.value = true
    }
    finally {
      loading.value = false
    }
  }

  function selectTheme(theme: TTheme) {
    applyThemeCss(theme)
    activeTheme.value = theme
    if (import.meta.client) {
      try {
        localStorage.setItem(STORAGE_KEY, theme.id)
      }
      catch {
        /* private mode */
      }
    }
  }

  async function resetToDefault() {
    if (import.meta.client) {
      try {
        localStorage.removeItem(STORAGE_KEY)
      }
      catch {
        /* ignore */
      }
    }
    const theme
      = themes.value.find(t => t.isDefault)
        || (await fetchDefault())
        || themes.value[0]
        || null
    if (theme) {
      applyThemeCss(theme)
      activeTheme.value = theme
    }
    return theme
  }

  function openPicker() {
    pickerOpen.value = true
    if (!themes.value.length) void initSiteTheme()
  }

  function closePicker() {
    pickerOpen.value = false
  }

  return {
    loading,
    ready,
    themes,
    activeTheme,
    pickerOpen,
    initSiteTheme,
    selectTheme,
    resetToDefault,
    fetchThemes,
    openPicker,
    closePicker,
  }
}
