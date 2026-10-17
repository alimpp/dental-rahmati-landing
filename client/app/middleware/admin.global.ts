import { adminModule } from '~/modules'
import { useAdminToken } from '~/composables/useAdminToken'

export default defineNuxtRouteMiddleware(async (to) => {
  if (!to.path.startsWith('/admin')) return

  const token = useAdminToken()

  if (to.path === '/admin/login') {
    if (!token.value) return
    const ok = await adminModule.controller.hydrate()
    if (ok) return navigateTo('/admin')
    return
  }

  if (!token.value) {
    return navigateTo('/admin/login')
  }

  const ok = await adminModule.controller.hydrate()
  if (!ok) {
    return navigateTo('/admin/login')
  }
})
