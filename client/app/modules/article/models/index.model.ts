import type { TArticle, TArticleSection } from '../types/index.type'

const normalizeOrder = (value: unknown): number => {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value)
    if (Number.isFinite(parsed)) return parsed
  }
  return 0
}

export class ArticleModel implements TArticle {
  id: string
  title: string
  slug: string
  excerpt: string
  category: string
  author: string
  coverImage: string
  sections: TArticleSection[] | null
  seoTitle: string | null
  seoDescription: string | null
  seoKeywords: string | null
  ogImage: string | null
  readingMinutes: number
  publishedAt: string | null
  featured: boolean
  sort: number
  isActive: boolean
  createdAt: string | null
  updatedAt: string | null

  constructor(data?: Partial<TArticle>) {
    this.id = data?.id ?? ''
    this.title = data?.title?.trim() || ''
    this.slug = data?.slug?.trim() || ''
    this.excerpt = data?.excerpt?.trim() || ''
    this.category = data?.category?.trim() || ''
    this.author = data?.author?.trim() || 'تیم کلینیک امیر رحمتی'
    this.coverImage = data?.coverImage?.trim() || '/services/hero.jpg'
    this.sections = Array.isArray(data?.sections) ? data.sections : null
    this.seoTitle = data?.seoTitle?.trim() || null
    this.seoDescription = data?.seoDescription?.trim() || null
    this.seoKeywords = data?.seoKeywords?.trim() || null
    this.ogImage = data?.ogImage?.trim() || this.coverImage
    this.readingMinutes = normalizeOrder(data?.readingMinutes) || 6
    this.publishedAt = data?.publishedAt ?? null
    this.featured = Boolean(data?.featured)
    this.sort = normalizeOrder(data?.sort)
    this.isActive = data?.isActive !== false
    this.createdAt = data?.createdAt ?? null
    this.updatedAt = data?.updatedAt ?? null
  }

  get href(): string {
    return `/articles/${this.slug}`
  }

  get displaySeoTitle(): string {
    return this.seoTitle || `${this.title} | مقالات دندانپزشکی کرج`
  }

  get displaySeoDescription(): string {
    return this.seoDescription || this.excerpt
  }

  get displayDate(): string {
    if (!this.publishedAt) return ''
    const date = new Date(this.publishedAt)
    if (Number.isNaN(date.getTime())) return ''
    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date)
  }

  get hasSections(): boolean {
    return Boolean(this.sections?.length)
  }

  get isVisible(): boolean {
    return this.isActive && Boolean(this.title && this.slug)
  }
}
