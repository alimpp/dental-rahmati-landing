import type { TPortfolioGalleryImage, TPortfolioItem } from '../types/index.type'

export class PortfolioItemModel implements TPortfolioItem {
  id: string
  title: string
  slug: string
  treatment: string
  patientAlias: string | null
  description: string
  coverImage: string | null
  beforeImage: string | null
  afterImage: string | null
  gallery: TPortfolioGalleryImage[]
  sort: number
  isActive: boolean
  createdAt: string | null
  updatedAt: string | null

  constructor(data?: Partial<TPortfolioItem>) {
    this.id = data?.id ?? ''
    this.title = data?.title?.trim() || ''
    this.slug = data?.slug?.trim() || ''
    this.treatment = data?.treatment?.trim() || ''
    this.patientAlias = data?.patientAlias?.trim() || null
    this.description = data?.description?.trim() || ''
    this.coverImage = data?.coverImage?.trim() || null
    this.beforeImage = data?.beforeImage?.trim() || null
    this.afterImage = data?.afterImage?.trim() || null
    this.gallery = Array.isArray(data?.gallery)
      ? data.gallery.filter(image => image?.url)
      : []
    this.sort = typeof data?.sort === 'number' ? data.sort : 0
    this.isActive = data?.isActive !== false
    this.createdAt = data?.createdAt ?? null
    this.updatedAt = data?.updatedAt ?? null
  }

  get href(): string {
    return `/portfolio/${this.slug}`
  }

  get isVisible(): boolean {
    return this.isActive && Boolean(this.title && this.slug && (this.hasBeforeAfter || this.gallery.length))
  }

  get cover(): string {
    return this.coverImage || this.afterImage || this.gallery[0]?.url || '/clinic/01-facade.jpg'
  }

  get imageCount(): number {
    const extras = [this.beforeImage, this.afterImage].filter(Boolean).length
    return this.gallery.length + extras
  }

  get hasBeforeAfter(): boolean {
    return Boolean(this.beforeImage && this.afterImage)
  }

  get displayPatient(): string {
    return this.patientAlias || 'بیمار کلینیک'
  }
}
