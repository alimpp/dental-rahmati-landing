import { BaseStore } from '~/core/BaseStore'
import { ModuleRegistry } from '~/core/ModuleRegistry'
import { InquiryModel } from '../models/index.model'
import type { TInquiry } from '../types/index.type'

interface InquiryState {
  submitting: boolean
  success: boolean
  error: string | null
  fieldErrors: Record<string, string>
  lastItem: InquiryModel | null
}

export class InquiryDS extends BaseStore<InquiryState> {
  private static _instance: InquiryDS

  public static create(): InquiryDS {
    if (!InquiryDS._instance) {
      InquiryDS._instance = new InquiryDS()
    }
    return InquiryDS._instance
  }

  public static getInstance(): InquiryDS {
    return ModuleRegistry.getInstance().get('inquiry').store as InquiryDS
  }

  private constructor() {
    super('inquiry', {
      submitting: false,
      success: false,
      error: null,
      fieldErrors: {},
      lastItem: null,
    })
  }

  public get getSubmitting(): boolean {
    return this._state.submitting
  }

  public get getSuccess(): boolean {
    return this._state.success
  }

  public get getError(): string | null {
    return this._state.error
  }

  public get getFieldErrors(): Record<string, string> {
    return this._state.fieldErrors
  }

  public setSubmitting(submitting: boolean): void {
    this._state.submitting = submitting
  }

  public setResult(item: TInquiry | null, error: string | null): void {
    this._state.success = Boolean(item)
    this._state.error = error
    this._state.lastItem = item ? new InquiryModel(item) : null
    if (item) this._state.fieldErrors = {}
  }

  public setFieldErrors(errors: Record<string, string>): void {
    this._state.fieldErrors = errors
  }

  public clearFieldError(field: string): void {
    if (!this._state.fieldErrors[field]) return
    const next = { ...this._state.fieldErrors }
    delete next[field]
    this._state.fieldErrors = next
  }

  public clearFeedback(): void {
    this._state.success = false
    this._state.error = null
    this._state.fieldErrors = {}
  }

  public reset(): void {
    this._state.submitting = false
    this._state.success = false
    this._state.error = null
    this._state.fieldErrors = {}
    this._state.lastItem = null
  }
}
