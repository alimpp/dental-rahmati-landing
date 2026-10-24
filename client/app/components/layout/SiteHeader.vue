<script setup lang="ts">
import { serviceModule } from '~/modules'
import { useSiteTheme } from '~/composables/useSiteTheme'
import type { NavLink } from './MobileNav.vue'

const route = useRoute()
const { openPicker } = useSiteTheme()
const menuOpen = ref(false)
const practiceItems = computed(() => serviceModule.store.getVisibleItems)
/** Header/mega/mobile menu: first 6 only; full list lives on /practice-areas */
const practiceMenuItems = computed(() => practiceItems.value.slice(0, 6))

async function loadPracticeAreas() {
  if (!practiceItems.value.length) {
    await serviceModule.controller.getServiceList()
  }
}

if (import.meta.server) {
  await loadPracticeAreas()
}
onMounted(loadPracticeAreas)

const links: NavLink[] = [
  { label: 'خانه', to: '/', icon: '/icons/home.svg' },
  { label: 'کلینیک ما', to: '/clinic', icon: '/icons/about.svg' },
  { label: 'خدمات', to: '/practice-areas', icon: '/icons/practice.svg' },
  { label: 'مقالات', to: '/articles', icon: '/icons/articles.svg' },
  { label: 'کاتالوگ', to: '/catalog', icon: '/icons/catalog.svg' },
  { label: 'درباره ما', to: '/about', icon: '/icons/about.svg' },
  { label: 'راهنماها', to: '/guides', icon: '/icons/articles.svg' },
  { label: 'تماس با ما', to: '/contact', icon: '/icons/contact.svg' },
]

function isActive(path: string) {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}

const headerHidden = ref(false)
const megaOpen = ref(false)
/** در صفحه کلینیک هدر همیشه ثابت بماند */
const keepHeaderPinned = computed(() => route.path.startsWith('/clinic'))
let lastY = 0
let ticking = false

function toggleMenu() {
  menuOpen.value = !menuOpen.value
}

function closeMenu() {
  menuOpen.value = false
}

function onMegaOpen(isOpen: boolean) {
  megaOpen.value = isOpen
  if (isOpen) headerHidden.value = false
}

function updateHeaderVisibility() {
  if (keepHeaderPinned.value) {
    headerHidden.value = false
    lastY = Math.max(0, window.scrollY)
    ticking = false
    return
  }

  const y = Math.max(0, window.scrollY)
  const delta = y - lastY

  if (menuOpen.value || megaOpen.value || y < 64) {
    headerHidden.value = false
  }
  else if (delta < -2) {
    headerHidden.value = false
  }
  else if (delta > 8) {
    headerHidden.value = true
  }

  lastY = y
  ticking = false
}

function onScroll() {
  if (ticking) return
  ticking = true
  requestAnimationFrame(updateHeaderVisibility)
}

watch(
  () => route.fullPath,
  () => {
    menuOpen.value = false
    headerHidden.value = false
  },
)

watch(keepHeaderPinned, (pinned) => {
  if (pinned) headerHidden.value = false
})

watch(menuOpen, (open) => {
  if (open) headerHidden.value = false
})

onMounted(() => {
  lastY = window.scrollY
  window.addEventListener('scroll', onScroll, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<template>
  <header
    class="sticky top-0 z-40 border-b border-mist bg-surface shadow-[0_4px_18px_rgba(15,118,110,0.10)] transition-[transform] duration-200 ease-out"
    :class="headerHidden ? '-translate-y-full pointer-events-none' : 'translate-y-0'"
  >
    <!-- Mobile: logo+text right · hamburger left · no CTA -->
    <div class="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 min-[1440px]:hidden">
      <NuxtLink
        to="/"
        class="flex min-w-0 items-center gap-2.5"
        aria-label="صفحه اصلی کلینیک امیر رحمتی"
        @click="closeMenu"
      >
        <img
          src="/images/logo.svg?v=2"
          alt="لوگوی کلینیک دندان‌پزشکی امیر رحمتی"
          class="size-10 shrink-0 rounded-xl"
          width="40"
          height="40"
        >
        <div class="min-w-0 leading-tight">
          <p class="truncate text-sm font-bold text-green-deep">
            امیر رحمتی
          </p>
          <p class="truncate text-[11px] text-ink-muted">
            کلینیک دندان‌پزشکی
          </p>
        </div>
      </NuxtLink>

      <div class="flex shrink-0 items-center gap-1">
        <ThemeIconButton @click="openPicker" />
      <button
        type="button"
        class="inline-flex size-11 shrink-0 items-center justify-center rounded-md text-ink transition-colors duration-100 ease-out hover:bg-mist"
        :aria-expanded="menuOpen"
        aria-controls="mobile-nav"
        :aria-label="menuOpen ? 'بستن منو' : 'باز کردن منو'"
        @click="toggleMenu"
      >
        <span
          class="inline-block size-6 bg-ink"
          :style="{
            maskImage: `url(${menuOpen ? '/icons/close.svg' : '/icons/menu.svg'})`,
            WebkitMaskImage: `url(${menuOpen ? '/icons/close.svg' : '/icons/menu.svg'})`,
            maskRepeat: 'no-repeat',
            WebkitMaskRepeat: 'no-repeat',
            maskPosition: 'center',
            WebkitMaskPosition: 'center',
            maskSize: 'contain',
            WebkitMaskSize: 'contain',
          }"
          aria-hidden="true"
        />
      </button>
      </div>
    </div>

    <!-- Desktop -->
    <div class="mx-auto hidden w-full max-w-7xl items-center gap-3 px-4 py-3 min-[1440px]:flex 2xl:gap-6 2xl:px-8">
      <NuxtLink
        to="/"
        class="flex min-w-0 shrink-0 items-center gap-3"
        aria-label="صفحه اصلی کلینیک امیر رحمتی"
      >
        <img
          src="/images/logo.svg?v=2"
          alt="لوگوی کلینیک دندان‌پزشکی امیر رحمتی"
          class="size-10 rounded-xl 2xl:size-11"
          width="44"
          height="44"
        >
        <div class="min-w-0 leading-tight">
          <p class="text-sm font-bold text-green-deep 2xl:text-base">
            امیر رحمتی
          </p>
          <p class="hidden truncate text-xs text-ink-muted 2xl:block">
            کلینیک دندان‌پزشکی
          </p>
        </div>
      </NuxtLink>

      <nav class="min-w-0 flex-1" aria-label="منوی اصلی">
        <ul class="flex flex-wrap items-center justify-center gap-x-1 gap-y-1">
          <li v-for="link in links" :key="link.to">
            <LayoutPracticeMegaMenu
              v-if="link.to === '/practice-areas'"
              :link="link"
              :items="practiceMenuItems"
              :total-count="practiceItems.length"
              :active="isActive(link.to)"
              @open="onMegaOpen"
            />
            <NuxtLink
              v-else
              :to="link.to"
              class="inline-flex whitespace-nowrap rounded-md px-2 py-2 text-[13px] font-medium transition-colors duration-100 ease-out min-[1440px]:px-3 min-[1440px]:text-sm"
              :class="isActive(link.to)
                ? 'bg-mist text-green-deep'
                : 'text-ink hover:bg-mist hover:text-green-deep'"
            >
              {{ link.label }}
            </NuxtLink>
          </li>
        </ul>
      </nav>

      <div class="flex shrink-0 items-center gap-2">
        <ThemeIconButton
          class="border border-mist bg-panel hover:border-green-deep/40"
          @click="openPicker"
        />
        <NuxtLink
          to="/consultation"
          class="inline-flex shrink-0 items-center justify-center rounded-xl bg-green-deep px-3.5 py-2.5 text-sm font-bold tracking-wide text-on-primary shadow-[0_8px_22px_rgba(15,118,110,0.35)] ring-1 ring-white/25 transition duration-150 ease-out hover:-translate-y-0.5 hover:brightness-110 2xl:px-5 2xl:py-2.5"
        >
          رزرو نوبت
        </NuxtLink>
      </div>
    </div>

    <LayoutMobileNav
      :open="menuOpen"
      :links="links"
      :practice-items="practiceMenuItems"
      :practice-total="practiceItems.length"
      @close="closeMenu"
    />
  </header>
</template>
