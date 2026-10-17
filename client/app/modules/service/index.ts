import { BaseModule } from '~/core/BaseModule'
import { ModuleRegistry } from '~/core/ModuleRegistry'
import { ServiceController } from './controllers/index.controller'
import { ServiceDS } from './data/index.store'
import { ServiceApiService } from './services/index.service'

export class ServiceModule extends BaseModule<ServiceDS, ServiceApiService, ServiceController> {
  private static instance: ServiceModule | null = null

  private constructor() {
    const store = ServiceDS.create()
    const service = new ServiceApiService()
    super('service', store, service, new ServiceController(service, store))
  }

  public static create(): ServiceModule {
    if (!ServiceModule.instance) {
      ServiceModule.instance = new ServiceModule()
    }
    return ServiceModule.instance
  }

  public static getInstance(): ServiceModule {
    return ModuleRegistry.getInstance().get<ServiceModule>('service')
  }
}
