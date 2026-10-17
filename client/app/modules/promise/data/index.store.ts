import { BaseStore } from '~/core/BaseStore'
import { ModuleRegistry } from '~/core/ModuleRegistry'
import { PromiseModel } from '../models/index.model'
import type { TPromise } from '../types/index.type'

interface PromiseState {
  loading: boolean
  items: PromiseModel[]
  error: string | null
}

export class PromiseDS extends BaseStore<PromiseState> {
  private static _instance: PromiseDS

  public static create(): PromiseDS {
    if (!PromiseDS._instance) {
      PromiseDS._instance = new PromiseDS()
    }
    return PromiseDS._instance
  }

  public static getInstance(): PromiseDS {
    return ModuleRegistry.getInstance().get('promise').store as PromiseDS
  }

  private constructor() {
    super('promise', {
      loading: false,
      items: [],
      error: null,
    })
  }

  public get getItems(): PromiseModel[] {
    return this._state.items
  }

  public get getVisibleItems(): PromiseModel[] {
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

  public setItems(items: TPromise[]): void {
    this._state.items = items
      .map((item) => new PromiseModel(item))
      .sort((a, b) => a.sort - b.sort)
    this._state.error = null
  }

  public reset(): void {
    this._state.loading = false
    this._state.items = []
    this._state.error = null
  }
}
