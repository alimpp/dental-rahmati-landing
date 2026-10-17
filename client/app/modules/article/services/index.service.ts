import type { ServerResponse } from '~~/types/common'
import { BaseApp } from '~/core/BaseApp'
import type {
  TArticle,
  TArticleCategory,
  TArticleListQuery,
  TArticlePage,
} from '../types/index.type'

export class ArticleApiService extends BaseApp<TArticle & { id: string }> {
  constructor() {
    super('article')
  }

  public async getArticlePage(
    query: TArticleListQuery = {},
  ): Promise<ServerResponse<TArticlePage>> {
    return this.executeRequest<TArticlePage>(async () => {
      const params: Record<string, string> = {}
      if (query.page) params.page = String(query.page)
      if (query.limit) params.limit = String(query.limit)
      if (query.category) params.category = query.category
      return await this.Get<TArticlePage>('/articles', params)
    }, false)
  }

  public async getFeaturedArticles(
    limit = 4,
  ): Promise<ServerResponse<TArticle[]>> {
    return this.executeRequest<TArticle[]>(async () => {
      return await this.Get<TArticle[]>('/articles/featured', {
        limit: String(limit),
      })
    }, false)
  }

  public async getArticleCategories(): Promise<ServerResponse<TArticleCategory[]>> {
    return this.executeRequest<TArticleCategory[]>(async () => {
      return await this.Get<TArticleCategory[]>('/articles/categories')
    }, false)
  }

  public async getArticleBySlug(
    slug: string,
  ): Promise<ServerResponse<TArticle>> {
    return this.executeRequest<TArticle>(async () => {
      return await this.Get<TArticle>(`/articles/slug/${slug}`)
    }, false)
  }
}
