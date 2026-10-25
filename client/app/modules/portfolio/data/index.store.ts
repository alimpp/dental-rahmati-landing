import { BaseStore } from '~/core/BaseStore'
import { ModuleRegistry } from '~/core/ModuleRegistry'
import { PortfolioItemModel } from '../models/index.model'
import type { TPortfolioItem } from '../types/index.type'

interface PortfolioState {
  loading: boolean
  items: PortfolioItemModel[]
  selectedItem: PortfolioItemModel | null
  error: string | null
}

export class PortfolioDS extends BaseStore<PortfolioState> {
  private static _instance: PortfolioDS

  public static create(): PortfolioDS {
    if (!PortfolioDS._instance) {
      PortfolioDS._instance = new PortfolioDS()
    }
    return PortfolioDS._instance
  }

  public static getInstance(): PortfolioDS {
    return ModuleRegistry.getInstance().get('portfolio').store as PortfolioDS
  }

  private constructor() {
    super('portfolio', {
      loading: false,
      items: [],
      selectedItem: null,
      error: null,
    })
  }

  public get getItems(): PortfolioItemModel[] {
    return this._state.items
  }

  public get getVisibleItems(): PortfolioItemModel[] {
    return this._state.items.filter(item => item.isVisible)
  }

  public get getLoading(): boolean {
    return this._state.loading
  }

  public get getError(): string | null {
    return this._state.error
  }

  public get getSelectedItem(): PortfolioItemModel | null {
    return this._state.selectedItem
  }

  public setLoading(loading: boolean): void {
    this._state.loading = loading
  }

  public setError(error: string | null): void {
    this._state.error = error
  }

  public setItems(items: TPortfolioItem[]): void {
    this._state.items = items
      .map(item => new PortfolioItemModel(item))
      .sort((a, b) => a.sort - b.sort)
    this._state.error = null
  }

  public setSelectedItem(item: TPortfolioItem | null): void {
    this._state.selectedItem = item ? new PortfolioItemModel(item) : null
  }

  public reset(): void {
    this._state.loading = false
    this._state.items = []
    this._state.selectedItem = null
    this._state.error = null
  }
}
