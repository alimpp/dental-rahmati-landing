import type { ServerResponse } from '~~/types/common'
import { BaseApp } from '~/core/BaseApp'
import type { TTestimonial } from '../types/index.type'

export class TestimonialApiService extends BaseApp<TTestimonial & { id: string }> {
  constructor() {
    super('testimonial')
  }

  public async getList(): Promise<ServerResponse<TTestimonial[]>> {
    return this.executeRequest<TTestimonial[]>(async () => {
      return await this.Get<TTestimonial[]>('/testimonials')
    }, false)
  }
}
