import type { ServerResponse } from '~~/types/common'
import { BaseApp } from '~/core/BaseApp'
import type {
  TBanner,
  TBannerListQuery,
  TCreateBannerPayload,
  TUpdateBannerPayload,
} from '../types/index.type'

export class BannerService extends BaseApp<TBanner & { id: string }> {
  constructor() {
    super('banner')
  }

  public getCachedBanners(): TBanner[] {
    try {
      const raw = this.getData() as unknown as TBanner[]
      return Array.isArray(raw) ? raw : []
    }
    catch {
      return []
    }
  }

  public upsertCachedBanner(item: TBanner): void {
    const cached = this.getCachedBanners()
    const index = cached.findIndex((entry) => entry.id === item.id)
    if (index === -1) {
      this.saveData([item, ...cached])
      return
    }
    const next = [...cached]
    next[index] = item
    this.saveData(next)
  }

  public async getBannerList(
    query: TBannerListQuery = {},
  ): Promise<ServerResponse<TBanner[]>> {
    return this.executeRequest<TBanner[]>(async () => {
      const params: Record<string, string> = {}
      if (query.all) params.all = 'true'
      return await this.Get<TBanner[]>('/banners', params)
    }, true)
  }

  public async getBannerById(id: string): Promise<ServerResponse<TBanner>> {
    return this.executeRequest<TBanner>(async () => {
      return await this.Get<TBanner>(`/banners/${id}`)
    }, false)
  }

  public async createBanner(
    payload: TCreateBannerPayload,
  ): Promise<ServerResponse<TBanner>> {
    return this.executeRequest<TBanner>(async () => {
      return await this.Post<TBanner>('/banners', payload)
    }, false)
  }

  public async updateBanner(
    id: string,
    payload: TUpdateBannerPayload,
  ): Promise<ServerResponse<TBanner>> {
    return this.executeRequest<TBanner>(async () => {
      return await this.Patch<TBanner>(`/banners/${id}`, payload)
    }, false)
  }

  public async deleteBanner(id: string): Promise<ServerResponse<unknown>> {
    return this.executeRequest<unknown>(async () => {
      return await this.Delete<unknown>(`/banners/${id}`)
    }, false)
  }
}
