<script setup lang="ts">
import { serviceModule } from '~/modules'
import { useSiteTheme } from '~/composables/useSiteTheme'
import type { NavLink } from './MobileNav.vue'

const route = useRoute()
const { openPicker } = useSiteTheme()
const menuOpen = ref(false)
const scrolled = ref(false)
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
  { label: 'نمونه کارها', to: '/portfolio', icon: '/icons/portfolio.svg' },
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
  const y = Math.max(0, window.scrollY)
  scrolled.value = y > 12

  if (keepHeaderPinned.value) {
    headerHidden.value = false
    lastY = y
    ticking = false
    return
  }

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
  scrolled.value = lastY > 12
  window.addEventListener('scroll', onScroll, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<template>
  <header
    class="site-header sticky top-0 z-40 transition-[transform,background-color,box-shadow,border-color] duration-300 ease-out"
    :class="[
      headerHidden ? '-translate-y-full pointer-events-none' : 'translate-y-0',
      scrolled ? 'site-header--scrolled' : 'site-header--top',
    ]"
  >
    <!-- Mobile: logo+text right · hamburger left · no CTA -->
    <div class="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2.5 sm:px-6 min-[1440px]:hidden">
      <NuxtLink
        to="/"
        class="group flex min-w-0 items-center gap-2.5"
        aria-label="صفحه اصلی کلینیک امیر رحمتی"
        @click="closeMenu"
      >
        <span class="site-header__logo-ring inline-flex size-10 shrink-0 items-center justify-center rounded-2xl bg-panel shadow-sm ring-1 ring-mist/80 transition group-hover:ring-green-deep/35">
          <img
            src="/images/logo.svg?v=2"
            alt="لوگوی کلینیک دندان‌پزشکی امیر رحمتی"
            class="size-7"
            width="28"
            height="28"
          >
        </span>
        <div class="min-w-0 leading-tight">
          <p class="truncate text-sm font-bold tracking-tight text-green-deep">
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
          class="inline-flex size-11 shrink-0 items-center justify-center rounded-xl text-ink transition-colors duration-150 hover:bg-mist/80"
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
    <div class="mx-auto hidden w-full max-w-7xl items-center gap-3 px-4 py-2.5 min-[1440px]:flex 2xl:gap-5 2xl:px-8">
      <NuxtLink
        to="/"
        class="group flex min-w-0 shrink-0 items-center gap-3"
        aria-label="صفحه اصلی کلینیک امیر رحمتی"
      >
        <span class="site-header__logo-ring inline-flex size-11 shrink-0 items-center justify-center rounded-2xl bg-panel shadow-sm ring-1 ring-mist/80 transition group-hover:ring-green-deep/35">
          <img
            src="/images/logo.svg?v=2"
            alt="لوگوی کلینیک دندان‌پزشکی امیر رحمتی"
            class="size-8"
            width="32"
            height="32"
          >
        </span>
        <div class="min-w-0 leading-tight">
          <p class="text-sm font-bold tracking-tight text-green-deep 2xl:text-[15px]">
            امیر رحمتی
          </p>
          <p class="hidden truncate text-xs text-ink-muted 2xl:block">
            کلینیک دندان‌پزشکی
          </p>
        </div>
      </NuxtLink>

      <nav class="min-w-0 flex-1" aria-label="منوی اصلی">
        <ul class="flex flex-wrap items-center justify-center gap-x-0.5 gap-y-1">
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
              class="site-header__link relative inline-flex whitespace-nowrap rounded-full px-2.5 py-2 text-[13px] font-medium transition-colors duration-150 min-[1440px]:px-3 min-[1440px]:text-sm"
              :class="isActive(link.to)
                ? 'site-header__link--active text-green-deep'
                : 'text-ink-muted hover:bg-mist/70 hover:text-ink'"
            >
              {{ link.label }}
            </NuxtLink>
          </li>
        </ul>
      </nav>

      <div class="flex shrink-0 items-center gap-2">
        <ThemeIconButton
          class="rounded-full border border-mist/80 bg-panel/80 hover:border-green-deep/35"
          @click="openPicker"
        />
        <NuxtLink
          to="/consultation"
          class="inline-flex shrink-0 items-center justify-center rounded-full bg-green-deep px-4 py-2.5 text-sm font-bold tracking-wide text-on-primary shadow-[0_10px_28px_color-mix(in_srgb,var(--color-green-deep)_38%,transparent)] ring-1 ring-on-primary/15 transition duration-200 hover:-translate-y-0.5 hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold 2xl:px-5"
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
