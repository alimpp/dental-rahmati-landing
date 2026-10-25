export interface TPortfolioGalleryImage {
  url: string
  caption?: string
}

export interface TPortfolioItem {
  id: string
  title: string
  slug: string
  treatment: string
  patientAlias: string | null
  description: string
  coverImage: string | null
  beforeImage: string | null
  afterImage: string | null
  gallery: TPortfolioGalleryImage[]
  sort: number
  isActive: boolean
  createdAt?: string | null
  updatedAt?: string | null
}
