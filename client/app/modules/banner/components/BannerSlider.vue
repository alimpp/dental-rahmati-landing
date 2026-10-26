<script setup lang="ts">
import { bannerModule } from '~/modules'

const bannerDS = bannerModule.store
const bannerController = bannerModule.controller
const mediaSrc = useMediaSrc()
const activeIndex = ref(0)
const isHovered = ref(false)
const isVisible = ref(true)
const reducedMotion = ref(false)
const touchStartX = ref<number | null>(null)
let timer: ReturnType<typeof setInterval> | null = null

const slides = computed(() => bannerDS.getVisibleItems)
const loading = computed(() => bannerDS.getLoading)
const active = computed(() => slides.value[activeIndex.value] ?? null)
const nextSlide = computed(() => {
  if (slides.value.length < 2) return null
  return slides.value[(activeIndex.value + 1) % slides.value.length] ?? null
})

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
  if (slides.value.length < 2 || reducedMotion.value) return
  timer = setInterval(() => {
    if (!isHovered.value && isVisible.value) next()
  }, 6500)
}

function stopAutoplay() {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

function onVisibility() {
  isVisible.value = document.visibilityState === 'visible'
  if (isVisible.value) startAutoplay()
  else stopAutoplay()
}

function onTouchStart(event: TouchEvent) {
  touchStartX.value = event.changedTouches[0]?.clientX ?? null
}

function onTouchEnd(event: TouchEvent) {
  const start = touchStartX.value
  const end = event.changedTouches[0]?.clientX
  touchStartX.value = null
  if (start == null || end == null || slides.value.length < 2) return
  const delta = end - start
  if (Math.abs(delta) < 48) return
  // RTL: swipe right → previous visual slide feels natural as next content
  if (delta > 0) next()
  else prev()
}

onMounted(async () => {
  if (import.meta.client) {
    reducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    document.addEventListener('visibilitychange', onVisibility)
  }
  await bannerController.getBannerList()
  if (slides.value.length) startAutoplay()
})

onBeforeUnmount(() => {
  stopAutoplay()
  if (import.meta.client) {
    document.removeEventListener('visibilitychange', onVisibility)
  }
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
    class="banner-hero relative isolate overflow-hidden bg-band text-on-band"
    aria-roledescription="carousel"
    :aria-label="active?.displayTitle || 'بنر اصلی'"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
    @touchstart.passive="onTouchStart"
    @touchend.passive="onTouchEnd"
  >
    <!-- Full-bleed media plane -->
    <div class="absolute inset-0" aria-hidden="true">
      <div
        v-if="loading && !slides.length"
        class="size-full animate-pulse bg-green-deep/40"
      />
      <template v-else-if="active">
        <Transition name="banner-cross">
          <img
            :key="active.id"
            :src="mediaSrc(active.image)"
            :alt="active.title"
            class="banner-kenburns absolute inset-0 size-full object-cover"
            width="1920"
            height="1080"
            decoding="async"
            fetchpriority="high"
            loading="eager"
          >
        </Transition>
        <!-- Prefetch next for snappy slide change -->
        <img
          v-if="nextSlide"
          :src="mediaSrc(nextSlide.image)"
          alt=""
          class="pointer-events-none absolute size-0 opacity-0"
          width="1"
          height="1"
          decoding="async"
          aria-hidden="true"
        >
      </template>
      <div
        v-else
        class="flex size-full items-center justify-center bg-band text-on-band/70"
      >
        بنری برای نمایش وجود ندارد.
      </div>

      <!-- Theme-safe readability scrim (no chips / overlays) -->
      <div class="banner-hero__scrim absolute inset-0" />
    </div>

    <!-- Content -->
    <div
      v-if="active"
      class="relative z-10 mx-auto flex min-h-[min(92svh,44rem)] w-full max-w-7xl flex-col justify-end px-4 pb-10 pt-24 sm:min-h-[min(88svh,48rem)] sm:px-6 sm:pb-14 sm:pt-28 lg:min-h-[min(86svh,52rem)] lg:justify-center lg:px-8 lg:pb-20 lg:pt-16"
    >
      <div class="max-w-2xl">
        <p class="banner-hero__brand text-sm font-bold tracking-[0.18em] text-gold sm:text-base">
          امیر رحمتی
        </p>

        <Transition name="banner-copy" mode="out-in">
          <div :key="active.id" class="mt-4 sm:mt-5">
            <p
              v-if="active.displaySubtitle"
              class="text-sm font-medium text-on-band/75 sm:text-[15px]"
            >
              {{ active.displaySubtitle }}
            </p>
            <h1 class="mt-2 text-[1.85rem] font-bold leading-[1.25] tracking-tight text-on-band sm:mt-3 sm:text-4xl lg:text-[3.15rem] lg:leading-[1.18]">
              {{ active.displayTitle }}
            </h1>
            <p
              v-if="active.displayDescription"
              class="mt-4 max-w-xl text-[15px] leading-8 text-on-band/80 sm:mt-5 sm:text-base sm:leading-8"
            >
              {{ active.displayDescription }}
            </p>
          </div>
        </Transition>

        <div class="mt-7 flex flex-wrap items-center gap-3 sm:mt-9">
          <NuxtLink
            v-if="active.hasButton1"
            :to="active.button1Link!"
            class="banner-hero__cta inline-flex min-h-11 items-center justify-center rounded-full bg-green-deep px-6 py-3 text-sm font-bold text-on-primary shadow-[0_14px_36px_color-mix(in_srgb,var(--color-green-deep)_45%,transparent)] transition duration-200 hover:-translate-y-0.5 hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
          >
            {{ active.button1Text }}
          </NuxtLink>
          <NuxtLink
            v-if="active.hasButton2"
            :to="active.button2Link!"
            class="inline-flex min-h-11 items-center justify-center rounded-full px-6 py-3 text-sm font-semibold text-on-band ring-1 ring-on-band/35 backdrop-blur-sm transition duration-200 hover:bg-on-band/10 hover:ring-on-band/55 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
          >
            {{ active.button2Text }}
          </NuxtLink>
          <NuxtLink
            v-else-if="active.link && !active.hasButton1"
            :to="active.link"
            class="banner-hero__cta inline-flex min-h-11 items-center justify-center rounded-full bg-green-deep px-6 py-3 text-sm font-bold text-on-primary shadow-[0_14px_36px_color-mix(in_srgb,var(--color-green-deep)_45%,transparent)] transition duration-200 hover:-translate-y-0.5 hover:brightness-110"
          >
            بیشتر بدانید
          </NuxtLink>
        </div>
      </div>

      <!-- Controls -->
      <div
        v-if="slides.length > 1"
        class="mt-10 flex items-center gap-4 lg:mt-14"
      >
        <div class="flex items-center gap-2">
          <button
            type="button"
            class="inline-flex size-10 items-center justify-center rounded-full bg-on-band/10 text-lg text-on-band ring-1 ring-on-band/20 backdrop-blur-md transition hover:bg-on-band/20 sm:size-11"
            aria-label="اسلاید قبلی"
            @click="prev"
          >
            ‹
          </button>
          <button
            type="button"
            class="inline-flex size-10 items-center justify-center rounded-full bg-on-band/10 text-lg text-on-band ring-1 ring-on-band/20 backdrop-blur-md transition hover:bg-on-band/20 sm:size-11"
            aria-label="اسلاید بعدی"
            @click="next"
          >
            ›
          </button>
        </div>

        <div class="flex items-center gap-2" role="tablist" aria-label="انتخاب اسلاید">
          <button
            v-for="(slide, index) in slides"
            :key="`dot-${slide.id}`"
            type="button"
            role="tab"
            class="banner-hero__dot h-1.5 rounded-full transition-all duration-300"
            :class="index === activeIndex
              ? 'w-9 bg-gold'
              : 'w-2.5 bg-on-band/35 hover:bg-on-band/55'"
            :aria-selected="index === activeIndex"
            :aria-label="`رفتن به اسلاید ${index + 1}`"
            @click="goTo(index)"
          />
        </div>

        <p class="ms-auto font-mono text-[11px] tracking-wider text-on-band/55 sm:text-xs">
          {{ String(activeIndex + 1).padStart(2, '0') }}
          <span class="text-on-band/30">/</span>
          {{ String(slides.length).padStart(2, '0') }}
        </p>
      </div>
    </div>
  </section>
</template>
