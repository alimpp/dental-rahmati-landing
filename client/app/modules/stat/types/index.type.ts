export interface TStat {
  id: string
  value: string
  label: string
  icon: string | null
  sort: number
  isActive: boolean
  createdAt?: string | null
  updatedAt?: string | null
}
