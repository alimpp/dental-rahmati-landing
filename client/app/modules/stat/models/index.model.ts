import type { TStat } from '../types/index.type'

const normalizeOrder = (value: unknown): number => {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value)
    if (Number.isFinite(parsed)) return parsed
  }
  return 0
}

export class StatModel implements TStat {
  id: string
  value: string
  label: string
  icon: string | null
  sort: number
  isActive: boolean
  createdAt: string | null
  updatedAt: string | null

  constructor(data?: Partial<TStat>) {
    this.id = data?.id ?? ''
    this.value = data?.value?.trim() || ''
    this.label = data?.label?.trim() || ''
    this.icon = data?.icon?.trim() || null
    this.sort = normalizeOrder(data?.sort)
    this.isActive = data?.isActive !== false
    this.createdAt = data?.createdAt ?? null
    this.updatedAt = data?.updatedAt ?? null
  }

  get displayValue(): string {
    return this.value
  }

  get hasIcon(): boolean {
    return Boolean(this.icon)
  }

  get isVisible(): boolean {
    return this.isActive && Boolean(this.value && this.label)
  }
}
