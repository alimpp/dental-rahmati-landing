import type { ServerResponse } from '~~/types/common'
import { BaseApp } from '~/core/BaseApp'
import type { TPromise } from '../types/index.type'

export class PromiseApiService extends BaseApp<TPromise & { id: string }> {
  constructor() {
    super('promise')
  }

  public async getList(): Promise<ServerResponse<TPromise[]>> {
    return this.executeRequest<TPromise[]>(async () => {
      return await this.Get<TPromise[]>('/promises')
    }, false)
  }
}
