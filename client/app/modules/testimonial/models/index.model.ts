import type { TTestimonial } from '../types/index.type'

const normalizeOrder = (value: unknown): number => {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value)
    if (Number.isFinite(parsed)) return parsed
  }
  return 0
}

export class TestimonialModel implements TTestimonial {
  id: string
  quote: string
  clientName: string
  roleOrCompany: string | null
  avatarUrl: string | null
  rating: number | null
  sort: number
  isActive: boolean
  featured: boolean
  createdAt: string | null
  updatedAt: string | null

  constructor(data?: Partial<TTestimonial>) {
    this.id = data?.id ?? ''
    this.quote = data?.quote?.trim() || ''
    this.clientName = data?.clientName?.trim() || ''
    this.roleOrCompany = data?.roleOrCompany?.trim() || null
    this.avatarUrl = data?.avatarUrl?.trim() || null
    this.rating =
      typeof data?.rating === 'number' && Number.isFinite(data.rating)
        ? data.rating
        : null
    this.sort = normalizeOrder(data?.sort)
    this.isActive = data?.isActive !== false
    this.featured = data?.featured !== false
    this.createdAt = data?.createdAt ?? null
    this.updatedAt = data?.updatedAt ?? null
  }

  get nameParts(): string[] {
    return this.clientName.split(/\s+/).filter(Boolean)
  }

  get firstName(): string {
    return this.nameParts[0] || this.clientName
  }

  get lastName(): string {
    return this.nameParts.slice(1).join(' ')
  }

  get initials(): string {
    if (this.nameParts.length >= 2) {
      return `${this.nameParts[0]!.slice(0, 1)}${this.nameParts[1]!.slice(0, 1)}`
    }
    return this.clientName.slice(0, 2)
  }

  get isVisible(): boolean {
    return this.isActive && Boolean(this.clientName && this.quote)
  }

  get truncatedQuote(): string {
    const limit = 150
    const text = this.quote.trim()
    if (text.length <= limit) return text
    return `${text.slice(0, limit).trimEnd()}…`
  }

  get isQuoteLong(): boolean {
    return this.quote.trim().length > 150
  }
}
