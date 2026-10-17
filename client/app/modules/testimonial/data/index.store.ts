import { BaseStore } from '~/core/BaseStore'
import { ModuleRegistry } from '~/core/ModuleRegistry'
import { TestimonialModel } from '../models/index.model'
import type { TTestimonial } from '../types/index.type'

interface TestimonialState {
  loading: boolean
  items: TestimonialModel[]
  error: string | null
}

export class TestimonialDS extends BaseStore<TestimonialState> {
  private static _instance: TestimonialDS

  public static create(): TestimonialDS {
    if (!TestimonialDS._instance) {
      TestimonialDS._instance = new TestimonialDS()
    }
    return TestimonialDS._instance
  }

  public static getInstance(): TestimonialDS {
    return ModuleRegistry.getInstance().get('testimonial').store as TestimonialDS
  }

  private constructor() {
    super('testimonial', {
      loading: false,
      items: [],
      error: null,
    })
  }

  public get getItems(): TestimonialModel[] {
    return this._state.items
  }

  public get getVisibleItems(): TestimonialModel[] {
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

  public setItems(items: TTestimonial[]): void {
    this._state.items = items
      .map((item) => new TestimonialModel(item))
      .sort((a, b) => a.sort - b.sort)
    this._state.error = null
  }

  public reset(): void {
    this._state.loading = false
    this._state.items = []
    this._state.error = null
  }
}
