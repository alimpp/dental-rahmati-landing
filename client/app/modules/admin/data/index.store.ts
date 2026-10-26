import { BaseStore } from '~/core/BaseStore'
import { ModuleRegistry } from '~/core/ModuleRegistry'
import type { TAdminUser, TPermissionSchema } from '../types/index.type'

interface AdminState {
  user: TAdminUser | null
  permissionSchema: TPermissionSchema | null
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
      permissionSchema: null,
      loading: false,
    })
  }

  public get getUser(): TAdminUser | null {
    return this._state.user
  }

  public get getPermissionSchema(): TPermissionSchema | null {
    return this._state.permissionSchema
  }

  public get getLoading(): boolean {
    return this._state.loading
  }

  public setUser(user: TAdminUser | null): void {
    this._state.user = user
  }

  public setPermissionSchema(schema: TPermissionSchema | null): void {
    this._state.permissionSchema = schema
  }

  public setLoading(loading: boolean): void {
    this._state.loading = loading
  }

  public reset(): void {
    this._state.user = null
    this._state.permissionSchema = null
    this._state.loading = false
  }
}
