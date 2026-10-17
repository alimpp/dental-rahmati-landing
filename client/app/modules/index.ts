import { BaseModule } from '~/core/BaseModule'
import { ModuleRegistry } from '~/core/ModuleRegistry'
import { BannerModule } from './banner'
import { ServiceModule } from './service'
import { ArticleModule } from './article'
import { InquiryModule } from './inquiry'
import { CatalogModule } from './catalog'
import { AdminModule } from './admin'
import { StatModule } from './stat'
import { ProcessStepModule } from './process-step'
import { TestimonialModule } from './testimonial'
import { FaqModule } from './faq'
import { PromiseModule } from './promise'
import { GuideModule } from './guide'

export class AppModules {
  private static instance: AppModules | null = null

  private constructor(modules: BaseModule[]) {
    const registry = ModuleRegistry.getInstance()
    for (const module of modules) {
      module.register()
      registry.activate(module.name)
    }
  }

  public static bootstrap(): AppModules {
    const registry = ModuleRegistry.getInstance()
    const article = registry.has('article')
      ? (registry.get('article') as ArticleModule)
      : null
    const articleStale = Boolean(
      article && typeof article.controller.getArticleCategories !== 'function',
    )
    const inquiryMissing = !registry.has('inquiry')
    const catalogMissing = !registry.has('catalog')
    const adminMissing = !registry.has('admin')
    const statMissing = !registry.has('stat')
    const processStepMissing = !registry.has('process-step')
    const testimonialMissing = !registry.has('testimonial')
    const faqMissing = !registry.has('faq')
    const promiseMissing = !registry.has('promise')
    const guideMissing = !registry.has('guide')

    if (
      !AppModules.instance
      || !article
      || articleStale
      || inquiryMissing
      || catalogMissing
      || adminMissing
      || statMissing
      || processStepMissing
      || testimonialMissing
      || faqMissing
      || promiseMissing
      || guideMissing
    ) {
      if (articleStale) {
        ArticleModule.reset()
      }
      if (inquiryMissing) {
        InquiryModule.reset()
      }
      if (catalogMissing) {
        CatalogModule.reset()
      }
      if (adminMissing) {
        AdminModule.reset()
      }
      if (statMissing) {
        StatModule.reset()
      }
      if (processStepMissing) {
        ProcessStepModule.reset()
      }
      if (testimonialMissing) {
        TestimonialModule.reset()
      }
      if (faqMissing) {
        FaqModule.reset()
      }
      if (promiseMissing) {
        PromiseModule.reset()
      }
      if (guideMissing) {
        GuideModule.reset()
      }
      AppModules.instance = new AppModules([
        BannerModule.create(),
        ServiceModule.create(),
        ArticleModule.create(),
        InquiryModule.create(),
        CatalogModule.create(),
        AdminModule.create(),
        StatModule.create(),
        PromiseModule.create(),
        ProcessStepModule.create(),
        TestimonialModule.create(),
        FaqModule.create(),
        GuideModule.create(),
      ])
    }
    return AppModules.instance
  }
}

AppModules.bootstrap()

export const bannerModule = BannerModule.getInstance()
export const serviceModule = ServiceModule.getInstance()
export const articleModule = ArticleModule.getInstance()
export const inquiryModule = InquiryModule.getInstance()
export const catalogModule = CatalogModule.getInstance()
export const adminModule = AdminModule.getInstance()
export const statModule = StatModule.getInstance()
export const processStepModule = ProcessStepModule.getInstance()
export const testimonialModule = TestimonialModule.getInstance()
export const faqModule = FaqModule.getInstance()
export const promiseModule = PromiseModule.getInstance()
export const guideModule = GuideModule.getInstance()
