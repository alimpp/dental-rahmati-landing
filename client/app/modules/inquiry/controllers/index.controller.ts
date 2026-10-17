import type { ServerResponse } from '~~/types/common'
import { BaseController } from '~/core/BaseController'
import type { InquiryDS } from '../data/index.store'
import { createInquirySchema, flattenInquiryErrors } from '../schemas/inquiry.schema'
import type { InquiryApiService } from '../services/index.service'
import type { TCreateInquiryPayload, TInquiry } from '../types/index.type'

export class InquiryController extends BaseController<InquiryApiService> {
  constructor(
    service: InquiryApiService,
    private readonly inquiryDS: InquiryDS,
  ) {
    super(service)
  }

  public async submitInquiry(
    payload: TCreateInquiryPayload,
  ): Promise<ServerResponse<TInquiry>> {
    this.inquiryDS.setSubmitting(true)
    this.inquiryDS.clearFeedback()

    const parsed = createInquirySchema.safeParse(payload)
    if (!parsed.success) {
      const errors = flattenInquiryErrors(parsed.error)
      this.inquiryDS.setFieldErrors(errors)
      this.inquiryDS.setSubmitting(false)
      return {
        success: false,
        message: Object.values(errors)[0] || 'اطلاعات فرم را کامل کنید',
        data: null as unknown as TInquiry,
      }
    }

    try {
      const response = await this.service.createInquiry(parsed.data)
      if (!response.success || !response.data) {
        this.inquiryDS.setResult(null, response.message || 'ارسال درخواست ناموفق بود')
        return {
          success: false,
          message: response.message,
          data: null as unknown as TInquiry,
        }
      }

      this.inquiryDS.setResult(response.data, null)
      return {
        success: true,
        message: response.message || 'درخواست شما ثبت شد.',
        data: response.data,
      }
    }
    catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'ارسال درخواست ناموفق بود'
      this.inquiryDS.setResult(null, message)
      return {
        success: false,
        message,
        data: null as unknown as TInquiry,
      }
    }
    finally {
      this.inquiryDS.setSubmitting(false)
    }
  }
}
