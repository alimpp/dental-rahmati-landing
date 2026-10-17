import { BaseModule } from '~/core/BaseModule'
import { ModuleRegistry } from '~/core/ModuleRegistry'
import { AdminController } from './controllers/index.controller'
import { AdminDS } from './data/index.store'
import { AdminApiService } from './services/index.service'

export class AdminModule extends BaseModule<AdminDS, AdminApiService, AdminController> {
  private static instance: AdminModule | null = null

  private constructor() {
    const store = AdminDS.create()
    const service = new AdminApiService()
    super('admin', store, service, new AdminController(service, store))
  }

  public static create(): AdminModule {
    if (!AdminModule.instance) {
      AdminModule.instance = new AdminModule()
    }
    return AdminModule.instance
  }

  public static reset(): void {
    AdminModule.instance = null
  }

  public static getInstance(): AdminModule {
    return ModuleRegistry.getInstance().get<AdminModule>('admin')
  }
}
