import { BaseStore } from '~/core/BaseStore'
import { ModuleRegistry } from '~/core/ModuleRegistry'
import { ProcessStepModel } from '../models/index.model'
import type { TProcessStep } from '../types/index.type'

interface ProcessStepState {
  loading: boolean
  items: ProcessStepModel[]
  error: string | null
}

export class ProcessStepDS extends BaseStore<ProcessStepState> {
  private static _instance: ProcessStepDS

  public static create(): ProcessStepDS {
    if (!ProcessStepDS._instance) {
      ProcessStepDS._instance = new ProcessStepDS()
    }
    return ProcessStepDS._instance
  }

  public static getInstance(): ProcessStepDS {
    return ModuleRegistry.getInstance().get('process-step').store as ProcessStepDS
  }

  private constructor() {
    super('process-step', {
      loading: false,
      items: [],
      error: null,
    })
  }

  public get getItems(): ProcessStepModel[] {
    return this._state.items
  }

  public get getVisibleItems(): ProcessStepModel[] {
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

  public setItems(items: TProcessStep[]): void {
    this._state.items = items
      .map((item) => new ProcessStepModel(item))
      .sort((a, b) => a.sort - b.sort)
    this._state.error = null
  }

  public reset(): void {
    this._state.loading = false
    this._state.items = []
    this._state.error = null
  }
}
