import { BaseStore } from '~/core/BaseStore'
import { ModuleRegistry } from '~/core/ModuleRegistry'
import { ServiceModel } from '../models/index.model'
import type { TService } from '../types/index.type'

interface ServiceState {
  loading: boolean
  items: ServiceModel[]
  selectedItem: ServiceModel | null
  error: string | null
}

export class ServiceDS extends BaseStore<ServiceState> {
  private static _instance: ServiceDS

  public static create(): ServiceDS {
    if (!ServiceDS._instance) {
      ServiceDS._instance = new ServiceDS()
    }
    return ServiceDS._instance
  }

  public static getInstance(): ServiceDS {
    return ModuleRegistry.getInstance().get('service').store as ServiceDS
  }

  private constructor() {
    super('service', {
      loading: false,
      items: [],
      selectedItem: null,
      error: null,
    })
  }

  public get getItems(): ServiceModel[] {
    return this._state.items
  }

  public get getVisibleItems(): ServiceModel[] {
    return this._state.items.filter((item) => item.isVisible)
  }

  public get getLoading(): boolean {
    return this._state.loading
  }

  public get getError(): string | null {
    return this._state.error
  }

  public get getSelectedItem(): ServiceModel | null {
    return this._state.selectedItem
  }

  public setLoading(loading: boolean): void {
    this._state.loading = loading
  }

  public setError(error: string | null): void {
    this._state.error = error
  }

  public setItems(items: TService[]): void {
    this._state.items = items
      .map((item) => new ServiceModel(item))
      .sort((a, b) => a.sort - b.sort)
    this._state.error = null
  }

  public upsertItem(item: TService): void {
    const model = new ServiceModel(item)
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

  public setSelectedItem(item: TService | null): void {
    this._state.selectedItem = item ? new ServiceModel(item) : null
  }

  public reset(): void {
    this._state.loading = false
    this._state.items = []
    this._state.selectedItem = null
    this._state.error = null
  }
}
