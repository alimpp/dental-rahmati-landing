import { BaseStore } from '~/core/BaseStore'
import { ModuleRegistry } from '~/core/ModuleRegistry'
import { FaqModel } from '../models/index.model'
import type { TFaq } from '../types/index.type'

interface FaqState {
  loading: boolean
  items: FaqModel[]
  error: string | null
}

export class FaqDS extends BaseStore<FaqState> {
  private static _instance: FaqDS

  public static create(): FaqDS {
    if (!FaqDS._instance) {
      FaqDS._instance = new FaqDS()
    }
    return FaqDS._instance
  }

  public static getInstance(): FaqDS {
    return ModuleRegistry.getInstance().get('faq').store as FaqDS
  }

  private constructor() {
    super('faq', {
      loading: false,
      items: [],
      error: null,
    })
  }

  public get getItems(): FaqModel[] {
    return this._state.items
  }

  public get getVisibleItems(): FaqModel[] {
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

  public setItems(items: TFaq[]): void {
    this._state.items = items
      .map((item) => new FaqModel(item))
      .sort((a, b) => a.sort - b.sort)
    this._state.error = null
  }

  public reset(): void {
    this._state.loading = false
    this._state.items = []
    this._state.error = null
  }
}
