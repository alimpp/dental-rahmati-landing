import { BaseStore } from '~/core/BaseStore'
import { ModuleRegistry } from '~/core/ModuleRegistry'
import { BannerModel } from '../models/index.model'
import type { TBanner } from '../types/index.type'

interface BannerState {
  loading: boolean
  items: BannerModel[]
  selectedItem: BannerModel | null
  error: string | null
}

export class BannerDS extends BaseStore<BannerState> {
  private static _instance: BannerDS

  public static create(): BannerDS {
    if (!BannerDS._instance) {
      BannerDS._instance = new BannerDS()
    }
    return BannerDS._instance
  }

  public static getInstance(): BannerDS {
    return ModuleRegistry.getInstance().get('banner').store as BannerDS
  }

  private constructor() {
    super('banner', {
      loading: false,
      items: [],
      selectedItem: null,
      error: null,
    })
  }

  public get getItems(): BannerModel[] {
    return this._state.items
  }

  public get getVisibleItems(): BannerModel[] {
    return this._state.items.filter((item) => item.isVisible)
  }

  public get getLoading(): boolean {
    return this._state.loading
  }

  public get getError(): string | null {
    return this._state.error
  }

  public get getSelectedItem(): BannerModel | null {
    return this._state.selectedItem
  }

  public setLoading(loading: boolean): void {
    this._state.loading = loading
  }

  public setError(error: string | null): void {
    this._state.error = error
  }

  public setItems(items: TBanner[]): void {
    this._state.items = items
      .map((item) => new BannerModel(item))
      .sort((a, b) => a.sort - b.sort)
    this._state.error = null
  }

  public upsertItem(item: TBanner): void {
    const model = new BannerModel(item)
    const index = this._state.items.findIndex((entry) => entry.id === model.id)

    if (index === -1) {
      this._state.items = [model, ...this._state.items].sort((a, b) => a.sort - b.sort)
    }
    else {
      const next = [...this._state.items]
      next[index] = model
      this._state.items = next.sort((a, b) => a.sort - b.sort)
    }

    if (this._state.selectedItem?.id === model.id) {
      this._state.selectedItem = model
    }
  }

  public removeItem(id: string): void {
    this._state.items = this._state.items.filter((item) => item.id !== id)
    if (this._state.selectedItem?.id === id) {
      this._state.selectedItem = null
    }
  }

  public setSelectedItem(item: TBanner | null): void {
    this._state.selectedItem = item ? new BannerModel(item) : null
  }

  public reset(): void {
    this._state.loading = false
    this._state.items = []
    this._state.selectedItem = null
    this._state.error = null
  }
}
