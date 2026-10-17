import type { BaseStore } from './BaseStore'
import { ModuleRegistry } from './ModuleRegistry'

export abstract class BaseModule<
  TStore extends BaseStore<object> = BaseStore<object>,
  TService = unknown,
  TController = unknown,
> {
  protected constructor(
    public readonly name: string,
    public readonly store: TStore,
    public readonly service: TService,
    public readonly controller: TController,
  ) {
    if (!name) {
      throw new Error('Module name is required')
    }
    if (!store || !service || !controller) {
      throw new Error(
        `Module "${name}" must provide store, service, and controller`,
      )
    }
  }

  public register(): this {
    ModuleRegistry.getInstance().register(this)
    return this
  }
}
