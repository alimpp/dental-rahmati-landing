import type { ServerResponse } from '~~/types/common'
import { BaseApp } from '~/core/BaseApp'
import type { TClinicRoom } from '../types/index.type'

export class ClinicRoomApiService extends BaseApp<TClinicRoom & { id: string }> {
  constructor() {
    super('clinic-room')
  }

  public async getList(): Promise<ServerResponse<TClinicRoom[]>> {
    return this.executeRequest<TClinicRoom[]>(async () => {
      return await this.Get<TClinicRoom[]>('/clinic-rooms')
    }, false)
  }
}
