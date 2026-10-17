import type { TInquiry } from '../types/index.type'

export class InquiryModel implements TInquiry {
  id: string
  name: string
  phone: string
  email: string | null
  subject: string
  message: string
  source: string
  createdAt: string | null

  constructor(data?: Partial<TInquiry>) {
    this.id = data?.id ?? ''
    this.name = data?.name?.trim() || ''
    this.phone = data?.phone?.trim() || ''
    this.email = data?.email?.trim() || null
    this.subject = data?.subject?.trim() || ''
    this.message = data?.message?.trim() || ''
    this.source = data?.source?.trim() || 'home'
    this.createdAt = data?.createdAt ?? null
  }
}
