export interface TClinicRoom {
  id: string
  eyebrow: string
  title: string
  description: string
  image: string
  sort: number
  isActive: boolean
  createdAt?: string | null
  updatedAt?: string | null
}

export type TCreateClinicRoomPayload = Omit<
  TClinicRoom,
  'id' | 'createdAt' | 'updatedAt' | 'isActive'
> & {
  isActive?: boolean
}

export type TUpdateClinicRoomPayload = Partial<TCreateClinicRoomPayload>
