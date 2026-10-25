import { BaseModule } from '~/core/BaseModule'
import { ModuleRegistry } from '~/core/ModuleRegistry'
import { PortfolioController } from './controllers/index.controller'
import { PortfolioDS } from './data/index.store'
import { PortfolioApiService } from './services/index.service'

export class PortfolioModule extends BaseModule<PortfolioDS, PortfolioApiService, PortfolioController> {
  private static instance: PortfolioModule | null = null

  private constructor() {
    const store = PortfolioDS.create()
    const service = new PortfolioApiService()
    super('portfolio', store, service, new PortfolioController(service, store))
  }

  public static create(): PortfolioModule {
    if (!PortfolioModule.instance) {
      PortfolioModule.instance = new PortfolioModule()
    }
    return PortfolioModule.instance
  }

  public static reset(): void {
    PortfolioModule.instance = null
  }

  public static getInstance(): PortfolioModule {
    return ModuleRegistry.getInstance().get<PortfolioModule>('portfolio')
  }
}
