import { useSiteTheme } from '~/composables/useSiteTheme'

export default defineNuxtPlugin(() => {
  const { initSiteTheme } = useSiteTheme()
  // apply as early as possible on client
  void initSiteTheme()
})
