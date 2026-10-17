export interface TFaq {
  id: string
  question: string
  answer: string
  sort: number
  isActive: boolean
  createdAt?: string | null
  updatedAt?: string | null
}
