import type { TFaq } from '../types/index.type'

const normalizeOrder = (value: unknown): number => {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value)
    if (Number.isFinite(parsed)) return parsed
  }
  return 0
}

export class FaqModel implements TFaq {
  id: string
  question: string
  answer: string
  sort: number
  isActive: boolean
  createdAt: string | null
  updatedAt: string | null

  constructor(data?: Partial<TFaq>) {
    this.id = data?.id ?? ''
    this.question = data?.question?.trim() || ''
    this.answer = data?.answer?.trim() || ''
    this.sort = normalizeOrder(data?.sort)
    this.isActive = data?.isActive !== false
    this.createdAt = data?.createdAt ?? null
    this.updatedAt = data?.updatedAt ?? null
  }

  get isVisible(): boolean {
    return this.isActive && Boolean(this.question && this.answer)
  }
}
