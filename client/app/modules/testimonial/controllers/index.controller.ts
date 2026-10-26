import type { ServerResponse } from '~~/types/common'
import { BaseController } from '~/core/BaseController'
import type { TestimonialDS } from '../data/index.store'
import type { TestimonialApiService } from '../services/index.service'
import type { TPublicTestimonialPayload, TTestimonial } from '../types/index.type'

export class TestimonialController extends BaseController<TestimonialApiService> {
  constructor(
    service: TestimonialApiService,
    private readonly testimonialDS: TestimonialDS,
  ) {
    super(service)
  }

  private unwrapList(raw: unknown): TTestimonial[] {
    if (Array.isArray(raw)) return raw as TTestimonial[]
    if (raw && typeof raw === 'object' && Array.isArray((raw as { data: TTestimonial[] }).data)) {
      return (raw as { data: TTestimonial[] }).data
    }
    return []
  }

  public async getList(
    options: { force?: boolean } = {},
  ): Promise<ServerResponse<TTestimonial[]>> {
    if (this.testimonialDS.getLoading && !options.force) {
      return {
        success: false,
        message: 'Request already in progress',
        data: this.testimonialDS.getItems,
      }
    }

    this.testimonialDS.setLoading(true)
    this.testimonialDS.setError(null)

    try {
      const response = await this.service.getList()
      const items = this.unwrapList(response.data)

      if (!response.success) {
        this.testimonialDS.setError(response.message || 'خطا در دریافت اطلاعات')
        return { success: false, message: response.message, data: items }
      }

      this.testimonialDS.setItems(items)
      return { success: true, message: '', data: items }
    }
    catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'خطا در دریافت اطلاعات'
      this.testimonialDS.setError(message)
      return { success: false, message, data: [] }
    }
    finally {
      this.testimonialDS.setLoading(false)
    }
  }

  public async submitPublic(
    payload: TPublicTestimonialPayload,
  ): Promise<ServerResponse<{ id: string }>> {
    return this.service.submitPublic(payload)
  }
}
