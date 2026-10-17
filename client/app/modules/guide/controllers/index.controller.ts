import type { ServerResponse } from '~~/types/common'
import { BaseController } from '~/core/BaseController'
import type { GuideDS } from '../data/index.store'
import type { GuideApiService } from '../services/index.service'
import type { TGuide } from '../types/index.type'

export class GuideController extends BaseController<GuideApiService> {
  constructor(
    service: GuideApiService,
    private readonly guideDS: GuideDS,
  ) {
    super(service)
  }

  private unwrapList(raw: unknown): TGuide[] {
    if (Array.isArray(raw)) return raw as TGuide[]
    if (raw && typeof raw === 'object' && Array.isArray((raw as { data: TGuide[] }).data)) {
      return (raw as { data: TGuide[] }).data
    }
    return []
  }

  private unwrapOne(raw: unknown): TGuide | null {
    if (!raw || typeof raw !== 'object') return null
    if ('id' in (raw as object) && 'slug' in (raw as object)) return raw as TGuide
    if ('data' in (raw as object)) return (raw as { data: TGuide }).data ?? null
    return null
  }

  public async getList(
    options: { force?: boolean } = {},
  ): Promise<ServerResponse<TGuide[]>> {
    if (this.guideDS.getLoading && !options.force) {
      return {
        success: false,
        message: 'Request already in progress',
        data: this.guideDS.getItems,
      }
    }

    this.guideDS.setLoading(true)
    this.guideDS.setError(null)

    try {
      const response = await this.service.getList()
      const items = this.unwrapList(response.data)
      if (!response.success) {
        this.guideDS.setError(response.message || 'خطا در دریافت راهنماها')
        return { success: false, message: response.message, data: items }
      }
      this.guideDS.setItems(items)
      return { success: true, message: '', data: items }
    }
    catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'خطا در دریافت راهنماها'
      this.guideDS.setError(message)
      return { success: false, message, data: [] }
    }
    finally {
      this.guideDS.setLoading(false)
    }
  }

  public async getBySlug(slug: string): Promise<ServerResponse<TGuide | null>> {
    this.guideDS.setLoading(true)
    this.guideDS.setError(null)
    try {
      const response = await this.service.getBySlug(slug)
      const item = this.unwrapOne(response.data)
      if (!response.success || !item) {
        this.guideDS.setSelected(null)
        this.guideDS.setError(response.message || 'راهنما یافت نشد')
        return { success: false, message: response.message, data: null }
      }
      this.guideDS.setSelected(item)
      return { success: true, message: '', data: item }
    }
    catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'راهنما یافت نشد'
      this.guideDS.setSelected(null)
      this.guideDS.setError(message)
      return { success: false, message, data: null }
    }
    finally {
      this.guideDS.setLoading(false)
    }
  }
}
