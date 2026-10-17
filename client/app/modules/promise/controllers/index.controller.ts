import type { ServerResponse } from '~~/types/common'
import { BaseController } from '~/core/BaseController'
import type { PromiseDS } from '../data/index.store'
import type { PromiseApiService } from '../services/index.service'
import type { TPromise } from '../types/index.type'

export class PromiseController extends BaseController<PromiseApiService> {
  constructor(
    service: PromiseApiService,
    private readonly promiseDS: PromiseDS,
  ) {
    super(service)
  }

  private unwrapList(raw: unknown): TPromise[] {
    if (Array.isArray(raw)) return raw as TPromise[]
    if (raw && typeof raw === 'object' && Array.isArray((raw as { data: TPromise[] }).data)) {
      return (raw as { data: TPromise[] }).data
    }
    return []
  }

  public async getList(
    options: { force?: boolean } = {},
  ): Promise<ServerResponse<TPromise[]>> {
    if (this.promiseDS.getLoading && !options.force) {
      return {
        success: false,
        message: 'Request already in progress',
        data: this.promiseDS.getItems,
      }
    }

    this.promiseDS.setLoading(true)
    this.promiseDS.setError(null)

    try {
      const response = await this.service.getList()
      const items = this.unwrapList(response.data)

      if (!response.success) {
        this.promiseDS.setError(response.message || 'خطا در دریافت اطلاعات')
        return { success: false, message: response.message, data: items }
      }

      this.promiseDS.setItems(items)
      return { success: true, message: '', data: items }
    }
    catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'خطا در دریافت اطلاعات'
      this.promiseDS.setError(message)
      return { success: false, message, data: [] }
    }
    finally {
      this.promiseDS.setLoading(false)
    }
  }
}
