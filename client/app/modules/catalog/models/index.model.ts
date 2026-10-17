import type { TCatalogGalleryImage, TCatalogItem, TCatalogPdf } from '../types/index.type'

const normalizeOrder = (value: unknown): number => {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value)
    if (Number.isFinite(parsed)) return parsed
  }
  return 0
}

export class CatalogItemModel implements TCatalogItem {
  id: string
  title: string
  slug: string
  excerpt: string
  paragraphs: string[]
  highlights: string[]
  coverImage: string
  gallery: TCatalogGalleryImage[]
  pdfs: TCatalogPdf[]
  sort: number
  isActive: boolean
  createdAt: string | null
  updatedAt: string | null

  constructor(data?: Partial<TCatalogItem>) {
    this.id = data?.id ?? ''
    this.title = data?.title?.trim() || ''
    this.slug = data?.slug?.trim() || ''
    this.excerpt = data?.excerpt?.trim() || ''
    this.paragraphs = Array.isArray(data?.paragraphs) ? data.paragraphs.filter(Boolean) : []
    this.highlights = Array.isArray(data?.highlights) ? data.highlights.filter(Boolean) : []
    this.coverImage = data?.coverImage?.trim() || '/banners/clinic-hero.jpg'
    this.gallery = Array.isArray(data?.gallery)
      ? data.gallery.filter((image) => image?.url)
      : []
    this.pdfs = Array.isArray(data?.pdfs)
      ? data.pdfs.filter((file) => file?.title && file?.url)
      : []
    this.sort = normalizeOrder(data?.sort)
    this.isActive = data?.isActive !== false
    this.createdAt = data?.createdAt ?? null
    this.updatedAt = data?.updatedAt ?? null
  }

  get href(): string {
    return `/catalog/${this.slug}`
  }

  get isVisible(): boolean {
    return this.isActive && Boolean(this.title && this.slug)
  }

  get readingMinutes(): number {
    const words = [...this.paragraphs, ...this.highlights, this.excerpt]
      .join(' ')
      .split(/\s+/)
      .filter(Boolean).length
    return Math.max(3, Math.round(words / 180))
  }

  get galleryCount(): number {
    return this.gallery.length
  }

  get displaySeoTitle(): string {
    return `${this.title} | کاتالوگ دندانپزشکی کرج`
  }

  get displaySeoDescription(): string {
    const base = this.excerpt.trim()
    if (base.length >= 110) return base.slice(0, 157).replace(/\s+\S*$/, '') + (base.length > 157 ? '…' : '')
    const extra = this.highlights.slice(0, 2).join(' · ')
    const combined = extra ? `${base} ${extra}` : base
    return combined.length > 160
      ? `${combined.slice(0, 157).replace(/\s+\S*$/, '')}…`
      : combined
  }

  get seoKeywords(): string {
    const parts = [
      this.title,
      'کاتالوگ دندانپزشکی کرج',
      'دندانپزشکی در کرج',
      'کلینیک امیر رحمتی جهانشهر',
      'ایمپلنت در کرج',
      'لمینت دندان کرج',
      ...this.highlights.slice(0, 4),
    ]
    return [...new Set(parts.map((part) => part.trim()).filter(Boolean))].join(', ')
  }

  get primaryImage(): string {
    return this.coverImage || this.gallery[0]?.url || '/banners/clinic-hero.jpg'
  }
}
