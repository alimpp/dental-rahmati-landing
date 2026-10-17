import type { ServerResponse } from '~~/types/common'
import { BaseApp } from '~/core/BaseApp'
import type { TProcessStep } from '../types/index.type'

export class ProcessStepApiService extends BaseApp<TProcessStep & { id: string }> {
  constructor() {
    super('process-step')
  }

  public async getList(): Promise<ServerResponse<TProcessStep[]>> {
    return this.executeRequest<TProcessStep[]>(async () => {
      return await this.Get<TProcessStep[]>('/process-steps')
    }, false)
  }
}
