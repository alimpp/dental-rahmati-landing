export type TServiceSectionType = 'text' | 'list'

export interface TServiceSection {
  type: TServiceSectionType
  title?: string | null
  content?: string | null
  items?: string[] | null
}

export interface TService {
  id: string
  title: string
  slug: string
  description: string
  icon: string
  coverImage: string | null
  sections: TServiceSection[] | null
  casePathTitle: string | null
  casePathDescription: string | null
  requiredDocuments: string[] | null
  seoTitle: string | null
  seoDescription: string | null
  seoKeywords: string | null
  sort: number
  isActive: boolean
  createdAt?: string | null
  updatedAt?: string | null
}

export interface TServiceListQuery {
  all?: boolean
}

export type TCreateServicePayload = Omit<
  TService,
  'id' | 'createdAt' | 'updatedAt' | 'isActive'
> & {
  isActive?: boolean
}

export type TUpdateServicePayload = Partial<TCreateServicePayload>
