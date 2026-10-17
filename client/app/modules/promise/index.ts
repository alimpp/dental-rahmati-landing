import { BaseModule } from '~/core/BaseModule'
import { ModuleRegistry } from '~/core/ModuleRegistry'
import { PromiseController } from './controllers/index.controller'
import { PromiseDS } from './data/index.store'
import { PromiseApiService } from './services/index.service'

export class PromiseModule extends BaseModule<PromiseDS, PromiseApiService, PromiseController> {
  private static instance: PromiseModule | null = null

  private constructor() {
    const store = PromiseDS.create()
    const service = new PromiseApiService()
    super('promise', store, service, new PromiseController(service, store))
  }

  public static create(): PromiseModule {
    if (!PromiseModule.instance) {
      PromiseModule.instance = new PromiseModule()
    }
    return PromiseModule.instance
  }

  public static reset(): void {
    PromiseModule.instance = null
  }

  public static getInstance(): PromiseModule {
    return ModuleRegistry.getInstance().get<PromiseModule>('promise')
  }
}
