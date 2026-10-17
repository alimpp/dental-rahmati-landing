import { BaseModule } from '~/core/BaseModule'
import { ModuleRegistry } from '~/core/ModuleRegistry'
import { FaqController } from './controllers/index.controller'
import { FaqDS } from './data/index.store'
import { FaqApiService } from './services/index.service'

export class FaqModule extends BaseModule<FaqDS, FaqApiService, FaqController> {
  private static instance: FaqModule | null = null

  private constructor() {
    const store = FaqDS.create()
    const service = new FaqApiService()
    super('faq', store, service, new FaqController(service, store))
  }

  public static create(): FaqModule {
    if (!FaqModule.instance) {
      FaqModule.instance = new FaqModule()
    }
    return FaqModule.instance
  }

  public static reset(): void {
    FaqModule.instance = null
  }

  public static getInstance(): FaqModule {
    return ModuleRegistry.getInstance().get<FaqModule>('faq')
  }
}
