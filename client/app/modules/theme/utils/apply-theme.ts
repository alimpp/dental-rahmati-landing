import type { TTheme, TThemeColors } from '../types/index.type'

let themeSwitchClear: number | null = null

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '').trim()
  const full =
    clean.length === 3
      ? clean.split('').map(c => c + c).join('')
      : clean.padEnd(6, '0').slice(0, 6)
  const num = Number.parseInt(full, 16)
  if (Number.isNaN(num)) return [0, 0, 0]
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255]
}

function rgbToHex(r: number, g: number, b: number) {
  const clamp = (n: number) => Math.max(0, Math.min(255, Math.round(n)))
  return `#${[clamp(r), clamp(g), clamp(b)].map(v => v.toString(16).padStart(2, '0')).join('')}`
}

function mixHex(a: string, b: string, t: number) {
  const [ar, ag, ab] = hexToRgb(a)
  const [br, bg, bb] = hexToRgb(b)
  return rgbToHex(ar + (br - ar) * t, ag + (bg - ag) * t, ab + (bb - ab) * t)
}

function luminance(hex: string) {
  const [r, g, b] = hexToRgb(hex).map(v => v / 255)
  const lin = [r, g, b].map((channel) => {
    const c = channel!
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  }) as [number, number, number]
  return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2]
}

function isDarkTheme(c: TThemeColors) {
  return luminance(c.surface) < 0.45 || luminance(c.mist) < 0.4
}

/** متن روی رنگ پر: روشن یا تیره بر اساس درخشندگی پس‌زمینه */
function onColor(bg: string) {
  return luminance(bg) > 0.45 ? '#0f172a' : '#f8fafc'
}

function applyThemeColors(root: HTMLElement, c: TThemeColors) {
  const dark = isDarkTheme(c)
  const onInk = onColor(c.ink)
  const onPrimary = onColor(c.primary)
  const onAccent = onColor(c.accent)

  /**
   * باند کنتراست (فوتر، آمار، CTA تیره):
   * در تم روشن = همان ink تیره؛ در تم تیره = تیره‌تر از surface تا با متن روشن بخواند.
   */
  const band = dark
    ? (luminance(c.mistDeep) < luminance(c.surface)
        ? mixHex(c.mistDeep, '#000000', 0.45)
        : mixHex(c.surface, '#000000', 0.55))
    : c.ink
  const onBand = onColor(band)

  /** کارت/پنل روی صفحه — در تم تیره کمی روشن‌تر از surface */
  const panel = dark ? c.mist : '#ffffff'
  const onPanel = onColor(panel)

  const pairs: [string, string][] = [
    ['--color-green-deep', c.primary],
    ['--color-green-soft', c.primarySoft],
    ['--color-gold', c.accent],
    ['--color-surface', c.surface],
    ['--color-mist', c.mist],
    ['--color-mist-deep', c.mistDeep],
    ['--color-ink', c.ink],
    ['--color-ink-muted', c.inkMuted],
    ['--color-on-ink', onInk],
    ['--color-on-primary', onPrimary],
    ['--color-on-accent', onAccent],
    ['--color-band', band],
    ['--color-on-band', onBand],
    ['--color-panel', panel],
    ['--color-on-panel', onPanel],
    ['--theme-primary', c.primary],
    ['--theme-primary-soft', c.primarySoft],
    ['--theme-accent', c.accent],
    ['--theme-surface', c.surface],
    ['--theme-mist', c.mist],
    ['--theme-mist-deep', c.mistDeep],
    ['--theme-ink', c.ink],
    ['--theme-ink-muted', c.inkMuted],
    ['--theme-on-ink', onInk],
    ['--theme-on-primary', onPrimary],
    ['--theme-on-accent', onAccent],
    ['--theme-band', band],
    ['--theme-on-band', onBand],
    ['--theme-panel', panel],
    ['--theme-on-panel', onPanel],
  ]

  for (const [key, value] of pairs) {
    root.style.setProperty(key, value)
  }

  root.dataset.themeMode = dark ? 'darkish' : 'light'
  root.dataset.themeSlug = root.dataset.themeSlug || ''
  root.style.colorScheme = dark ? 'dark' : 'light'
  root.classList.toggle('dark', dark)
  root.classList.toggle('light', !dark)

  if (document.body) {
    document.body.style.backgroundColor = c.surface
    document.body.style.color = c.ink
  }
}

export function applyThemeCss(theme: TTheme | null) {
  if (!import.meta.client || !theme?.colors) return
  const root = document.documentElement

  root.classList.add('theme-switching')
  if (themeSwitchClear != null) cancelAnimationFrame(themeSwitchClear)

  applyThemeColors(root, theme.colors)
  root.dataset.themeSlug = theme.slug

  themeSwitchClear = requestAnimationFrame(() => {
    themeSwitchClear = requestAnimationFrame(() => {
      root.classList.remove('theme-switching')
      themeSwitchClear = null
    })
  })
}
