<script setup lang="ts">
import { adminModule } from '~/modules'
import { resolveAdminPageMeta } from '~/modules/admin/page-meta'
import {
  MODULE_ICONS,
  MODULE_LABELS,
  type AdminModuleKey,
} from '~/modules/admin/types/index.type'

useSeoMeta({
  title: 'پنل مدیریت | دکتر امیر رحمتی',
  robots: 'noindex, nofollow',
})

const route = useRoute()
const open = ref(false)
const profileOpen = ref(false)
const { state: pageAction } = useAdminPageHeader()

const links: {
  to: string
  key: AdminModuleKey | 'home'
  label: string
  icon: string
  group: 'main' | 'content' | 'system'
}[] = [
  { to: '/admin', key: 'home', label: 'داشبورد', icon: '/icons/admin-dashboard.svg', group: 'main' },
  { to: '/admin/reports', key: 'reports', label: MODULE_LABELS.reports, icon: MODULE_ICONS.reports, group: 'main' },
  { to: '/admin/banners', key: 'banners', label: MODULE_LABELS.banners, icon: MODULE_ICONS.banners, group: 'content' },
  { to: '/admin/themes', key: 'themes', label: MODULE_LABELS.themes, icon: MODULE_ICONS.themes, group: 'content' },
  { to: '/admin/services', key: 'services', label: MODULE_LABELS.services, icon: MODULE_ICONS.services, group: 'content' },
  { to: '/admin/articles', key: 'articles', label: MODULE_LABELS.articles, icon: MODULE_ICONS.articles, group: 'content' },
  { to: '/admin/guides', key: 'guides', label: MODULE_LABELS.guides, icon: MODULE_ICONS.guides, group: 'content' },
  { to: '/admin/portfolio', key: 'portfolio', label: MODULE_LABELS.portfolio, icon: MODULE_ICONS.portfolio, group: 'content' },
  { to: '/admin/stats', key: 'stats', label: MODULE_LABELS.stats, icon: MODULE_ICONS.stats, group: 'content' },
  { to: '/admin/promises', key: 'promises', label: MODULE_LABELS.promises, icon: MODULE_ICONS.promises, group: 'content' },
  { to: '/admin/process-steps', key: 'process_steps', label: MODULE_LABELS.process_steps, icon: MODULE_ICONS.process_steps, group: 'content' },
  { to: '/admin/testimonials', key: 'testimonials', label: MODULE_LABELS.testimonials, icon: MODULE_ICONS.testimonials, group: 'content' },
  { to: '/admin/faqs', key: 'faqs', label: MODULE_LABELS.faqs, icon: MODULE_ICONS.faqs, group: 'content' },
  { to: '/admin/appointment-slots', key: 'appointment_slots', label: MODULE_LABELS.appointment_slots, icon: MODULE_ICONS.appointment_slots, group: 'system' },
  { to: '/admin/appointment-bookings', key: 'appointment_bookings', label: MODULE_LABELS.appointment_bookings, icon: MODULE_ICONS.appointment_bookings, group: 'system' },
  { to: '/admin/inquiries', key: 'inquiries', label: MODULE_LABELS.inquiries, icon: MODULE_ICONS.inquiries, group: 'system' },
  { to: '/admin/admins', key: 'admins', label: MODULE_LABELS.admins, icon: MODULE_ICONS.admins, group: 'system' },
  { to: '/admin/history', key: 'history', label: MODULE_LABELS.history, icon: MODULE_ICONS.history, group: 'system' },
]

const groupLabels: Record<'main' | 'content' | 'system', string> = {
  main: 'نمای کلی',
  content: 'محتوا',
  system: 'سیستم',
}

const user = computed(() => adminModule.store.getUser)

const visibleLinks = computed(() =>
  links.filter((link) => {
    if (link.key === 'home') return true
    return adminModule.controller.can(link.key, 'view')
  }),
)

const groupedLinks = computed(() => {
  const groups: { key: 'main' | 'content' | 'system'; label: string; items: typeof links }[] = []
  for (const key of ['main', 'content', 'system'] as const) {
    const items = visibleLinks.value.filter((link) => link.group === key)
    if (items.length) {
      groups.push({ key, label: groupLabels[key], items })
    }
  }
  return groups
})

const pageMeta = computed(() => resolveAdminPageMeta(route.path))

function isActive(to: string) {
  if (to === '/admin') return route.path === '/admin'
  return route.path === to || route.path.startsWith(`${to}/`)
}

function logout() {
  profileOpen.value = false
  open.value = false
  adminModule.controller.logout()
  navigateTo('/admin/login')
}

function runPageAction() {
  pageAction.value.onAction?.()
}

const { initSiteTheme } = useSiteTheme()

onMounted(() => {
  void initSiteTheme()
})

watch(
  () => route.path,
  () => {
    open.value = false
  },
)

useHead({
  title: () => `${pageMeta.value.title} | پنل مدیریت دکتر امیر رحمتی`,
})
</script>

<template>
  <div class="admin-shell min-h-screen overflow-x-clip bg-[#f4f2eb] text-ink" dir="rtl" lang="fa">
    <aside
      class="fixed inset-y-0 right-0 z-40 flex w-[min(17.5rem,88vw)] flex-col border-l border-mist bg-white shadow-[ -8px_0_30px_rgba(43,48,54,0.04)] transition-transform duration-300 lg:w-[17.5rem] lg:translate-x-0"
      :class="open ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'"
    >
      <div class="border-b border-mist px-4 pb-4 pt-5">
        <div class="flex items-center gap-3">
          <div class="relative">
            <img src="/images/logo.svg?v=2" alt="" class="size-11 rounded-2xl ring-1 ring-mist" width="44" height="44">
            <span class="absolute -bottom-0.5 -left-0.5 size-2.5 rounded-full bg-green-deep ring-2 ring-white" aria-hidden="true" />
          </div>
          <div class="min-w-0">
            <p class="truncate text-sm font-bold text-green-deep">دکتر امیر رحمتی</p>
            <p class="text-[11px] tracking-wide text-gold">پنل مدیریت محتوا</p>
          </div>
        </div>
      </div>

      <nav class="flex-1 space-y-5 overflow-y-auto px-3 py-4">
        <div v-for="group in groupedLinks" :key="group.key">
          <p class="mb-1.5 px-2 text-[10px] font-semibold tracking-[0.14em] text-ink-muted/80">
            {{ group.label }}
          </p>
          <div class="space-y-0.5">
            <NuxtLink
              v-for="link in group.items"
              :key="link.to"
              :to="link.to"
              class="group relative flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm transition"
              :class="isActive(link.to)
                ? 'bg-green-soft font-medium text-green-deep shadow-sm'
                : 'text-ink-muted hover:bg-mist hover:text-ink'"
              @click="open = false"
            >
              <span
                v-if="isActive(link.to)"
                class="absolute inset-y-2 right-0 w-1 rounded-l-full bg-green-deep"
                aria-hidden="true"
              />
              <span
                class="inline-flex size-8 shrink-0 items-center justify-center rounded-lg transition"
                :class="isActive(link.to) ? 'bg-white text-green-deep' : 'bg-transparent text-current group-hover:bg-white/70'"
              >
                <AdminIcon :src="link.icon" size="size-4" />
              </span>
              <span class="truncate">{{ link.label }}</span>
            </NuxtLink>
          </div>
        </div>
      </nav>

      <div class="border-t border-mist p-3">
        <AdminUserBadge
          class="w-full border-mist bg-[#f7faf8] px-2.5 py-2 hover:border-gold/35 hover:bg-white"
          :user="user"
          @click="profileOpen = true"
        />
      </div>
    </aside>

    <div
      v-if="open"
      class="fixed inset-0 z-30 bg-ink/40 backdrop-blur-[1px] lg:hidden"
      @click="open = false"
    />

    <div class="min-w-0 lg:pr-[17.5rem]">
      <header class="sticky top-0 z-30 border-b border-mist/80 bg-white/95 backdrop-blur-md">
        <div class="flex items-center gap-2 px-3 py-2.5 sm:gap-3 sm:px-4 lg:px-6">
          <button
            class="inline-flex size-9 shrink-0 items-center justify-center rounded-xl border border-mist bg-white text-ink transition hover:bg-mist lg:hidden"
            type="button"
            aria-label="منو"
            @click="open = !open"
          >
            <AdminIcon src="/icons/menu.svg" size="size-4" />
          </button>

          <div class="min-w-0 flex-1">
            <nav class="hidden items-center gap-1.5 text-[11px] text-ink-muted sm:flex" aria-label="مسیر صفحه">
              <NuxtLink to="/admin" class="transition hover:text-green-deep">پنل</NuxtLink>
              <span aria-hidden="true">/</span>
              <span class="truncate font-medium text-green-deep">{{ pageMeta.title }}</span>
            </nav>
            <h1 class="truncate text-[15px] font-semibold tracking-tight text-ink sm:mt-0.5 sm:text-base">
              {{ pageMeta.title }}
            </h1>
          </div>

          <div class="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <button
              v-if="pageAction.showAction"
              type="button"
              class="inline-flex items-center justify-center gap-1.5 rounded-xl bg-green-deep px-2.5 py-2 text-[12px] font-semibold text-on-primary shadow-sm transition hover:brightness-95 disabled:opacity-50 sm:px-3.5 sm:text-sm"
              :disabled="pageAction.disabled"
              @click="runPageAction"
            >
              <AdminIcon src="/icons/admin-plus.svg" size="size-3.5" />
              <span class="max-w-[7rem] truncate sm:max-w-none">{{ pageAction.actionLabel }}</span>
            </button>
            <NuxtLink
              to="/"
              target="_blank"
              class="hidden size-9 items-center justify-center rounded-xl border border-mist text-ink-muted transition hover:bg-mist hover:text-ink xl:inline-flex"
              title="مشاهده سایت"
              aria-label="مشاهده سایت"
            >
              <AdminIcon src="/icons/admin-file.svg" size="size-3.5" />
            </NuxtLink>
            <AdminUserBadge compact :user="user" @click="profileOpen = true" />
          </div>
        </div>
      </header>

      <main class="min-h-[calc(100vh-3.5rem)] overflow-x-clip p-3 sm:p-4 lg:px-6 lg:py-5">
        <p
          v-if="pageMeta.description"
          class="mb-3 hidden text-[13px] leading-6 text-ink-muted md:block"
        >
          {{ pageMeta.description }}
        </p>
        <slot />
      </main>
    </div>

    <AdminProfileModal
      :open="profileOpen"
      :user="user"
      @close="profileOpen = false"
      @logout="logout"
    />
    <AdminConfirmModal />
  </div>
</template>
