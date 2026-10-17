import type { ServerResponse } from '~~/types/common'
import { useAdminToken } from '~/composables/useAdminToken'
import { BaseController } from '~/core/BaseController'
import type { AdminDS } from '../data/index.store'
import type { AdminApiService } from '../services/index.service'
import {
  canAccess,
  type AdminModuleKey,
  type PermissionAction,
  type TAdminUser,
  type TCreateAdminPayload,
  type THistoryPage,
  type TLoginPayload,
  type TPermissionCatalog,
  type TUpdateAdminPayload,
  type VisitReportRange,
} from '../types/index.type'

export class AdminController extends BaseController<AdminApiService> {
  constructor(
    service: AdminApiService,
    private readonly adminDS: AdminDS,
  ) {
    super(service)
  }

  private get tokenCookie() {
    return useAdminToken()
  }

  public can(module: AdminModuleKey, action: PermissionAction): boolean {
    return canAccess(this.adminDS.getUser, module, action)
  }

  public async login(payload: TLoginPayload): Promise<ServerResponse<TAdminUser>> {
    this.adminDS.setLoading(true)
    try {
      const response = await this.service.login(payload)
      if (!response.success || !response.data?.token || !response.data.user) {
        return {
          success: false,
          message: response.message || 'ورود ناموفق بود',
          data: null as unknown as TAdminUser,
        }
      }
      this.tokenCookie.value = response.data.token
      this.adminDS.setUser(response.data.user)
      return {
        success: true,
        message: response.message,
        data: response.data.user,
      }
    }
    finally {
      this.adminDS.setLoading(false)
    }
  }

  public logout(): void {
    this.tokenCookie.value = null
    this.adminDS.reset()
  }

  public async hydrate(): Promise<boolean> {
    if (!this.tokenCookie.value) {
      this.adminDS.setUser(null)
      return false
    }
    const response = await this.service.me()
    if (!response.success || !response.data) {
      this.logout()
      return false
    }
    this.adminDS.setUser(response.data)
    return true
  }

  public async loadCatalog(): Promise<TPermissionCatalog | null> {
    const response = await this.service.getCatalog()
    if (response.success && response.data) {
      this.adminDS.setCatalog(response.data)
      return response.data
    }
    return this.adminDS.getCatalog
  }

  public async getAdmins() {
    return this.service.getAdmins()
  }

  public async createAdmin(payload: TCreateAdminPayload) {
    return this.service.createAdmin(payload)
  }

  public async updateAdmin(id: string, payload: TUpdateAdminPayload) {
    return this.service.updateAdmin(id, payload)
  }

  public async deleteAdmin(id: string) {
    return this.service.deleteAdmin(id)
  }

  public async getHistory(query: { module?: string; page?: number; limit?: number } = {}) {
    return this.service.getHistory(query) as Promise<ServerResponse<THistoryPage>>
  }

  public async getDashboard() {
    return this.service.getDashboard()
  }

  public async getReports(range: VisitReportRange = 'daily') {
    return this.service.getReports(range)
  }
}
