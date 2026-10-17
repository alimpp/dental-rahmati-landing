export interface TCatalogPdf {
  title: string
  url: string
}

export interface TCatalogGalleryImage {
  url: string
  caption?: string
}

export interface TCatalogItem {
  id: string
  title: string
  slug: string
  excerpt: string
  paragraphs: string[]
  highlights: string[]
  coverImage: string
  gallery: TCatalogGalleryImage[]
  pdfs: TCatalogPdf[]
  sort: number
  isActive: boolean
  createdAt?: string | null
  updatedAt?: string | null
}
