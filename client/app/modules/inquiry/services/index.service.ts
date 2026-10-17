import type { ServerResponse } from '~~/types/common'
import { BaseApp } from '~/core/BaseApp'
import type { TCreateInquiryPayload, TInquiry } from '../types/index.type'

export class InquiryApiService extends BaseApp<TInquiry & { id: string }> {
  constructor() {
    super('inquiry')
  }

  public async createInquiry(
    payload: TCreateInquiryPayload,
  ): Promise<ServerResponse<TInquiry>> {
    return this.executeRequest<TInquiry>(async () => {
      return await this.Post<TInquiry>('/inquiries', payload)
    }, false)
  }
}
