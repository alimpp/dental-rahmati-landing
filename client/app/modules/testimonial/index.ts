import { BaseModule } from '~/core/BaseModule'
import { ModuleRegistry } from '~/core/ModuleRegistry'
import { TestimonialController } from './controllers/index.controller'
import { TestimonialDS } from './data/index.store'
import { TestimonialApiService } from './services/index.service'

export class TestimonialModule extends BaseModule<TestimonialDS, TestimonialApiService, TestimonialController> {
  private static instance: TestimonialModule | null = null

  private constructor() {
    const store = TestimonialDS.create()
    const service = new TestimonialApiService()
    super('testimonial', store, service, new TestimonialController(service, store))
  }

  public static create(): TestimonialModule {
    if (!TestimonialModule.instance) {
      TestimonialModule.instance = new TestimonialModule()
    }
    return TestimonialModule.instance
  }

  public static reset(): void {
    TestimonialModule.instance = null
  }

  public static getInstance(): TestimonialModule {
    return ModuleRegistry.getInstance().get<TestimonialModule>('testimonial')
  }
}
