export type TArticleSectionType = 'text' | 'list' | 'image'

export interface TArticleSection {
  type: TArticleSectionType
  title?: string | null
  content?: string | null
  items?: string[] | null
  src?: string | null
  alt?: string | null
  caption?: string | null
}

export interface TArticle {
  id: string
  title: string
  slug: string
  excerpt: string
  category: string
  author: string
  coverImage: string
  sections: TArticleSection[] | null
  seoTitle: string | null
  seoDescription: string | null
  seoKeywords: string | null
  ogImage: string | null
  readingMinutes: number
  publishedAt: string | null
  featured: boolean
  sort: number
  isActive: boolean
  createdAt?: string | null
  updatedAt?: string | null
}

export interface TArticleCategory {
  category: string
  count: number
}

export interface TArticlePage {
  items: TArticle[]
  total: number
  page: number
  limit: number
  pageCount: number
}

export interface TArticleListQuery {
  page?: number
  limit?: number
  category?: string
}
