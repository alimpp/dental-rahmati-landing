export interface TTestimonial {
  id: string
  quote: string
  clientName: string
  roleOrCompany: string | null
  avatarUrl: string | null
  rating: number | null
  sort: number
  isActive: boolean
  featured: boolean
  createdAt?: string | null
  updatedAt?: string | null
}

export interface TPublicTestimonialPayload {
  firstName: string
  lastName: string
  quote: string
  rating: number
}
