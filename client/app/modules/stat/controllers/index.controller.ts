import type { ServerResponse } from '~~/types/common'
import { BaseController } from '~/core/BaseController'
import type { StatDS } from '../data/index.store'
import type { StatApiService } from '../services/index.service'
import type { TStat } from '../types/index.type'

export class StatController extends BaseController<StatApiService> {
  constructor(
    service: StatApiService,
    private readonly statDS: StatDS,
  ) {
    super(service)
  }

  private unwrapList(raw: unknown): TStat[] {
    if (Array.isArray(raw)) return raw as TStat[]
    if (raw && typeof raw === 'object' && Array.isArray((raw as { data: TStat[] }).data)) {
      return (raw as { data: TStat[] }).data
    }
    return []
  }

  public async getList(
    options: { force?: boolean } = {},
  ): Promise<ServerResponse<TStat[]>> {
    if (this.statDS.getLoading && !options.force) {
      return {
        success: false,
        message: 'Request already in progress',
        data: this.statDS.getItems,
      }
    }

    this.statDS.setLoading(true)
    this.statDS.setError(null)

    try {
      const response = await this.service.getList()
      const items = this.unwrapList(response.data)

      if (!response.success) {
        this.statDS.setError(response.message || 'خطا در دریافت اطلاعات')
        return { success: false, message: response.message, data: items }
      }

      this.statDS.setItems(items)
      return { success: true, message: '', data: items }
    }
    catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'خطا در دریافت اطلاعات'
      this.statDS.setError(message)
      return { success: false, message, data: [] }
    }
    finally {
      this.statDS.setLoading(false)
    }
  }
}
