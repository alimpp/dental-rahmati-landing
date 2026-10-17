import { BaseStore } from '~/core/BaseStore'
import { ModuleRegistry } from '~/core/ModuleRegistry'
import { GuideModel } from '../models/index.model'
import type { TGuide } from '../types/index.type'

interface GuideState {
  loading: boolean
  items: GuideModel[]
  selected: GuideModel | null
  error: string | null
}

export class GuideDS extends BaseStore<GuideState> {
  private static _instance: GuideDS

  public static create(): GuideDS {
    if (!GuideDS._instance) {
      GuideDS._instance = new GuideDS()
    }
    return GuideDS._instance
  }

  public static getInstance(): GuideDS {
    return ModuleRegistry.getInstance().get('guide').store as GuideDS
  }

  private constructor() {
    super('guide', {
      loading: false,
      items: [],
      selected: null,
      error: null,
    })
  }

  public get getItems(): GuideModel[] {
    return this._state.items
  }

  public get getVisibleItems(): GuideModel[] {
    return this._state.items.filter((item) => item.isVisible)
  }

  public get getSelected(): GuideModel | null {
    return this._state.selected
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

  public setItems(items: TGuide[]): void {
    this._state.items = items
      .map((item) => new GuideModel(item))
      .sort((a, b) => a.sort - b.sort)
    this._state.error = null
  }

  public setSelected(item: TGuide | null): void {
    this._state.selected = item ? new GuideModel(item) : null
  }

  public reset(): void {
    this._state.loading = false
    this._state.items = []
    this._state.selected = null
    this._state.error = null
  }
}
