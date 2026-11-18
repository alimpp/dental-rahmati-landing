import { BaseStore } from '~/core/BaseStore'
import { ModuleRegistry } from '~/core/ModuleRegistry'
import { ClinicRoomModel } from '../models/index.model'
import type { TClinicRoom } from '../types/index.type'

interface ClinicRoomState {
  loading: boolean
  items: ClinicRoomModel[]
  error: string | null
}

export class ClinicRoomDS extends BaseStore<ClinicRoomState> {
  private static _instance: ClinicRoomDS

  public static create(): ClinicRoomDS {
    if (!ClinicRoomDS._instance) {
      ClinicRoomDS._instance = new ClinicRoomDS()
    }
    return ClinicRoomDS._instance
  }

  public static getInstance(): ClinicRoomDS {
    return ModuleRegistry.getInstance().get('clinic-room').store as ClinicRoomDS
  }

  private constructor() {
    super('clinic-room', {
      loading: false,
      items: [],
      error: null,
    })
  }

  public get getItems(): ClinicRoomModel[] {
    return this._state.items
  }

  public get getVisibleItems(): ClinicRoomModel[] {
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

  public setItems(items: TClinicRoom[]): void {
    this._state.items = items
      .map((item) => new ClinicRoomModel(item))
      .sort((a, b) => a.sort - b.sort)
    this._state.error = null
  }

  public reset(): void {
    this._state.loading = false
    this._state.items = []
    this._state.error = null
  }
}
