import type { TService, TServiceSection } from '../types/index.type'

const normalizeOrder = (value: unknown): number => {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value)
    if (Number.isFinite(parsed)) return parsed
  }
  return 0
}

export class ServiceModel implements TService {
  id: string
  title: string
  slug: string
  description: string
  icon: string
  coverImage: string | null
  sections: TServiceSection[] | null
  casePathTitle: string | null
  casePathDescription: string | null
  requiredDocuments: string[] | null
  seoTitle: string | null
  seoDescription: string | null
  seoKeywords: string | null
  sort: number
  isActive: boolean
  createdAt: string | null
  updatedAt: string | null

  constructor(data?: Partial<TService>) {
    this.id = data?.id ?? ''
    this.title = data?.title?.trim() || ''
    this.slug = data?.slug?.trim() || ''
    this.description = data?.description?.trim() || ''
    this.icon = data?.icon?.trim() || ''
    this.coverImage = data?.coverImage?.trim() || null
    this.sections = Array.isArray(data?.sections) ? data.sections : null
    this.casePathTitle = data?.casePathTitle?.trim() || null
    this.casePathDescription = data?.casePathDescription?.trim() || null
    this.requiredDocuments = Array.isArray(data?.requiredDocuments)
      ? data.requiredDocuments
      : null
    this.seoTitle = data?.seoTitle?.trim() || null
    this.seoDescription = data?.seoDescription?.trim() || null
    this.seoKeywords = data?.seoKeywords?.trim() || null
    this.sort = normalizeOrder(data?.sort)
    this.isActive = data?.isActive !== false
    this.createdAt = data?.createdAt ?? null
    this.updatedAt = data?.updatedAt ?? null
  }

  get href(): string {
    return `/practice-areas/${this.slug}`
  }

  get displaySeoTitle(): string {
    return this.seoTitle || `${this.title} در کرج | کلینیک امیر رحمتی`
  }

  get displaySeoDescription(): string {
    return this.seoDescription || this.description
  }

  get hasCasePath(): boolean {
    return Boolean(this.casePathTitle || this.casePathDescription)
  }

  get hasDocuments(): boolean {
    return Boolean(this.requiredDocuments?.length)
  }

  get hasSections(): boolean {
    return Boolean(this.sections?.length)
  }

  get isVisible(): boolean {
    return this.isActive && Boolean(this.title && this.slug)
  }
}
