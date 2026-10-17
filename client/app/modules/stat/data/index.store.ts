import { BaseStore } from '~/core/BaseStore'
import { ModuleRegistry } from '~/core/ModuleRegistry'
import { StatModel } from '../models/index.model'
import type { TStat } from '../types/index.type'

interface StatState {
  loading: boolean
  items: StatModel[]
  error: string | null
}

export class StatDS extends BaseStore<StatState> {
  private static _instance: StatDS

  public static create(): StatDS {
    if (!StatDS._instance) {
      StatDS._instance = new StatDS()
    }
    return StatDS._instance
  }

  public static getInstance(): StatDS {
    return ModuleRegistry.getInstance().get('stat').store as StatDS
  }

  private constructor() {
    super('stat', {
      loading: false,
      items: [],
      error: null,
    })
  }

  public get getItems(): StatModel[] {
    return this._state.items
  }

  public get getVisibleItems(): StatModel[] {
    return this._state.items.filter((item) => item.isVisible)
  }

  public get getLoading(): boolean {
    return this._state.loading
  }

  public get getError(): string | null {
    return this._state.error
  }

  public setLoading(loading: boolean): void {
    this._state.loading = loading
  }

  public setError(error: string | null): void {
    this._state.error = error
  }

  public setItems(items: TStat[]): void {
    this._state.items = items
      .map((item) => new StatModel(item))
      .sort((a, b) => a.sort - b.sort)
    this._state.error = null
  }

  public reset(): void {
    this._state.loading = false
    this._state.items = []
    this._state.error = null
  }
}
