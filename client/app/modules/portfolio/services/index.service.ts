import type { ServerResponse } from '~~/types/common'
import { BaseApp } from '~/core/BaseApp'
import type { TPortfolioItem } from '../types/index.type'

export class PortfolioApiService extends BaseApp<TPortfolioItem & { id: string }> {
  constructor() {
    super('portfolio')
  }

  public async getPortfolioList(): Promise<ServerResponse<TPortfolioItem[]>> {
    return this.executeRequest<TPortfolioItem[]>(async () => {
      return await this.Get<TPortfolioItem[]>('/portfolio')
    }, false)
  }

  public async getPortfolioBySlug(slug: string): Promise<ServerResponse<TPortfolioItem>> {
    return this.executeRequest<TPortfolioItem>(async () => {
      return await this.Get<TPortfolioItem>(`/portfolio/slug/${slug}`)
    }, false)
  }
}
