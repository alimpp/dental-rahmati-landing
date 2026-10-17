import type { ServerResponse } from '~~/types/common'

export function unwrapList<T>(raw: unknown): T[] {
  if (Array.isArray(raw)) return raw as T[]
  if (raw && typeof raw === 'object' && Array.isArray((raw as { data: T[] }).data)) {
    return (raw as { data: T[] }).data
  }
  return []
}

export function prettyJson(value: unknown): string {
  if (value == null) return ''
  return JSON.stringify(value, null, 2)
}

export function parseJsonOrThrow(raw: string, label: string): unknown {
  if (!raw.trim()) return null
  try {
    return JSON.parse(raw)
  }
  catch {
    throw new Error(`${label} باید JSON معتبر باشد`)
  }
}

export function formatFaDate(value?: string | null): string {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleString('fa-IR')
}

export function asMessage(response: ServerResponse<unknown>, fallback: string): string {
  return response.message || fallback
}
