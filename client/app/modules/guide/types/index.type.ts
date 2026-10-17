export interface TGuide {
  id: string
  title: string
  slug: string
  excerpt: string
  category: string | null
  coverImage: string
  paragraphs: string[]
  takeaways: string[]
  featured: boolean
  sort: number
  isActive: boolean
  createdAt?: string | null
  updatedAt?: string | null
}
