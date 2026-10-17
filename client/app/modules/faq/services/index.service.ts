import type { ServerResponse } from '~~/types/common'
import { BaseApp } from '~/core/BaseApp'
import type { TFaq } from '../types/index.type'

export class FaqApiService extends BaseApp<TFaq & { id: string }> {
  constructor() {
    super('faq')
  }

  public async getList(): Promise<ServerResponse<TFaq[]>> {
    return this.executeRequest<TFaq[]>(async () => {
      return await this.Get<TFaq[]>('/faqs')
    }, false)
  }
}
