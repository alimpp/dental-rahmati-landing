import { BaseModule } from '~/core/BaseModule'
import { ModuleRegistry } from '~/core/ModuleRegistry'
import { CatalogController } from './controllers/index.controller'
import { CatalogDS } from './data/index.store'
import { CatalogApiService } from './services/index.service'

export class CatalogModule extends BaseModule<CatalogDS, CatalogApiService, CatalogController> {
  private static instance: CatalogModule | null = null

  private constructor() {
    const store = CatalogDS.create()
    const service = new CatalogApiService()
    super('catalog', store, service, new CatalogController(service, store))
  }

  public static create(): CatalogModule {
    if (!CatalogModule.instance) {
      CatalogModule.instance = new CatalogModule()
    }
    return CatalogModule.instance
  }

  public static reset(): void {
    CatalogModule.instance = null
  }

  public static getInstance(): CatalogModule {
    return ModuleRegistry.getInstance().get<CatalogModule>('catalog')
  }
}
