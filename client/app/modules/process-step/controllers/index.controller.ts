import type { ServerResponse } from '~~/types/common'
import { BaseController } from '~/core/BaseController'
import type { ProcessStepDS } from '../data/index.store'
import type { ProcessStepApiService } from '../services/index.service'
import type { TProcessStep } from '../types/index.type'

export class ProcessStepController extends BaseController<ProcessStepApiService> {
  constructor(
    service: ProcessStepApiService,
    private readonly processStepDS: ProcessStepDS,
  ) {
    super(service)
  }

  private unwrapList(raw: unknown): TProcessStep[] {
    if (Array.isArray(raw)) return raw as TProcessStep[]
    if (raw && typeof raw === 'object' && Array.isArray((raw as { data: TProcessStep[] }).data)) {
      return (raw as { data: TProcessStep[] }).data
    }
    return []
  }

  public async getList(
    options: { force?: boolean } = {},
  ): Promise<ServerResponse<TProcessStep[]>> {
    if (this.processStepDS.getLoading && !options.force) {
      return {
        success: false,
        message: 'Request already in progress',
        data: this.processStepDS.getItems,
      }
    }

    this.processStepDS.setLoading(true)
    this.processStepDS.setError(null)

    try {
      const response = await this.service.getList()
      const items = this.unwrapList(response.data)

      if (!response.success) {
        this.processStepDS.setError(response.message || 'خطا در دریافت اطلاعات')
        return { success: false, message: response.message, data: items }
      }

      this.processStepDS.setItems(items)
      return { success: true, message: '', data: items }
    }
    catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'خطا در دریافت اطلاعات'
      this.processStepDS.setError(message)
      return { success: false, message, data: [] }
    }
    finally {
      this.processStepDS.setLoading(false)
    }
  }
}
