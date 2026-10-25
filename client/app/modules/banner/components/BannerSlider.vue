<script setup lang="ts">
import { bannerModule } from '~/modules'

const bannerDS = bannerModule.store
const bannerController = bannerModule.controller
const mediaSrc = useMediaSrc()
const activeIndex = ref(0)
const isHovered = ref(false)
let timer: ReturnType<typeof setInterval> | null = null

const slides = computed(() => bannerDS.getVisibleItems)
const loading = computed(() => bannerDS.getLoading)
const active = computed(() => slides.value[activeIndex.value] ?? null)

function goTo(index: number) {
  if (!slides.value.length) return
  activeIndex.value = (index + slides.value.length) % slides.value.length
}

function next() {
  goTo(activeIndex.value + 1)
}

function prev() {
  goTo(activeIndex.value - 1)
}

function startAutoplay() {
  stopAutoplay()
  if (slides.value.length < 2) return
  timer = setInterval(() => {
    if (!isHovered.value) next()
  }, 7000)
}

function stopAutoplay() {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

onMounted(async () => {
  await bannerController.getBannerList()
  if (slides.value.length) startAutoplay()
})

onBeforeUnmount(() => {
  stopAutoplay()
})

watch(
  () => slides.value.length,
  (length) => {
    if (length > 0) startAutoplay()
    else stopAutoplay()
  },
)
</script>

<template>
  <section
    class="relative overflow-hidden bg-mist"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <div
      class="pointer-events-none absolute -left-24 top-10 size-[28rem] rounded-full bg-green-deep/15 blur-3xl"
      aria-hidden="true"
    />
    <div
      class="pointer-events-none absolute -right-20 bottom-0 size-[22rem] rounded-full bg-band/10 blur-3xl"
      aria-hidden="true"
    />

    <div class="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
      <div
        v-if="loading && !slides.length"
        class="flex min-h-[28rem] items-center justify-center text-ink-muted"
      >
        در حال بارگذاری بنرها...
      </div>

      <div
        v-else-if="!slides.length"
        class="flex min-h-[22rem] items-center justify-center text-ink-muted"
      >
        بنری برای نمایش وجود ندارد.
      </div>

      <div
        v-else-if="active"
        class="grid items-center gap-8 lg:grid-cols-12 lg:gap-10"
      >
        <!-- Copy -->
        <div class="relative z-10 lg:col-span-5">
          <p class="text-[11px] font-semibold tracking-[0.28em] text-gold">
            امیر رحمتی
          </p>

          <div class="relative mt-5 min-h-[12.5rem] sm:min-h-[14rem]">
            <Transition name="home-slide" mode="out-in">
              <div :key="active.id">
                <p
                  v-if="active.displaySubtitle"
                  class="text-sm font-medium text-ink-muted"
                >
                  {{ active.displaySubtitle }}
                </p>
                <h1 class="mt-3 text-[1.85rem] font-bold leading-[1.35] tracking-tight text-ink sm:text-4xl lg:text-[2.65rem] lg:leading-[1.3]">
                  {{ active.displayTitle }}
                </h1>
                <p
                  v-if="active.displayDescription"
                  class="mt-5 max-w-md text-[15px] leading-8 text-ink-muted"
                >
                  {{ active.displayDescription }}
                </p>
              </div>
            </Transition>
          </div>

          <div class="mt-8 flex flex-wrap items-center gap-3">
            <NuxtLink
              v-if="active.hasButton1"
              :to="active.button1Link!"
              class="inline-flex items-center justify-center rounded-2xl bg-band px-5 py-3 text-sm font-semibold text-on-band transition hover:bg-green-deep hover:text-on-primary"
            >
              {{ active.button1Text }}
            </NuxtLink>
            <NuxtLink
              v-if="active.hasButton2"
              :to="active.button2Link!"
              class="inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-semibold text-ink ring-1 ring-band/15 transition hover:bg-panel"
            >
              {{ active.button2Text }}
            </NuxtLink>
            <NuxtLink
              v-else-if="active.link && !active.hasButton1"
              :to="active.link"
              class="inline-flex items-center justify-center rounded-2xl bg-band px-5 py-3 text-sm font-semibold text-on-band transition hover:bg-green-deep hover:text-on-primary"
            >
              بیشتر بدانید
            </NuxtLink>
          </div>

          <div
            v-if="slides.length > 1"
            class="mt-10 flex items-center gap-4"
          >
            <div class="flex items-center gap-2">
              <button
                type="button"
                class="inline-flex size-11 items-center justify-center rounded-full bg-panel text-2xl leading-none text-ink shadow-sm ring-1 ring-mist-deep transition hover:bg-band hover:text-on-band"
                aria-label="اسلاید قبلی"
                @click="prev"
              >
                ‹
              </button>
              <button
                type="button"
                class="inline-flex size-11 items-center justify-center rounded-full bg-panel text-2xl leading-none text-ink shadow-sm ring-1 ring-mist-deep transition hover:bg-band hover:text-on-band"
                aria-label="اسلاید بعدی"
                @click="next"
              >
                ›
              </button>
            </div>
            <div class="flex items-center gap-2">
              <button
                v-for="(slide, index) in slides"
                :key="`dot-${slide.id}`"
                type="button"
                class="h-1.5 rounded-full transition-all"
                :class="index === activeIndex ? 'w-8 bg-band' : 'w-2.5 bg-band/25 hover:bg-band/50'"
                :aria-label="`رفتن به اسلاید ${index + 1}`"
                @click="goTo(index)"
              />
            </div>
            <p class="ms-auto font-mono text-xs text-ink-muted">
              {{ String(activeIndex + 1).padStart(2, '0') }}
              <span class="text-ink/30">/</span>
              {{ String(slides.length).padStart(2, '0') }}
            </p>
          </div>
        </div>

        <!-- Media -->
        <div class="relative lg:col-span-7">
          <div class="absolute -inset-3 rounded-[2rem] bg-gradient-to-bl from-green-deep/25 via-transparent to-band/10 blur-2xl" aria-hidden="true" />
          <div class="relative overflow-hidden rounded-[1.75rem] bg-band shadow-[0_30px_80px_rgba(6,54,55,0.22)] ring-1 ring-band/10 sm:rounded-[2rem]">
            <div class="relative aspect-[4/5] overflow-hidden sm:aspect-[5/4] lg:aspect-[16/11]">
              <Transition name="home-slide" mode="out-in">
                <div
                  :key="active.id"
                  class="group absolute inset-0"
                >
                  <img
                    :src="mediaSrc(active.image)"
                    :alt="active.title"
                    class="banner-kenburns size-full object-cover"
                    width="1200"
                    height="825"
                    loading="eager"
                  >

                  <div class="absolute inset-0 bg-gradient-to-b from-band/55 via-band/10 to-band/60" />

                  <!-- Chip on top of image (no longer clipped below the frame) -->
                  <div class="absolute inset-x-0 top-0 z-[1] p-4 sm:p-6">
                    <div class="inline-flex max-w-[min(100%,20rem)] flex-col rounded-2xl bg-panel px-4 py-3 shadow-[0_12px_30px_rgba(6,54,55,0.18)] sm:px-5">
                      <p class="text-[11px] font-medium text-ink-muted">
                        مسیر روشن درمان
                      </p>
                      <p class="mt-0.5 text-sm font-semibold leading-6 text-ink">
                        از معاینه تا لبخند سالم
                      </p>
                    </div>
                  </div>

                  <div class="absolute inset-x-0 bottom-0 z-[1] flex items-end justify-between gap-4 p-5 sm:p-7">
                    <div class="max-w-sm">
                      <p class="text-[11px] font-medium tracking-[0.18em] text-gold">
                        کلینیک دندان‌پزشکی امیر رحمتی
                      </p>
                      <p class="mt-2 line-clamp-2 text-base font-semibold text-on-band sm:text-lg">
                        {{ active.displayTitle }}
                      </p>
                    </div>
                    <span class="hidden rounded-full bg-white/15 px-3 py-1.5 text-[11px] font-medium text-on-band backdrop-blur sm:inline-flex">
                      مراقبت تخصصی
                    </span>
                  </div>
                </div>
              </Transition>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
