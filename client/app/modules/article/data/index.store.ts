import { BaseStore } from '~/core/BaseStore'
import { ModuleRegistry } from '~/core/ModuleRegistry'
import { ArticleModel } from '../models/index.model'
import type { TArticle, TArticleCategory, TArticlePage } from '../types/index.type'

interface ArticleState {
  loading: boolean
  items: ArticleModel[]
  featured: ArticleModel[]
  categories: TArticleCategory[]
  selectedItem: ArticleModel | null
  error: string | null
  page: number
  limit: number
  total: number
  pageCount: number
}

export class ArticleDS extends BaseStore<ArticleState> {
  private static _instance: ArticleDS

  public static create(): ArticleDS {
    if (!ArticleDS._instance) {
      ArticleDS._instance = new ArticleDS()
    }
    return ArticleDS._instance
  }

  public static getInstance(): ArticleDS {
    return ModuleRegistry.getInstance().get('article').store as ArticleDS
  }

  private constructor() {
    super('article', {
      loading: false,
      items: [],
      featured: [],
      categories: [],
      selectedItem: null,
      error: null,
      page: 1,
      limit: 9,
      total: 0,
      pageCount: 1,
    })
  }

  public get getItems(): ArticleModel[] {
    return this._state.items
  }

  public get getVisibleItems(): ArticleModel[] {
    return this._state.items.filter((item) => item.isVisible)
  }

  public get getFeatured(): ArticleModel[] {
    return this._state.featured.filter((item) => item.isVisible)
  }

  public get getCategories(): TArticleCategory[] {
    return this._state.categories
  }

  public get getLoading(): boolean {
    return this._state.loading
  }

  public get getError(): string | null {
    return this._state.error
  }

  public get getSelectedItem(): ArticleModel | null {
    return this._state.selectedItem
  }

  public get getPage(): number {
    return this._state.page
  }

  public get getPageCount(): number {
    return this._state.pageCount
  }

  public get getTotal(): number {
    return this._state.total
  }

  public setLoading(loading: boolean): void {
    this._state.loading = loading
  }

  public setError(error: string | null): void {
    this._state.error = error
  }

  public setPageResult(result: TArticlePage): void {
    this._state.items = result.items.map((item) => new ArticleModel(item))
    this._state.page = result.page
    this._state.limit = result.limit
    this._state.total = result.total
    this._state.pageCount = result.pageCount
    this._state.error = null
  }

  public setFeatured(items: TArticle[]): void {
    this._state.featured = items.map((item) => new ArticleModel(item))
  }

  public setCategories(categories: TArticleCategory[]): void {
    this._state.categories = categories.filter((entry) => Boolean(entry.category))
  }

  public setSelectedItem(item: TArticle | null): void {
    this._state.selectedItem = item ? new ArticleModel(item) : null
  }

  public reset(): void {
    this._state.loading = false
    this._state.items = []
    this._state.featured = []
    this._state.categories = []
    this._state.selectedItem = null
    this._state.error = null
    this._state.page = 1
    this._state.limit = 9
    this._state.total = 0
    this._state.pageCount = 1
  }
}
