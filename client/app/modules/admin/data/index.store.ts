import { BaseStore } from '~/core/BaseStore'
import { ModuleRegistry } from '~/core/ModuleRegistry'
import type { TAdminUser, TPermissionCatalog } from '../types/index.type'

interface AdminState {
  user: TAdminUser | null
  catalog: TPermissionCatalog | null
  loading: boolean
}

export class AdminDS extends BaseStore<AdminState> {
  private static _instance: AdminDS

  public static create(): AdminDS {
    if (!AdminDS._instance) {
      AdminDS._instance = new AdminDS()
    }
    return AdminDS._instance
  }

  public static getInstance(): AdminDS {
    return ModuleRegistry.getInstance().get('admin').store as AdminDS
  }

  private constructor() {
    super('admin', {
      user: null,
      catalog: null,
      loading: false,
    })
  }

  public get getUser(): TAdminUser | null {
    return this._state.user
  }

  public get getCatalog(): TPermissionCatalog | null {
    return this._state.catalog
  }

  public get getLoading(): boolean {
    return this._state.loading
  }

  public setUser(user: TAdminUser | null): void {
    this._state.user = user
  }

  public setCatalog(catalog: TPermissionCatalog | null): void {
    this._state.catalog = catalog
  }

  public setLoading(loading: boolean): void {
    this._state.loading = loading
  }

  public reset(): void {
    this._state.user = null
    this._state.catalog = null
    this._state.loading = false
  }
}
