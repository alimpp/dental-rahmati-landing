import { BaseModule } from '~/core/BaseModule'
import { ModuleRegistry } from '~/core/ModuleRegistry'
import { ArticleController } from './controllers/index.controller'
import { ArticleDS } from './data/index.store'
import { ArticleApiService } from './services/index.service'

export class ArticleModule extends BaseModule<ArticleDS, ArticleApiService, ArticleController> {
  private static instance: ArticleModule | null = null

  private constructor() {
    const store = ArticleDS.create()
    const service = new ArticleApiService()
    super('article', store, service, new ArticleController(service, store))
  }

  public static create(): ArticleModule {
    if (!ArticleModule.instance) {
      ArticleModule.instance = new ArticleModule()
    }
    return ArticleModule.instance
  }

  public static reset(): void {
    ArticleModule.instance = null
  }

  public static getInstance(): ArticleModule {
    return ModuleRegistry.getInstance().get<ArticleModule>('article')
  }
}
