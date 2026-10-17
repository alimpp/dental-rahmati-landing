import { BaseModule } from '~/core/BaseModule'
import { ModuleRegistry } from '~/core/ModuleRegistry'
import { StatController } from './controllers/index.controller'
import { StatDS } from './data/index.store'
import { StatApiService } from './services/index.service'

export class StatModule extends BaseModule<StatDS, StatApiService, StatController> {
  private static instance: StatModule | null = null

  private constructor() {
    const store = StatDS.create()
    const service = new StatApiService()
    super('stat', store, service, new StatController(service, store))
  }

  public static create(): StatModule {
    if (!StatModule.instance) {
      StatModule.instance = new StatModule()
    }
    return StatModule.instance
  }

  public static reset(): void {
    StatModule.instance = null
  }

  public static getInstance(): StatModule {
    return ModuleRegistry.getInstance().get<StatModule>('stat')
  }
}
