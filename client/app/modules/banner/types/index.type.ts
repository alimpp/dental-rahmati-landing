export interface TBanner {
  id: string
  image: string
  title: string
  subtitle: string | null
  description: string | null
  link: string | null
  sort: number
  button1Text: string | null
  button1Link: string | null
  button2Text: string | null
  button2Link: string | null
  isActive: boolean
  createdAt?: string | null
  updatedAt?: string | null
}

export interface TBannerListQuery {
  all?: boolean
}

export type TCreateBannerPayload = Omit<
  TBanner,
  'id' | 'createdAt' | 'updatedAt' | 'isActive'
> & {
  isActive?: boolean
}

export type TUpdateBannerPayload = Partial<TCreateBannerPayload>
