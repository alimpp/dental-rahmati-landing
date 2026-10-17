import { BaseModule } from '~/core/BaseModule'
import { ModuleRegistry } from '~/core/ModuleRegistry'
import { BannerController } from './controllers/index.controller'
import { BannerDS } from './data/index.store'
import { BannerService } from './services/index.service'

export class BannerModule extends BaseModule<BannerDS, BannerService, BannerController> {
  private static instance: BannerModule | null = null

  private constructor() {
    const store = BannerDS.create()
    const service = new BannerService()
    super('banner', store, service, new BannerController(service, store))
  }

  public static create(): BannerModule {
    if (!BannerModule.instance) {
      BannerModule.instance = new BannerModule()
    }
    return BannerModule.instance
  }

  public static getInstance(): BannerModule {
    return ModuleRegistry.getInstance().get<BannerModule>('banner')
  }
}
