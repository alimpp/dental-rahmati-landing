<script setup lang="ts">
import type { ServiceModel } from '~/modules/service/models/index.model'
import type { NavLink } from './MobileNav.vue'

const props = defineProps<{
  link: NavLink
  items: ServiceModel[]
  /** Full catalog size (menu may show only a subset). */
  totalCount?: number
  active: boolean
}>()

const catalogCount = computed(() => props.totalCount ?? props.items.length)
const hasMore = computed(() => catalogCount.value > props.items.length)

const emit = defineEmits<{
  open: [value: boolean]
}>()

const route = useRoute()
const mediaSrc = useMediaSrc()
const trigger = ref<HTMLElement | null>(null)
const open = ref(false)
const panel = reactive({ top: 0, left: 0, width: 0 })
let hideTimer: ReturnType<typeof setTimeout> | null = null

function placePanel() {
  if (!import.meta.client || !trigger.value) return
  const rect = trigger.value.getBoundingClientRect()
  const gutter = 12
  const width = Math.min(560, Math.max(280, window.innerWidth - gutter * 2))
  let left = rect.right - width
  left = Math.min(Math.max(gutter, left), window.innerWidth - width - gutter)
  panel.top = rect.bottom + 8
  panel.left = left
  panel.width = width
}

watch(
  () => route.fullPath,
  () => {
    open.value = false
  },
)

watch(open, async (value) => {
  emit('open', value)
  if (!value) return
  await nextTick()
  placePanel()
})

function show() {
  if (hideTimer) {
    clearTimeout(hideTimer)
    hideTimer = null
  }
  open.value = true
}

function hide() {
  if (hideTimer) clearTimeout(hideTimer)
  hideTimer = setTimeout(() => {
    open.value = false
  }, 50)
}

function isChildActive(href: string) {
  return route.path === href
}

function onKey(event: KeyboardEvent) {
  if (event.key === 'Escape') open.value = false
}

function onReposition() {
  if (open.value) placePanel()
}

onMounted(() => {
  window.addEventListener('keydown', onKey)
  window.addEventListener('resize', onReposition)
  window.addEventListener('scroll', onReposition, true)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey)
  window.removeEventListener('resize', onReposition)
  window.removeEventListener('scroll', onReposition, true)
  if (hideTimer) clearTimeout(hideTimer)
})
</script>

<template>
  <div
    ref="trigger"
    class="relative"
    @mouseenter="show"
    @mouseleave="hide"
  >
    <div class="flex items-center">
      <NuxtLink
        :to="link.to"
        class="whitespace-nowrap rounded-md px-2 py-2 text-[13px] font-medium transition-colors duration-100 ease-out min-[1440px]:px-3 min-[1440px]:text-sm"
        :class="active
          ? 'bg-mist text-green-deep'
          : 'text-ink hover:bg-mist hover:text-green-deep'"
        :aria-expanded="open"
        aria-haspopup="true"
        aria-controls="practice-mega"
      >
        {{ link.label }}
      </NuxtLink>
      <button
        v-if="items.length"
        class="ms-[-6px] inline-flex size-8 items-center justify-center rounded-md text-ink-muted transition-colors duration-100 ease-out hover:bg-mist hover:text-green-deep"
        type="button"
        :aria-expanded="open"
        aria-controls="practice-mega"
        aria-label="زیرمنوی خدمات"
        @click.stop="open = !open"
      >
        <span
          class="inline-block size-5 bg-current transition-transform duration-150 ease-out"
          :class="open ? 'rotate-180' : ''"
          :style="{
            maskImage: 'url(/icons/admin-chevron.svg)',
            WebkitMaskImage: 'url(/icons/admin-chevron.svg)',
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

    <Teleport to="body">
      <Transition name="practice-mega">
        <div
          v-if="open && items.length"
          id="practice-mega"
          class="fixed z-[80]"
          role="menu"
          :style="{ top: `${panel.top}px`, left: `${panel.left}px`, width: `${panel.width}px` }"
          @mouseenter="show"
          @mouseleave="hide"
        >
          <div class="practice-mega-panel overflow-hidden rounded-[1.6rem] border border-mist bg-panel shadow-[0_28px_70px_rgba(43,48,54,0.16)]">
            <div class="h-1.5 w-full bg-gradient-to-l from-gold via-green-deep to-green-soft" />
            <div class="bg-[radial-gradient(ellipse_at_top_right,rgba(201,235,216,0.45),transparent_55%)] p-3.5">
              <div class="mb-2 flex items-center justify-between px-2">
                <p class="text-[11px] font-semibold tracking-wide text-gold">
                  انتخاب خدمت
                </p>
                <span class="text-[11px] text-ink-muted">
                  {{ hasMore ? `${items.length} از ${catalogCount}` : `${items.length} خدمت` }}
                </span>
              </div>
              <ul class="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                <li v-for="item in items" :key="item.id">
                  <NuxtLink
                    :to="item.href"
                    class="group flex h-full items-start gap-3 rounded-2xl p-3 transition-colors duration-100 ease-out"
                    :class="isChildActive(item.href)
                      ? 'bg-green-soft text-green-deep'
                      : 'hover:bg-mist'"
                    role="menuitem"
                    @click="open = false"
                  >
                    <span
                      class="inline-flex size-12 shrink-0 items-center justify-center rounded-xl transition-colors duration-100 ease-out"
                      :class="isChildActive(item.href) ? 'bg-panel' : 'bg-mist group-hover:bg-green-soft'"
                      aria-hidden="true"
                    >
                      <span
                        class="inline-block size-7 bg-green-deep"
                        :style="{
                          maskImage: `url(${mediaSrc(item.icon)})`,
                          WebkitMaskImage: `url(${mediaSrc(item.icon)})`,
                          maskRepeat: 'no-repeat',
                          WebkitMaskRepeat: 'no-repeat',
                          maskPosition: 'center',
                          WebkitMaskPosition: 'center',
                          maskSize: 'contain',
                          WebkitMaskSize: 'contain',
                        }"
                      />
                    </span>
                    <span class="min-w-0">
                      <span class="block text-sm font-semibold text-ink group-hover:text-green-deep">
                        {{ item.title }}
                      </span>
                      <span class="mt-0.5 block line-clamp-2 text-[11px] leading-5 text-ink-muted">
                        {{ item.description }}
                      </span>
                    </span>
                  </NuxtLink>
                </li>
              </ul>
              <NuxtLink
                :to="link.to"
                class="mt-2 flex items-center justify-between rounded-2xl bg-mist/80 px-4 py-2.5 text-sm font-semibold text-green-deep transition-colors duration-100 ease-out hover:bg-green-soft"
                @click="open = false"
              >
                مشاهده همه خدمات
                <span class="text-lg leading-none" aria-hidden="true">←</span>
              </NuxtLink>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
