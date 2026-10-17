import { BaseModule } from '~/core/BaseModule'
import { ModuleRegistry } from '~/core/ModuleRegistry'
import { ProcessStepController } from './controllers/index.controller'
import { ProcessStepDS } from './data/index.store'
import { ProcessStepApiService } from './services/index.service'

export class ProcessStepModule extends BaseModule<ProcessStepDS, ProcessStepApiService, ProcessStepController> {
  private static instance: ProcessStepModule | null = null

  private constructor() {
    const store = ProcessStepDS.create()
    const service = new ProcessStepApiService()
    super('process-step', store, service, new ProcessStepController(service, store))
  }

  public static create(): ProcessStepModule {
    if (!ProcessStepModule.instance) {
      ProcessStepModule.instance = new ProcessStepModule()
    }
    return ProcessStepModule.instance
  }

  public static reset(): void {
    ProcessStepModule.instance = null
  }

  public static getInstance(): ProcessStepModule {
    return ModuleRegistry.getInstance().get<ProcessStepModule>('process-step')
  }
}
