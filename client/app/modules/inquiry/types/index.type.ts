import type { CreateInquiryInput } from '../schemas/inquiry.schema'

export interface TInquiry {
  id: string
  name: string
  phone: string
  email: string | null
  subject: string
  message: string
  source: string
  createdAt?: string | null
}

export type TCreateInquiryPayload = CreateInquiryInput
