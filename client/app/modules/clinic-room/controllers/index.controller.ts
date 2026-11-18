import type { ServerResponse } from '~~/types/common'
import { BaseController } from '~/core/BaseController'
import type { ClinicRoomDS } from '../data/index.store'
import type { ClinicRoomApiService } from '../services/index.service'
import type { TClinicRoom } from '../types/index.type'

export class ClinicRoomController extends BaseController<ClinicRoomApiService> {
  constructor(
    service: ClinicRoomApiService,
    private readonly clinicRoomDS: ClinicRoomDS,
  ) {
    super(service)
  }

  private unwrapList(raw: unknown): TClinicRoom[] {
    if (Array.isArray(raw)) return raw as TClinicRoom[]
    if (raw && typeof raw === 'object' && Array.isArray((raw as { data: TClinicRoom[] }).data)) {
      return (raw as { data: TClinicRoom[] }).data
    }
    return []
  }

  public async getList(
    options: { force?: boolean } = {},
  ): Promise<ServerResponse<TClinicRoom[]>> {
    if (this.clinicRoomDS.getLoading && !options.force) {
      return {
        success: false,
        message: 'Request already in progress',
        data: this.clinicRoomDS.getItems,
      }
    }

    this.clinicRoomDS.setLoading(true)
    this.clinicRoomDS.setError(null)

    try {
      const response = await this.service.getList()
      const items = this.unwrapList(response.data)

      if (!response.success) {
        this.clinicRoomDS.setError(response.message || 'خطا در دریافت اطلاعات')
        return { success: false, message: response.message, data: items }
      }

      this.clinicRoomDS.setItems(items)
      return { success: true, message: '', data: items }
    }
    catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'خطا در دریافت اطلاعات'
      this.clinicRoomDS.setError(message)
      return { success: false, message, data: [] }
    }
    finally {
      this.clinicRoomDS.setLoading(false)
    }
  }
}
