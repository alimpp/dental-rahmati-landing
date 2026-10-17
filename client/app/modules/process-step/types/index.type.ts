export interface TProcessStep {
  id: string
  title: string
  description: string
  sort: number
  isActive: boolean
  createdAt?: string | null
  updatedAt?: string | null
}
