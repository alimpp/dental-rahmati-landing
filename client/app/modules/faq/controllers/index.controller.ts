import type { ServerResponse } from '~~/types/common'
import { BaseController } from '~/core/BaseController'
import type { FaqDS } from '../data/index.store'
import type { FaqApiService } from '../services/index.service'
import type { TFaq } from '../types/index.type'

export class FaqController extends BaseController<FaqApiService> {
  constructor(
    service: FaqApiService,
    private readonly faqDS: FaqDS,
  ) {
    super(service)
  }

  private unwrapList(raw: unknown): TFaq[] {
    if (Array.isArray(raw)) return raw as TFaq[]
    if (raw && typeof raw === 'object' && Array.isArray((raw as { data: TFaq[] }).data)) {
      return (raw as { data: TFaq[] }).data
    }
    return []
  }

  public async getList(
    options: { force?: boolean } = {},
  ): Promise<ServerResponse<TFaq[]>> {
    if (this.faqDS.getLoading && !options.force) {
      return {
        success: false,
        message: 'Request already in progress',
        data: this.faqDS.getItems,
      }
    }

    this.faqDS.setLoading(true)
    this.faqDS.setError(null)

    try {
      const response = await this.service.getList()
      const items = this.unwrapList(response.data)

      if (!response.success) {
        this.faqDS.setError(response.message || 'خطا در دریافت اطلاعات')
        return { success: false, message: response.message, data: items }
      }

      this.faqDS.setItems(items)
      return { success: true, message: '', data: items }
    }
    catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'خطا در دریافت اطلاعات'
      this.faqDS.setError(message)
      return { success: false, message, data: [] }
    }
    finally {
      this.faqDS.setLoading(false)
    }
  }
}
