import type { ServerResponse } from '~~/types/common'
import { BaseController } from '~/core/BaseController'
import type { CatalogDS } from '../data/index.store'
import type { CatalogApiService } from '../services/index.service'
import type { TCatalogItem } from '../types/index.type'

export class CatalogController extends BaseController<CatalogApiService> {
  constructor(
    service: CatalogApiService,
    private readonly catalogDS: CatalogDS,
  ) {
    super(service)
  }

  private unwrapItem(raw: unknown): TCatalogItem | null {
    if (raw && typeof raw === 'object' && (raw as TCatalogItem).id) {
      return raw as TCatalogItem
    }
    if (raw && typeof raw === 'object' && 'data' in raw) {
      const nested = (raw as { data: TCatalogItem }).data
      if (nested && typeof nested === 'object' && nested.id) return nested
    }
    return null
  }

  private unwrapList(raw: unknown): TCatalogItem[] {
    if (Array.isArray(raw)) return raw as TCatalogItem[]
    if (raw && typeof raw === 'object' && Array.isArray((raw as { data: TCatalogItem[] }).data)) {
      return (raw as { data: TCatalogItem[] }).data
    }
    return []
  }

  public async getCatalogList(
    options: { force?: boolean } = {},
  ): Promise<ServerResponse<TCatalogItem[]>> {
    if (this.catalogDS.getLoading && !options.force) {
      return {
        success: false,
        message: 'Catalog request already in progress',
        data: this.catalogDS.getItems,
      }
    }

    this.catalogDS.setLoading(true)
    this.catalogDS.setError(null)

    try {
      const response = await this.service.getCatalogList()
      const items = this.unwrapList(response.data)

      if (!response.success) {
        this.catalogDS.setError(response.message || 'خطا در دریافت کاتالوگ')
        return { success: false, message: response.message, data: items }
      }

      this.catalogDS.setItems(items)
      return { success: true, message: '', data: items }
    }
    catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'خطا در دریافت کاتالوگ'
      this.catalogDS.setError(message)
      return { success: false, message, data: [] }
    }
    finally {
      this.catalogDS.setLoading(false)
    }
  }

  public async getCatalogBySlug(slug: string): Promise<ServerResponse<TCatalogItem>> {
    try {
      const response = await this.service.getCatalogBySlug(slug)
      const item = this.unwrapItem(response.data)

      if (!response.success || !item) {
        return {
          success: false,
          message: response.message || 'آیتم کاتالوگ یافت نشد',
          data: null as unknown as TCatalogItem,
        }
      }

      this.catalogDS.setSelectedItem(item)
      return { success: true, message: '', data: item }
    }
    catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'آیتم کاتالوگ یافت نشد'
      return { success: false, message, data: null as unknown as TCatalogItem }
    }
  }
}
