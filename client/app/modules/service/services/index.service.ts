import type { ServerResponse } from '~~/types/common'
import { BaseApp } from '~/core/BaseApp'
import type {
  TCreateServicePayload,
  TService,
  TServiceListQuery,
  TUpdateServicePayload,
} from '../types/index.type'

export class ServiceApiService extends BaseApp<TService & { id: string }> {
  constructor() {
    super('service')
  }

  public getCachedServices(): TService[] {
    try {
      const raw = this.getData() as unknown as TService[]
      return Array.isArray(raw) ? raw : []
    }
    catch {
      return []
    }
  }

  public upsertCachedService(item: TService): void {
    const cached = this.getCachedServices()
    const index = cached.findIndex((entry) => entry.id === item.id)
    if (index === -1) {
      this.saveData([item, ...cached])
      return
    }
    const next = [...cached]
    next[index] = item
    this.saveData(next)
  }

  public async getServiceList(
    query: TServiceListQuery = {},
  ): Promise<ServerResponse<TService[]>> {
    return this.executeRequest<TService[]>(async () => {
      const params: Record<string, string> = {}
      if (query.all) params.all = 'true'
      return await this.Get<TService[]>('/services', params)
    }, true)
  }

  public async getServiceById(id: string): Promise<ServerResponse<TService>> {
    return this.executeRequest<TService>(async () => {
      return await this.Get<TService>(`/services/${id}`)
    }, false)
  }

  public async getServiceBySlug(slug: string): Promise<ServerResponse<TService>> {
    return this.executeRequest<TService>(async () => {
      return await this.Get<TService>(`/services/slug/${slug}`)
    }, false)
  }

  public async createService(
    payload: TCreateServicePayload,
  ): Promise<ServerResponse<TService>> {
    return this.executeRequest<TService>(async () => {
      return await this.Post<TService>('/services', payload)
    }, false)
  }

  public async updateService(
    id: string,
    payload: TUpdateServicePayload,
  ): Promise<ServerResponse<TService>> {
    return this.executeRequest<TService>(async () => {
      return await this.Patch<TService>(`/services/${id}`, payload)
    }, false)
  }

  public async deleteService(id: string): Promise<ServerResponse<unknown>> {
    return this.executeRequest<unknown>(async () => {
      return await this.Delete<unknown>(`/services/${id}`)
    }, false)
  }
}
