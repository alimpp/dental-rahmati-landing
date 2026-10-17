import type { ServerResponse } from '~~/types/common'
import { useCustomFetch } from '~/composables/useCustomFetch'

type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT'

interface RequestErrorShape {
  response?: {
    _data?: {
      message?: string | string[]
    }
  }
}

export abstract class BaseApp<T extends { id: string | number }> {
  private readonly storageKey: string

  constructor(storageKey: string) {
    this.storageKey = storageKey
  }

  private normalizeMessage(message: unknown): string {
    if (Array.isArray(message)) {
      return message
        .map((item) => String(item).trim())
        .filter(Boolean)
        .join('، ')
    }
    if (typeof message === 'string') return message
    return 'خطا در ارتباط با سرور'
  }

  private getErrorMessage(error: unknown): string {
    const requestError = error as RequestErrorShape
    return this.normalizeMessage(requestError.response?._data?.message)
  }

  private async request<R>(
    url: string,
    method: HttpMethod,
    body?: unknown,
    query?: Record<string, unknown>,
  ): Promise<R> {
    const api = useCustomFetch()
    const isFormData = body instanceof FormData
    return (await api(url, {
      method,
      query,
      body: body
        ? isFormData
          ? body
          : JSON.stringify(body)
        : undefined,
      headers: {
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      },
    })) as R
  }

  public async Get<R>(url: string, query?: Record<string, unknown>): Promise<R> {
    return this.request<R>(url, 'GET', undefined, query)
  }

  public async Post<R>(url: string, body: unknown): Promise<R> {
    return this.request<R>(url, 'POST', body)
  }

  public async Patch<R>(url: string, body: unknown): Promise<R> {
    return this.request<R>(url, 'PATCH', body)
  }

  public async Put<R>(url: string, body: unknown): Promise<R> {
    return this.request<R>(url, 'PUT', body)
  }

  public async Delete<R>(url: string): Promise<R> {
    return this.request<R>(url, 'DELETE')
  }

  protected async executeRequest<R>(
    action: () => Promise<unknown>,
    saveToStorage = false,
  ): Promise<ServerResponse<R>> {
    try {
      const response = await action()

      if (response && typeof response === 'object' && 'success' in response) {
        const envelope = response as ServerResponse<R>
        if (saveToStorage && envelope.success) {
          this.saveData(envelope.data as unknown as T[])
        }
        return {
          success: Boolean(envelope.success),
          message: envelope.message ?? '',
          data: envelope.data,
        }
      }

      if (saveToStorage) this.saveData(response as T[])
      return {
        success: true,
        message: '',
        data: response as R,
      }
    }
    catch (error: unknown) {
      return {
        success: false,
        message: this.getErrorMessage(error),
        data: null as R,
      }
    }
  }

  protected getData(): T[] {
    if (!import.meta.client) return []
    const data = localStorage.getItem(this.storageKey)
    return data ? (JSON.parse(data) as T[]) : []
  }

  protected hasData(): boolean {
    if (!import.meta.client) return false
    return Boolean(localStorage.getItem(this.storageKey))
  }

  protected saveData(items: T[] | unknown): void {
    if (!import.meta.client) return
    localStorage.setItem(this.storageKey, JSON.stringify(items))
  }

  protected removeData() {
    if (!import.meta.client) return
    localStorage.removeItem(this.storageKey)
  }
}
