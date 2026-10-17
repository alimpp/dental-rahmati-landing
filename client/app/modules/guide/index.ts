import { BaseModule } from '~/core/BaseModule'
import { ModuleRegistry } from '~/core/ModuleRegistry'
import { GuideController } from './controllers/index.controller'
import { GuideDS } from './data/index.store'
import { GuideApiService } from './services/index.service'

export class GuideModule extends BaseModule<GuideDS, GuideApiService, GuideController> {
  private static instance: GuideModule | null = null

  private constructor() {
    const store = GuideDS.create()
    const service = new GuideApiService()
    super('guide', store, service, new GuideController(service, store))
  }

  public static create(): GuideModule {
    if (!GuideModule.instance) {
      GuideModule.instance = new GuideModule()
    }
    return GuideModule.instance
  }

  public static reset(): void {
    GuideModule.instance = null
  }

  public static getInstance(): GuideModule {
    return ModuleRegistry.getInstance().get<GuideModule>('guide')
  }
}
