import type { ServerResponse } from '~~/types/common'
import { BaseController } from '~/core/BaseController'
import type { ServiceDS } from '../data/index.store'
import type { ServiceApiService } from '../services/index.service'
import type {
  TCreateServicePayload,
  TService,
  TServiceListQuery,
  TUpdateServicePayload,
} from '../types/index.type'

export class ServiceController extends BaseController<ServiceApiService> {
  constructor(
    service: ServiceApiService,
    private readonly serviceDS: ServiceDS,
  ) {
    super(service)
  }

  private normalizeList<T>(raw: unknown): T[] {
    if (Array.isArray(raw)) return raw as T[]
    if (raw && typeof raw === 'object' && Array.isArray((raw as ServerResponse<T[]>).data)) {
      return (raw as ServerResponse<T[]>).data
    }
    return []
  }

  private unwrapItem(raw: unknown): TService | null {
    if (raw && typeof raw === 'object' && (raw as TService).id) {
      return raw as TService
    }
    if (raw && typeof raw === 'object' && 'data' in raw) {
      const nested = (raw as { data: TService }).data
      if (nested && typeof nested === 'object' && nested.id) return nested
    }
    return null
  }

  public async getServiceList(
    query: TServiceListQuery = {},
    options: { force?: boolean; skipCache?: boolean } = {},
  ): Promise<ServerResponse<TService[]>> {
    if (this.serviceDS.getLoading && !options.force) {
      return {
        success: false,
        message: 'Service request already in progress',
        data: [],
      }
    }

    if (!options.skipCache) {
      const cached = this.service.getCachedServices()
      if (cached.length) this.serviceDS.setItems(cached)
    }

    this.serviceDS.setLoading(true)
    this.serviceDS.setError(null)

    try {
      const response = await this.service.getServiceList(query)
      const items = this.normalizeList<TService>(response.data)

      if (!response.success) {
        this.serviceDS.setError(response.message || 'خطا در دریافت خدمات')
        return {
          success: false,
          message: response.message,
          data: items,
        }
      }

      this.serviceDS.setItems(items)
      return {
        success: true,
        message: '',
        data: items,
      }
    }
    catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'خطا در دریافت خدمات'
      this.serviceDS.setError(message)
      return {
        success: false,
        message,
        data: [],
      }
    }
    finally {
      this.serviceDS.setLoading(false)
    }
  }

  public async getServiceBySlug(slug: string): Promise<ServerResponse<TService>> {
    try {
      const response = await this.service.getServiceBySlug(slug)
      const item = this.unwrapItem(response.data)

      if (!response.success || !item) {
        return {
          success: false,
          message: response.message || 'خدمت یافت نشد',
          data: null as unknown as TService,
        }
      }

      this.serviceDS.setSelectedItem(item)
      this.serviceDS.upsertItem(item)
      this.service.upsertCachedService(item)

      return {
        success: true,
        message: '',
        data: item,
      }
    }
    catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'خدمت یافت نشد'
      return {
        success: false,
        message,
        data: null as unknown as TService,
      }
    }
  }

  public async getServiceById(id: string): Promise<ServerResponse<TService>> {
    try {
      const response = await this.service.getServiceById(id)
      const item = this.unwrapItem(response.data)

      if (!response.success || !item) {
        return {
          success: false,
          message: response.message || 'خدمت یافت نشد',
          data: null as unknown as TService,
        }
      }

      this.serviceDS.setSelectedItem(item)
      this.serviceDS.upsertItem(item)
      this.service.upsertCachedService(item)

      return {
        success: true,
        message: '',
        data: item,
      }
    }
    catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'خدمت یافت نشد'
      return {
        success: false,
        message,
        data: null as unknown as TService,
      }
    }
  }

  public async createService(
    payload: TCreateServicePayload,
  ): Promise<ServerResponse<TService>> {
    const response = await this.service.createService(payload)
    if (!response.success) {
      return {
        success: false,
        message: response.message,
        data: null as unknown as TService,
      }
    }

    const item = this.unwrapItem(response.data)
    if (item) {
      this.serviceDS.upsertItem(item)
      this.service.upsertCachedService(item)
    }

    return {
      success: true,
      message: '',
      data: item ?? (null as unknown as TService),
    }
  }

  public async updateService(
    id: string,
    payload: TUpdateServicePayload,
  ): Promise<ServerResponse<TService>> {
    const response = await this.service.updateService(id, payload)
    if (!response.success) {
      return {
        success: false,
        message: response.message,
        data: null as unknown as TService,
      }
    }

    const item = this.unwrapItem(response.data)
    if (item) {
      this.serviceDS.upsertItem(item)
      this.service.upsertCachedService(item)
    }

    return {
      success: true,
      message: '',
      data: item ?? (null as unknown as TService),
    }
  }

  public async deleteService(id: string): Promise<ServerResponse<unknown>> {
    const response = await this.service.deleteService(id)
    if (response.success) this.serviceDS.removeItem(id)
    return response
  }
}
