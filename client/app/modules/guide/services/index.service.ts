import type { ServerResponse } from '~~/types/common'
import { BaseApp } from '~/core/BaseApp'
import type { TGuide } from '../types/index.type'

export class GuideApiService extends BaseApp<TGuide & { id: string }> {
  constructor() {
    super('guide')
  }

  public async getList(): Promise<ServerResponse<TGuide[]>> {
    return this.executeRequest<TGuide[]>(async () => {
      return await this.Get<TGuide[]>('/guides')
    }, false)
  }

  public async getBySlug(slug: string): Promise<ServerResponse<TGuide>> {
    return this.executeRequest<TGuide>(async () => {
      return await this.Get<TGuide>(`/guides/by-slug/${encodeURIComponent(slug)}`)
    }, false)
  }
}
