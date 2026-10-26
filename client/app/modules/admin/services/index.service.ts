import type { ServerResponse } from '~~/types/common'
import { BaseApp } from '~/core/BaseApp'
import type {
  TAdminUser,
  TCreateAdminPayload,
  TDashboard,
  THistoryPage,
  TLoginPayload,
  TLoginResult,
  TPermissionSchema,
  TUpdateAdminPayload,
  TUploadFile,
  TVisitReport,
  VisitReportRange,
} from '../types/index.type'

export class AdminApiService extends BaseApp<{ id: string }> {
  constructor() {
    super('admin')
  }

  public async login(payload: TLoginPayload): Promise<ServerResponse<TLoginResult>> {
    return this.executeRequest<TLoginResult>(async () => {
      return await this.Post<TLoginResult>('/auth/login', payload)
    }, false)
  }

  public async me(): Promise<ServerResponse<TAdminUser>> {
    return this.executeRequest<TAdminUser>(async () => {
      return await this.Get<TAdminUser>('/auth/me')
    }, false)
  }

  public async getPermissionSchema(): Promise<ServerResponse<TPermissionSchema>> {
    return this.executeRequest<TPermissionSchema>(async () => {
      return await this.Get<TPermissionSchema>('/auth/permission-schema')
    }, false)
  }

  public async getAdmins(): Promise<ServerResponse<TAdminUser[]>> {
    return this.executeRequest<TAdminUser[]>(async () => {
      return await this.Get<TAdminUser[]>('/admins')
    }, false)
  }

  public async createAdmin(payload: TCreateAdminPayload): Promise<ServerResponse<TAdminUser>> {
    return this.executeRequest<TAdminUser>(async () => {
      return await this.Post<TAdminUser>('/admins', payload)
    }, false)
  }

  public async updateAdmin(
    id: string,
    payload: TUpdateAdminPayload,
  ): Promise<ServerResponse<TAdminUser>> {
    return this.executeRequest<TAdminUser>(async () => {
      return await this.Patch<TAdminUser>(`/admins/${id}`, payload)
    }, false)
  }

  public async deleteAdmin(id: string): Promise<ServerResponse<unknown>> {
    return this.executeRequest<unknown>(async () => {
      return await this.Delete<unknown>(`/admins/${id}`)
    }, false)
  }

  public async getHistory(query: {
    module?: string
    page?: number
    limit?: number
  } = {}): Promise<ServerResponse<THistoryPage>> {
    return this.executeRequest<THistoryPage>(async () => {
      const params: Record<string, string> = {}
      if (query.module) params.module = query.module
      if (query.page) params.page = String(query.page)
      if (query.limit) params.limit = String(query.limit)
      return await this.Get<THistoryPage>('/history', params)
    }, false)
  }

  public async getReports(range: VisitReportRange = 'daily'): Promise<ServerResponse<TVisitReport>> {
    return this.executeRequest<TVisitReport>(async () => {
      return await this.Get<TVisitReport>('/analytics/reports', { range })
    }, false)
  }

  public async getDashboard(): Promise<ServerResponse<TDashboard>> {
    return this.executeRequest<TDashboard>(async () => {
      return await this.Get<TDashboard>('/analytics/dashboard')
    }, false)
  }

  public async uploadFile(
    file: File,
    kind: 'image' | 'file' = 'image',
  ): Promise<ServerResponse<TUploadFile>> {
    return this.executeRequest<TUploadFile>(async () => {
      const body = new FormData()
      body.append('file', file)
      return await this.Post<TUploadFile>(`/uploads?kind=${kind}`, body)
    }, false)
  }

  public async getAll<T>(url: string, query?: Record<string, unknown>): Promise<ServerResponse<T>> {
    return this.executeRequest<T>(async () => {
      return await this.Get<T>(url, query)
    }, false)
  }

  public async createItem<T>(url: string, body: unknown): Promise<ServerResponse<T>> {
    return this.executeRequest<T>(async () => {
      return await this.Post<T>(url, body)
    }, false)
  }

  public async updateItem<T>(url: string, body: unknown): Promise<ServerResponse<T>> {
    return this.executeRequest<T>(async () => {
      return await this.Patch<T>(url, body)
    }, false)
  }

  public async deleteItem(url: string): Promise<ServerResponse<unknown>> {
    return this.executeRequest<unknown>(async () => {
      return await this.Delete<unknown>(url)
    }, false)
  }
}
