import type { ServerResponse } from '~~/types/common'
import { BaseController } from '~/core/BaseController'
import type { BannerDS } from '../data/index.store'
import type { BannerService } from '../services/index.service'
import type {
  TBanner,
  TBannerListQuery,
  TCreateBannerPayload,
  TUpdateBannerPayload,
} from '../types/index.type'

export class BannerController extends BaseController<BannerService> {
  constructor(
    service: BannerService,
    private readonly bannerDS: BannerDS,
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

  private unwrapItem(raw: unknown): TBanner | null {
    if (raw && typeof raw === 'object' && (raw as TBanner).id) {
      return raw as TBanner
    }
    if (raw && typeof raw === 'object' && 'data' in raw) {
      const nested = (raw as { data: TBanner }).data
      if (nested && typeof nested === 'object' && nested.id) return nested
    }
    return null
  }

  public async getBannerList(
    query: TBannerListQuery = {},
    options: { force?: boolean; skipCache?: boolean } = {},
  ): Promise<ServerResponse<TBanner[]>> {
    if (this.bannerDS.getLoading && !options.force) {
      return {
        success: false,
        message: 'Banner request already in progress',
        data: [],
      }
    }

    if (!options.skipCache) {
      const cached = this.service.getCachedBanners()
      if (cached.length) this.bannerDS.setItems(cached)
    }

    this.bannerDS.setLoading(true)
    this.bannerDS.setError(null)

    try {
      const response = await this.service.getBannerList(query)
      const items = this.normalizeList<TBanner>(response.data)

      if (!response.success) {
        this.bannerDS.setError(response.message || 'خطا در دریافت بنرها')
        return {
          success: false,
          message: response.message,
          data: items,
        }
      }

      this.bannerDS.setItems(items)
      return {
        success: true,
        message: '',
        data: items,
      }
    }
    catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'خطا در دریافت بنرها'
      this.bannerDS.setError(message)
      return {
        success: false,
        message,
        data: [],
      }
    }
    finally {
      this.bannerDS.setLoading(false)
    }
  }

  public async getBannerById(id: string): Promise<ServerResponse<TBanner>> {
    try {
      const response = await this.service.getBannerById(id)
      const item = this.unwrapItem(response.data)

      if (!response.success || !item) {
        return {
          success: false,
          message: response.message || 'بنر یافت نشد',
          data: null as unknown as TBanner,
        }
      }

      this.bannerDS.setSelectedItem(item)
      this.bannerDS.upsertItem(item)
      this.service.upsertCachedBanner(item)

      return {
        success: true,
        message: '',
        data: item,
      }
    }
    catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'بنر یافت نشد'
      return {
        success: false,
        message,
        data: null as unknown as TBanner,
      }
    }
  }

  public async createBanner(
    payload: TCreateBannerPayload,
  ): Promise<ServerResponse<TBanner>> {
    const response = await this.service.createBanner(payload)
    if (!response.success) {
      return {
        success: false,
        message: response.message,
        data: null as unknown as TBanner,
      }
    }

    const item = this.unwrapItem(response.data)
    if (item) {
      this.bannerDS.upsertItem(item)
      this.service.upsertCachedBanner(item)
    }

    return {
      success: true,
      message: '',
      data: item ?? (null as unknown as TBanner),
    }
  }

  public async updateBanner(
    id: string,
    payload: TUpdateBannerPayload,
  ): Promise<ServerResponse<TBanner>> {
    const response = await this.service.updateBanner(id, payload)
    if (!response.success) {
      return {
        success: false,
        message: response.message,
        data: null as unknown as TBanner,
      }
    }

    const item = this.unwrapItem(response.data)
    if (item) {
      this.bannerDS.upsertItem(item)
      this.service.upsertCachedBanner(item)
    }

    return {
      success: true,
      message: '',
      data: item ?? (null as unknown as TBanner),
    }
  }

  public async deleteBanner(id: string): Promise<ServerResponse<unknown>> {
    const response = await this.service.deleteBanner(id)
    if (response.success) this.bannerDS.removeItem(id)
    return response
  }
}
