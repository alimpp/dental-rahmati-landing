import type { TBanner } from '../types/index.type'

const normalizeOrder = (value: unknown): number => {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value)
    if (Number.isFinite(parsed)) return parsed
  }
  return 0
}

export class BannerModel implements TBanner {
  id: string
  image: string
  title: string
  subtitle: string | null
  description: string | null
  link: string | null
  sort: number
  button1Text: string | null
  button1Link: string | null
  button2Text: string | null
  button2Link: string | null
  isActive: boolean
  createdAt: string | null
  updatedAt: string | null

  constructor(data?: Partial<TBanner>) {
    this.id = data?.id ?? ''
    this.image = data?.image?.trim() || ''
    this.title = data?.title?.trim() || ''
    this.subtitle = data?.subtitle?.trim() || null
    this.description = data?.description?.trim() || null
    this.link = data?.link?.trim() || null
    this.sort = normalizeOrder(data?.sort)
    this.button1Text = data?.button1Text?.trim() || null
    this.button1Link = data?.button1Link?.trim() || null
    this.button2Text = data?.button2Text?.trim() || null
    this.button2Link = data?.button2Link?.trim() || null
    this.isActive = data?.isActive !== false
    this.createdAt = data?.createdAt ?? null
    this.updatedAt = data?.updatedAt ?? null
  }

  get displayTitle(): string {
    return this.title
  }

  get displaySubtitle(): string {
    return this.subtitle || ''
  }

  get displayDescription(): string {
    return this.description || ''
  }

  get hasButton1(): boolean {
    return Boolean(this.button1Text && this.button1Link)
  }

  get hasButton2(): boolean {
    return Boolean(this.button2Text && this.button2Link)
  }

  get isVisible(): boolean {
    return this.isActive && Boolean(this.image && this.title)
  }
}
