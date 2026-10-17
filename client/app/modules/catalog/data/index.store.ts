import { BaseStore } from '~/core/BaseStore'
import { ModuleRegistry } from '~/core/ModuleRegistry'
import { CatalogItemModel } from '../models/index.model'
import type { TCatalogItem } from '../types/index.type'

interface CatalogState {
  loading: boolean
  items: CatalogItemModel[]
  selectedItem: CatalogItemModel | null
  error: string | null
}

export class CatalogDS extends BaseStore<CatalogState> {
  private static _instance: CatalogDS

  public static create(): CatalogDS {
    if (!CatalogDS._instance) {
      CatalogDS._instance = new CatalogDS()
    }
    return CatalogDS._instance
  }

  public static getInstance(): CatalogDS {
    return ModuleRegistry.getInstance().get('catalog').store as CatalogDS
  }

  private constructor() {
    super('catalog', {
      loading: false,
      items: [],
      selectedItem: null,
      error: null,
    })
  }

  public get getItems(): CatalogItemModel[] {
    return this._state.items
  }

  public get getVisibleItems(): CatalogItemModel[] {
    return this._state.items.filter((item) => item.isVisible)
  }

  public get getLoading(): boolean {
    return this._state.loading
  }

  public get getError(): string | null {
    return this._state.error
  }

  public get getSelectedItem(): CatalogItemModel | null {
    return this._state.selectedItem
  }

  public setLoading(loading: boolean): void {
    this._state.loading = loading
  }

  public setError(error: string | null): void {
    this._state.error = error
  }

  public setItems(items: TCatalogItem[]): void {
    this._state.items = items
      .map((item) => new CatalogItemModel(item))
      .sort((a, b) => a.sort - b.sort)
    this._state.error = null
  }

  public setSelectedItem(item: TCatalogItem | null): void {
    this._state.selectedItem = item ? new CatalogItemModel(item) : null
  }

  public reset(): void {
    this._state.loading = false
    this._state.items = []
    this._state.selectedItem = null
    this._state.error = null
  }
}
