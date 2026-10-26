import type { ServerResponse } from '~~/types/common'
import { BaseApp } from '~/core/BaseApp'
import type { TPublicTestimonialPayload, TTestimonial } from '../types/index.type'

export class TestimonialApiService extends BaseApp<TTestimonial & { id: string }> {
  constructor() {
    super('testimonial')
  }

  public async getList(): Promise<ServerResponse<TTestimonial[]>> {
    return this.executeRequest<TTestimonial[]>(async () => {
      return await this.Get<TTestimonial[]>('/testimonials')
    }, false)
  }

  public async submitPublic(
    payload: TPublicTestimonialPayload,
  ): Promise<ServerResponse<{ id: string }>> {
    return this.executeRequest<{ id: string }>(async () => {
      return await this.Post<{ id: string }>('/testimonials/public', payload)
    }, false)
  }
}
