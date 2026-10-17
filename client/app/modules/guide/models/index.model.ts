import type { TGuide } from '../types/index.type'

const normalizeOrder = (value: unknown): number => {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value)
    if (Number.isFinite(parsed)) return parsed
  }
  return 0
}

export class GuideModel implements TGuide {
  id: string
  title: string
  slug: string
  excerpt: string
  category: string | null
  coverImage: string
  paragraphs: string[]
  takeaways: string[]
  featured: boolean
  sort: number
  isActive: boolean
  createdAt: string | null
  updatedAt: string | null

  constructor(data?: Partial<TGuide>) {
    this.id = data?.id ?? ''
    this.title = data?.title?.trim() || ''
    this.slug = data?.slug?.trim() || ''
    this.excerpt = data?.excerpt?.trim() || ''
    this.category = data?.category?.trim() || null
    this.coverImage = data?.coverImage?.trim() || '/banners/clinic-hero.jpg'
    this.paragraphs = Array.isArray(data?.paragraphs)
      ? data.paragraphs.map((item) => String(item).trim()).filter(Boolean)
      : []
    this.takeaways = Array.isArray(data?.takeaways)
      ? data.takeaways.map((item) => String(item).trim()).filter(Boolean)
      : []
    this.featured = Boolean(data?.featured)
    this.sort = normalizeOrder(data?.sort)
    this.isActive = data?.isActive !== false
    this.createdAt = data?.createdAt ?? null
    this.updatedAt = data?.updatedAt ?? null
  }

  get href(): string {
    return `/guides/${this.slug}`
  }

  get isVisible(): boolean {
    return this.isActive && Boolean(this.title && this.slug && this.excerpt)
  }

  get readingMinutes(): number {
    const words = [...this.paragraphs, this.excerpt]
      .join(' ')
      .split(/\s+/)
      .filter(Boolean).length
    return Math.max(2, Math.ceil(words / 180))
  }
}
