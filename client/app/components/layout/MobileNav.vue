<script setup lang="ts">
import type { ServiceModel } from '~/modules/service/models/index.model'

export type NavLink = {
  label: string
  to: string
  icon: string
}

const props = defineProps<{
  open: boolean
  links: readonly NavLink[]
  practiceItems?: ServiceModel[]
  practiceTotal?: number
}>()

const practiceHasMore = computed(
  () => (props.practiceTotal ?? 0) > (props.practiceItems?.length ?? 0),
)

const emit = defineEmits<{
  close: []
}>()

const route = useRoute()
const mediaSrc = useMediaSrc()
const practiceOpen = ref(false)

function isActive(path: string) {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}

function isChildActive(href: string) {
  return route.path === href
}

watch(
  () => route.fullPath,
  () => {
    if (props.open) emit('close')
  },
)

watch(
  () => props.open,
  (isOpen) => {
    if (!import.meta.client) return
    document.body.style.overflow = isOpen ? 'hidden' : ''
    if (!isOpen) {
      practiceOpen.value = false
      return
    }
    if (route.path.startsWith('/practice-areas')) practiceOpen.value = true
  },
)

onBeforeUnmount(() => {
  if (!import.meta.client) return
  document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <div class="min-[1440px]:hidden">
      <Transition
        enter-active-class="transition duration-150 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-100 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <button
          v-if="open"
          type="button"
          class="fixed inset-0 z-50 bg-ink/40"
          aria-label="بستن منو"
          @click="emit('close')"
        />
      </Transition>

      <Transition
        enter-active-class="transition duration-150 ease-out"
        enter-from-class="translate-y-full"
        enter-to-class="translate-y-0"
        leave-active-class="transition duration-100 ease-in"
        leave-from-class="translate-y-0"
        leave-to-class="translate-y-full"
      >
        <nav
          v-if="open"
          id="mobile-nav"
          class="fixed inset-x-0 bottom-0 z-50 flex h-[70vh] flex-col rounded-t-3xl bg-surface shadow-[0_-8px_30px_rgba(43,48,54,0.16)]"
          aria-label="منوی موبایل"
          role="dialog"
          aria-modal="true"
        >
          <div class="flex shrink-0 items-center justify-between border-b border-mist px-4 py-3">
            <p class="text-sm font-semibold text-green-deep">
              منو
            </p>
            <button
              type="button"
              class="inline-flex size-10 items-center justify-center rounded-md text-ink transition-colors duration-100 ease-out hover:bg-mist"
              aria-label="بستن منو"
              @click="emit('close')"
            >
              <span
                class="inline-block size-5 bg-ink"
                :style="{
                  maskImage: 'url(/icons/close.svg)',
                  WebkitMaskImage: 'url(/icons/close.svg)',
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

          <ul class="flex-1 overflow-y-auto px-3 py-2">
            <li v-for="link in links" :key="link.to">
              <template v-if="link.to === '/practice-areas' && practiceItems?.length">
                <div
                  class="flex items-center rounded-xl transition-colors duration-100 ease-out"
                  :class="isActive(link.to) ? 'bg-mist text-green-deep' : 'text-ink'"
                >
                  <NuxtLink
                    :to="link.to"
                    class="flex min-w-0 flex-1 items-center gap-3 px-3 py-3.5 text-sm font-medium"
                    @click="emit('close')"
                  >
                    <span
                      class="inline-block size-5 shrink-0"
                      :class="isActive(link.to) ? 'bg-green-deep' : 'bg-ink-muted'"
                      :style="{
                        maskImage: `url(${link.icon})`,
                        WebkitMaskImage: `url(${link.icon})`,
                        maskRepeat: 'no-repeat',
                        WebkitMaskRepeat: 'no-repeat',
                        maskPosition: 'center',
                        WebkitMaskPosition: 'center',
                        maskSize: 'contain',
                        WebkitMaskSize: 'contain',
                      }"
                      aria-hidden="true"
                    />
                    <span>{{ link.label }}</span>
                  </NuxtLink>
                  <button
                    class="me-1 inline-flex size-10 items-center justify-center rounded-lg text-ink-muted transition-colors duration-100 ease-out hover:bg-white"
                    type="button"
                    :aria-expanded="practiceOpen"
                    aria-label="نمایش خدمات"
                    @click="practiceOpen = !practiceOpen"
                  >
                    <span
                      class="inline-block size-5 bg-current transition-transform duration-150 ease-out"
                      :class="practiceOpen ? 'rotate-180' : ''"
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
                <Transition name="practice-mega">
                  <ul v-if="practiceOpen" class="mb-2 mr-4 space-y-1 border-r border-green-soft pr-3">
                    <li v-for="item in practiceItems" :key="item.id">
                      <NuxtLink
                        :to="item.href"
                        class="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors duration-100 ease-out"
                        :class="isChildActive(item.href)
                          ? 'bg-green-soft text-green-deep'
                          : 'text-ink-muted hover:bg-mist hover:text-green-deep'"
                        @click="emit('close')"
                      >
                        <span
                          class="inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-mist"
                          aria-hidden="true"
                        >
                          <span
                            class="inline-block size-4 bg-green-deep"
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
                        <span class="font-medium">{{ item.title }}</span>
                      </NuxtLink>
                    </li>
                    <li v-if="practiceHasMore">
                      <NuxtLink
                        to="/practice-areas"
                        class="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold text-green-deep transition-colors duration-100 ease-out hover:bg-mist"
                        @click="emit('close')"
                      >
                        مشاهده همه خدمات
                        <span class="text-lg leading-none" aria-hidden="true">←</span>
                      </NuxtLink>
                    </li>
                  </ul>
                </Transition>
              </template>
              <NuxtLink
                v-else
                :to="link.to"
                class="flex items-center gap-3 rounded-xl px-3 py-3.5 text-sm font-medium transition-colors duration-100 ease-out"
                :class="isActive(link.to)
                  ? 'bg-mist text-green-deep'
                  : 'text-ink hover:bg-mist hover:text-green-deep'"
                @click="emit('close')"
              >
                <span
                  class="inline-block size-5 shrink-0"
                  :class="isActive(link.to) ? 'bg-green-deep' : 'bg-ink-muted'"
                  :style="{
                    maskImage: `url(${link.icon})`,
                    WebkitMaskImage: `url(${link.icon})`,
                    maskRepeat: 'no-repeat',
                    WebkitMaskRepeat: 'no-repeat',
                    maskPosition: 'center',
                    WebkitMaskPosition: 'center',
                    maskSize: 'contain',
                    WebkitMaskSize: 'contain',
                  }"
                  aria-hidden="true"
                />
                <span>{{ link.label }}</span>
              </NuxtLink>
            </li>
          </ul>

          <div class="shrink-0 border-t border-mist p-4">
            <NuxtLink
              to="/consultation"
              class="flex w-full items-center justify-center rounded-xl bg-green-deep px-4 py-3 text-sm font-semibold text-ink transition-colors duration-100 ease-out hover:bg-green-deep/90"
              @click="emit('close')"
            >
              رزرو نوبت
            </NuxtLink>
          </div>
        </nav>
      </Transition>
    </div>
  </Teleport>
</template>
