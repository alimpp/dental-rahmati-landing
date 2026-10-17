import type { BaseModule } from './BaseModule'
import { StoreManager } from './StoreManager'

export class ModuleRegistry {
  private static instance: ModuleRegistry | null = null

  private readonly modules = new Map<string, BaseModule>()
  private readonly activated = new Set<string>()

  private constructor() {}

  public static getInstance(): ModuleRegistry {
    if (!ModuleRegistry.instance) {
      ModuleRegistry.instance = new ModuleRegistry()
    }
    return ModuleRegistry.instance
  }

  public register(module: BaseModule): BaseModule {
    this.modules.set(module.name, module)
    StoreManager.getInstance().register(module.store)
    return module
  }

  public activate(name: string): void {
    if (!this.modules.has(name)) {
      throw this.missingModuleError(name)
    }
    this.activated.add(name)
  }

  public get<T extends BaseModule>(name: string): T {
    const module = this.modules.get(name)
    if (!module || !this.activated.has(name)) {
      throw this.missingModuleError(name)
    }
    return module as T
  }

  public has(name: string): boolean {
    return this.modules.has(name) && this.activated.has(name)
  }

  private missingModuleError(name: string): Error {
    return new Error(
      `Module "${name}" is not registered. Register store/service/controller in a ${name} module class and activate it from AppModules.`,
    )
  }
}
