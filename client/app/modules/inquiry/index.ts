import { BaseModule } from '~/core/BaseModule'
import { ModuleRegistry } from '~/core/ModuleRegistry'
import { InquiryController } from './controllers/index.controller'
import { InquiryDS } from './data/index.store'
import { InquiryApiService } from './services/index.service'

export class InquiryModule extends BaseModule<InquiryDS, InquiryApiService, InquiryController> {
  private static instance: InquiryModule | null = null

  private constructor() {
    const store = InquiryDS.create()
    const service = new InquiryApiService()
    super('inquiry', store, service, new InquiryController(service, store))
  }

  public static create(): InquiryModule {
    if (!InquiryModule.instance) {
      InquiryModule.instance = new InquiryModule()
    }
    return InquiryModule.instance
  }

  public static reset(): void {
    InquiryModule.instance = null
  }

  public static getInstance(): InquiryModule {
    return ModuleRegistry.getInstance().get<InquiryModule>('inquiry')
  }
}
