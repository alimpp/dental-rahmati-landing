import type { ServerResponse } from '~~/types/common'
import { BaseController } from '~/core/BaseController'
import type { PortfolioDS } from '../data/index.store'
import type { PortfolioApiService } from '../services/index.service'
import type { TPortfolioItem } from '../types/index.type'

export class PortfolioController extends BaseController<PortfolioApiService> {
  constructor(
    service: PortfolioApiService,
    private readonly portfolioDS: PortfolioDS,
  ) {
    super(service)
  }

  private unwrapItem(raw: unknown): TPortfolioItem | null {
    if (raw && typeof raw === 'object' && (raw as TPortfolioItem).id) {
      return raw as TPortfolioItem
    }
    if (raw && typeof raw === 'object' && 'data' in raw) {
      const nested = (raw as { data: TPortfolioItem }).data
      if (nested && typeof nested === 'object' && nested.id) return nested
    }
    return null
  }

  private unwrapList(raw: unknown): TPortfolioItem[] {
    if (Array.isArray(raw)) return raw as TPortfolioItem[]
    if (raw && typeof raw === 'object' && Array.isArray((raw as { data: TPortfolioItem[] }).data)) {
      return (raw as { data: TPortfolioItem[] }).data
    }
    return []
  }

  public async getPortfolioList(
    options: { force?: boolean } = {},
  ): Promise<ServerResponse<TPortfolioItem[]>> {
    if (this.portfolioDS.getLoading && !options.force) {
      return {
        success: false,
        message: 'Portfolio request already in progress',
        data: this.portfolioDS.getItems,
      }
    }

    this.portfolioDS.setLoading(true)
    this.portfolioDS.setError(null)

    try {
      const response = await this.service.getPortfolioList()
      const items = this.unwrapList(response.data)

      if (!response.success) {
        this.portfolioDS.setError(response.message || 'خطا در دریافت نمونه کارها')
        return { success: false, message: response.message, data: items }
      }

      this.portfolioDS.setItems(items)
      return { success: true, message: '', data: items }
    }
    catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'خطا در دریافت نمونه کارها'
      this.portfolioDS.setError(message)
      return { success: false, message, data: [] }
    }
    finally {
      this.portfolioDS.setLoading(false)
    }
  }

  public async getPortfolioBySlug(slug: string): Promise<ServerResponse<TPortfolioItem>> {
    try {
      const response = await this.service.getPortfolioBySlug(slug)
      const item = this.unwrapItem(response.data)

      if (!response.success || !item) {
        return {
          success: false,
          message: response.message || 'نمونه کار یافت نشد',
          data: null as unknown as TPortfolioItem,
        }
      }

      this.portfolioDS.setSelectedItem(item)
      return { success: true, message: '', data: item }
    }
    catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'نمونه کار یافت نشد'
      return { success: false, message, data: null as unknown as TPortfolioItem }
    }
  }
}
