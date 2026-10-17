import { BaseStore } from './BaseStore'

export class StoreManager {
  private static instance: StoreManager | null = null

  private readonly stores = new Map<string, BaseStore<object>>()

  private constructor() {}

  public static getInstance(): StoreManager {
    if (!StoreManager.instance) {
      StoreManager.instance = new StoreManager()
    }
    return StoreManager.instance
  }

  public register(store: BaseStore<object>): void {
    const namespace = store.getNamespace()
    if (this.stores.has(namespace)) {
      return
    }
    this.stores.set(namespace, store)
  }

  public get<T extends BaseStore<object>>(namespace: string): T {
    const store = this.stores.get(namespace)
    if (!store) {
      throw new Error(`Store with namespace '${namespace}' not found`)
    }
    return store as T
  }

  public getAll(): BaseStore<object>[] {
    return Array.from(this.stores.values())
  }

  public resetAll(): void {
    this.stores.forEach((store) => store.reset())
  }
}
