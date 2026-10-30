export interface AdminPageActionState {
  actionLabel: string
  showAction: boolean
  disabled: boolean
}

type AdminPageActionInput = Partial<AdminPageActionState> & {
  onAction?: (() => void) | null
}

const defaults: AdminPageActionState = {
  actionLabel: '',
  showAction: false,
  disabled: false,
}

/** Keep callbacks out of useState — Nuxt cannot serialize functions into the SSR payload. */
let onActionHandler: (() => void) | null = null

export function useAdminPageHeader() {
  const state = useState<AdminPageActionState>('admin-page-action', () => ({ ...defaults }))

  function setAction(partial: AdminPageActionInput) {
    if ('onAction' in partial) {
      onActionHandler = partial.onAction ?? null
    }
    state.value = {
      actionLabel: partial.actionLabel ?? state.value.actionLabel,
      showAction: partial.showAction ?? state.value.showAction,
      disabled: partial.disabled ?? state.value.disabled,
    }
  }

  function clearAction() {
    onActionHandler = null
    state.value = { ...defaults }
  }

  function runAction() {
    onActionHandler?.()
  }

  return {
    state,
    setAction,
    clearAction,
    runAction,
  }
}
