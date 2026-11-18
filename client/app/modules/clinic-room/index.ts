import { BaseModule } from '~/core/BaseModule'
import { ModuleRegistry } from '~/core/ModuleRegistry'
import { ClinicRoomController } from './controllers/index.controller'
import { ClinicRoomDS } from './data/index.store'
import { ClinicRoomApiService } from './services/index.service'

export class ClinicRoomModule extends BaseModule<ClinicRoomDS, ClinicRoomApiService, ClinicRoomController> {
  private static instance: ClinicRoomModule | null = null

  private constructor() {
    const store = ClinicRoomDS.create()
    const service = new ClinicRoomApiService()
    super('clinic-room', store, service, new ClinicRoomController(service, store))
  }

  public static create(): ClinicRoomModule {
    if (!ClinicRoomModule.instance) {
      ClinicRoomModule.instance = new ClinicRoomModule()
    }
    return ClinicRoomModule.instance
  }

  public static reset(): void {
    ClinicRoomModule.instance = null
  }

  public static getInstance(): ClinicRoomModule {
    return ModuleRegistry.getInstance().get<ClinicRoomModule>('clinic-room')
  }
}
