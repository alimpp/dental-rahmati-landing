export interface AdminPageActionState {
  actionLabel: string
  showAction: boolean
  disabled: boolean
  onAction: (() => void) | null
}

const defaults: AdminPageActionState = {
  actionLabel: '',
  showAction: false,
  disabled: false,
  onAction: null,
}

export function useAdminPageHeader() {
  const state = useState<AdminPageActionState>('admin-page-action', () => ({ ...defaults }))

  function setAction(partial: Partial<AdminPageActionState>) {
    state.value = {
      ...state.value,
      ...partial,
    }
  }

  function clearAction() {
    state.value = { ...defaults }
  }

  return {
    state,
    setAction,
    clearAction,
  }
}
