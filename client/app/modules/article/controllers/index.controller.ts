import type { ServerResponse } from '~~/types/common'
import { BaseController } from '~/core/BaseController'
import type { ArticleDS } from '../data/index.store'
import type { ArticleApiService } from '../services/index.service'
import type {
  TArticle,
  TArticleCategory,
  TArticleListQuery,
  TArticlePage,
} from '../types/index.type'

export class ArticleController extends BaseController<ArticleApiService> {
  constructor(
    service: ArticleApiService,
    private readonly articleDS: ArticleDS,
  ) {
    super(service)
  }

  private unwrapItem(raw: unknown): TArticle | null {
    if (raw && typeof raw === 'object' && (raw as TArticle).id) {
      return raw as TArticle
    }
    if (raw && typeof raw === 'object' && 'data' in raw) {
      const nested = (raw as { data: TArticle }).data
      if (nested && typeof nested === 'object' && nested.id) return nested
    }
    return null
  }

  private unwrapPage(raw: unknown): TArticlePage | null {
    if (!raw || typeof raw !== 'object') return null
    const candidate = raw as TArticlePage
    if (Array.isArray(candidate.items)) {
      return {
        items: candidate.items,
        total: candidate.total ?? candidate.items.length,
        page: candidate.page ?? 1,
        limit: candidate.limit ?? candidate.items.length,
        pageCount: candidate.pageCount ?? 1,
      }
    }
    return null
  }

  private unwrapCategories(raw: unknown): TArticleCategory[] {
    const list = Array.isArray(raw)
      ? raw
      : raw && typeof raw === 'object' && Array.isArray((raw as { data: unknown }).data)
        ? (raw as { data: TArticleCategory[] }).data
        : []

    return list
      .map((entry) => ({
        category: String((entry as TArticleCategory).category || '').trim(),
        count: Number((entry as TArticleCategory).count) || 0,
      }))
      .filter((entry) => Boolean(entry.category))
  }

  private unwrapList(raw: unknown): TArticle[] {
    if (Array.isArray(raw)) return raw as TArticle[]
    if (raw && typeof raw === 'object' && Array.isArray((raw as { data: TArticle[] }).data)) {
      return (raw as { data: TArticle[] }).data
    }
    return []
  }

  public async getArticleList(
    query: TArticleListQuery = {},
    options: { force?: boolean } = {},
  ): Promise<ServerResponse<TArticlePage>> {
    if (this.articleDS.getLoading && !options.force) {
      return {
        success: false,
        message: 'Article request already in progress',
        data: {
          items: [],
          total: 0,
          page: 1,
          limit: 9,
          pageCount: 1,
        },
      }
    }

    this.articleDS.setLoading(true)
    this.articleDS.setError(null)

    try {
      const response = await this.service.getArticlePage(query)
      const page = this.unwrapPage(response.data)

      if (!response.success || !page) {
        this.articleDS.setError(response.message || 'خطا در دریافت مقالات')
        return {
          success: false,
          message: response.message,
          data: page ?? {
            items: [],
            total: 0,
            page: 1,
            limit: 9,
            pageCount: 1,
          },
        }
      }

      this.articleDS.setPageResult(page)
      return {
        success: true,
        message: '',
        data: page,
      }
    }
    catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'خطا در دریافت مقالات'
      this.articleDS.setError(message)
      return {
        success: false,
        message,
        data: {
          items: [],
          total: 0,
          page: 1,
          limit: 9,
          pageCount: 1,
        },
      }
    }
    finally {
      this.articleDS.setLoading(false)
    }
  }

  public async getFeaturedArticles(limit = 4): Promise<ServerResponse<TArticle[]>> {
    this.articleDS.setLoading(true)
    this.articleDS.setError(null)

    try {
      const response = await this.service.getFeaturedArticles(limit)
      const items = this.unwrapList(response.data)

      if (!response.success) {
        this.articleDS.setError(response.message || 'خطا در دریافت مقالات')
        return {
          success: false,
          message: response.message,
          data: items,
        }
      }

      this.articleDS.setFeatured(items)
      return {
        success: true,
        message: '',
        data: items,
      }
    }
    catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'خطا در دریافت مقالات'
      this.articleDS.setError(message)
      return {
        success: false,
        message,
        data: [],
      }
    }
    finally {
      this.articleDS.setLoading(false)
    }
  }

  public async getArticleCategories(): Promise<ServerResponse<TArticleCategory[]>> {
    try {
      const response = await this.service.getArticleCategories()
      const items = this.unwrapCategories(response.data)

      if (!response.success) {
        return {
          success: false,
          message: response.message,
          data: items,
        }
      }

      this.articleDS.setCategories(items)
      return {
        success: true,
        message: '',
        data: items,
      }
    }
    catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'خطا در دریافت دسته‌بندی مقالات'
      return {
        success: false,
        message,
        data: [],
      }
    }
  }

  public async getArticleBySlug(slug: string): Promise<ServerResponse<TArticle>> {
    try {
      const response = await this.service.getArticleBySlug(slug)
      const item = this.unwrapItem(response.data)

      if (!response.success || !item) {
        return {
          success: false,
          message: response.message || 'مقاله یافت نشد',
          data: null as unknown as TArticle,
        }
      }

      this.articleDS.setSelectedItem(item)
      return {
        success: true,
        message: '',
        data: item,
      }
    }
    catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'مقاله یافت نشد'
      return {
        success: false,
        message,
        data: null as unknown as TArticle,
      }
    }
  }
}
