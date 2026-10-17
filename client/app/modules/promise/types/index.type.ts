export interface TPromise {
  id: string
  title: string
  description: string
  sort: number
  isActive: boolean
  createdAt?: string | null
  updatedAt?: string | null
}
