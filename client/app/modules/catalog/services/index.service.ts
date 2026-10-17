import type { ServerResponse } from '~~/types/common'
import { BaseApp } from '~/core/BaseApp'
import type { TCatalogItem } from '../types/index.type'

export class CatalogApiService extends BaseApp<TCatalogItem & { id: string }> {
  constructor() {
    super('catalog')
  }

  public async getCatalogList(): Promise<ServerResponse<TCatalogItem[]>> {
    return this.executeRequest<TCatalogItem[]>(async () => {
      return await this.Get<TCatalogItem[]>('/catalog')
    }, false)
  }

  public async getCatalogBySlug(slug: string): Promise<ServerResponse<TCatalogItem>> {
    return this.executeRequest<TCatalogItem>(async () => {
      return await this.Get<TCatalogItem>(`/catalog/slug/${slug}`)
    }, false)
  }
}
