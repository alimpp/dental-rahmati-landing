export type AdminConfirmOptions = {
  title?: string
  message: string
  warning?: string
  confirmLabel?: string
  cancelLabel?: string
}

type AdminConfirmState = {
  open: boolean
  title: string
  message: string
  warning: string
  confirmLabel: string
  cancelLabel: string
}

const defaults: AdminConfirmState = {
  open: false,
  title: 'حذف این مورد؟',
  message: '',
  warning: 'این کار قابل بازگشت نیست.',
  confirmLabel: 'حذف',
  cancelLabel: 'انصراف',
}

let pending: ((value: boolean) => void) | null = null

export function useAdminConfirm() {
  const state = useState<AdminConfirmState>('admin-confirm', () => ({ ...defaults }))

  function settle(value: boolean) {
    const resolve = pending
    pending = null
    state.value = { ...defaults }
    resolve?.(value)
  }

  function confirm(options: AdminConfirmOptions | string) {
    const opts = typeof options === 'string' ? { message: options } : options
    pending?.(false)
    return new Promise<boolean>((resolve) => {
      pending = resolve
      state.value = {
        open: true,
        title: opts.title ?? defaults.title,
        message: opts.message,
        warning: opts.warning ?? defaults.warning,
        confirmLabel: opts.confirmLabel ?? defaults.confirmLabel,
        cancelLabel: opts.cancelLabel ?? defaults.cancelLabel,
      }
    })
  }

  return {
    state,
    confirm,
    accept: () => settle(true),
    cancel: () => settle(false),
  }
}
