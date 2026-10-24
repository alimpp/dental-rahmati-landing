export interface TThemeColors {
  primary: string
  primarySoft: string
  accent: string
  surface: string
  mist: string
  mistDeep: string
  ink: string
  inkMuted: string
}

export interface TTheme {
  id: string
  name: string
  slug: string
  description: string | null
  colors: TThemeColors
  sort: number
  isActive: boolean
  isDefault: boolean
  createdAt?: string | null
  updatedAt?: string | null
}

export type TCreateThemePayload = {
  name: string
  slug: string
  description?: string | null
  colors: TThemeColors
  sort?: number
  isActive?: boolean
  isDefault?: boolean
}

export type TUpdateThemePayload = Partial<TCreateThemePayload>

export const EMPTY_THEME_COLORS: TThemeColors = {
  primary: '#0f766e',
  primarySoft: '#ccfbf1',
  accent: '#22d3ee',
  surface: '#f8fafc',
  mist: '#e2e8f0',
  mistDeep: '#cbd5e1',
  ink: '#0f172a',
  inkMuted: '#475569',
}

export const THEME_COLOR_KEYS = [
  'primary',
  'primarySoft',
  'accent',
  'surface',
  'mist',
  'mistDeep',
  'ink',
  'inkMuted',
] as const satisfies ReadonlyArray<keyof TThemeColors>

export const THEME_COLOR_LABELS: Record<keyof TThemeColors, string> = {
  primary: 'اصلی',
  primarySoft: 'اصلی ملایم',
  accent: 'لهجه',
  surface: 'سطح',
  mist: 'مه',
  mistDeep: 'مه تیره',
  ink: 'متن',
  inkMuted: 'متن کم‌رنگ',
}
