import type { ServerResponse } from '~~/types/common'
import { BaseApp } from '~/core/BaseApp'
import type { TStat } from '../types/index.type'

export class StatApiService extends BaseApp<TStat & { id: string }> {
  constructor() {
    super('stat')
  }

  public async getList(): Promise<ServerResponse<TStat[]>> {
    return this.executeRequest<TStat[]>(async () => {
      return await this.Get<TStat[]>('/stats')
    }, false)
  }
}
