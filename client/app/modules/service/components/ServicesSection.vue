<script setup lang="ts">
import { serviceModule } from '~/modules'

const serviceDS = serviceModule.store
const serviceController = serviceModule.controller
const items = computed(() => serviceDS.getVisibleItems)
const mediaSrc = useMediaSrc()
const loading = computed(() => serviceDS.getLoading)

const active = ref(0)
const sectionRef = ref<HTMLElement | null>(null)
const stageRef = ref<HTMLElement | null>(null)
const railRef = ref<HTMLElement | null>(null)
const isCompact = ref(false)
const inView = ref(false)
const tilt = reactive({ x: 0, y: 0 })
let timer: ReturnType<typeof setInterval> | null = null
let dragStartX = 0
let dragging = false
let mediaQuery: MediaQueryList | null = null
let viewObserver: IntersectionObserver | null = null

const current = computed(() => items.value[active.value] ?? null)

function go(index: number, syncRail = true) {
  if (!items.value.length) return
  const len = items.value.length
  active.value = ((index % len) + len) % len
  if (syncRail) nextTick(() => syncRailScroll())
}

function next() {
  go(active.value + 1, inView.value)
}

function prev() {
  go(active.value - 1, true)
}

function startAuto() {
  stopAuto()
  if (!inView.value || items.value.length < 2) return
  timer = setInterval(next, 4200)
}

function stopAuto() {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

function onMove(event: PointerEvent) {
  if (dragging || isCompact.value) return
  const el = stageRef.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  const nx = (event.clientX - rect.left) / rect.width - 0.5
  const ny = (event.clientY - rect.top) / rect.height - 0.5
  tilt.x = ny * -8
  tilt.y = nx * 10
}

function onLeave() {
  tilt.x = 0
  tilt.y = 0
  dragging = false
  if (inView.value) startAuto()
}

function onPointerDown(event: PointerEvent) {
  dragging = true
  dragStartX = event.clientX
  stopAuto()
  ;(event.currentTarget as HTMLElement | null)?.setPointerCapture?.(event.pointerId)
}

function onPointerUp(event: PointerEvent) {
  if (!dragging) return
  const dx = event.clientX - dragStartX
  dragging = false
  if (Math.abs(dx) > 40) {
    if (dx > 0) prev()
    else next()
  }
  startAuto()
}

function getDeckStyle(index: number): Record<string, string | number> {
  const len = items.value.length
  let offset = index - active.value
  if (offset > len / 2) offset -= len
  if (offset < -len / 2) offset += len
  const abs = Math.abs(offset)
  const isActive = offset === 0
  const compact = isCompact.value

  if (compact) {
    if (abs > 1) {
      return {
        zIndex: 0,
        opacity: 0,
        pointerEvents: 'none',
        transform: `translate3d(${offset * 72}%, 8%, -90px) scale(0.88)`,
      }
    }
    return {
      zIndex: isActive ? 30 : 12,
      opacity: isActive ? 1 : 0.4,
      pointerEvents: isActive ? 'auto' : 'none',
      transform: `
        translate3d(${offset * 16}%, ${abs * 2}%, ${isActive ? 48 : -16}px)
        rotateY(${offset * -7}deg)
        scale(${isActive ? 1 : 0.9})
      `,
    }
  }

  if (abs > 3) {
    return {
      zIndex: 0,
      opacity: 0,
      pointerEvents: 'none',
      transform: `translate3d(${offset * 42}%, 8%, -120px) rotateY(${offset * -32}deg) scale(0.65)`,
    }
  }

  return {
    zIndex: isActive ? 30 : 18 - abs,
    opacity: 1 - abs * 0.18,
    pointerEvents: abs > 2 ? 'none' : 'auto',
    transform: `
      translate3d(${offset * 42}%, ${abs * 3.5}%, ${isActive ? 140 : 30 - abs * 55}px)
      rotateY(${offset * -26}deg)
      rotateX(${isActive ? 2 : abs * 5}deg)
      scale(${isActive ? 1 : 0.82 - abs * 0.05})
    `,
  }
}

function onCardClick(event: Event, index: number) {
  if (active.value === index) return
  event.preventDefault()
  go(index)
}

function iconMask(src: string) {
  const url = mediaSrc(src)
  return {
    maskImage: `url(${url})`,
    WebkitMaskImage: `url(${url})`,
    maskRepeat: 'no-repeat',
    WebkitMaskRepeat: 'no-repeat',
    maskPosition: 'center',
    WebkitMaskPosition: 'center',
    maskSize: 'contain',
    WebkitMaskSize: 'contain',
  }
}

/** فقط اسکرول افقی ریل — بدون scrollIntoView تا صفحه نپرد */
function syncRailScroll() {
  const rail = railRef.value
  if (!rail || !inView.value) return
  const thumb = rail.querySelector<HTMLElement>(`[data-rail-index="${active.value}"]`)
  if (!thumb) return
  const railRect = rail.getBoundingClientRect()
  const thumbRect = thumb.getBoundingClientRect()
  const delta =
    thumbRect.left
    + thumbRect.width / 2
    - (railRect.left + railRect.width / 2)
  if (Math.abs(delta) < 4) return
  rail.scrollTo({ left: rail.scrollLeft + delta, behavior: 'smooth' })
}

function syncCompact(event?: MediaQueryListEvent | MediaQueryList) {
  const matches = event && 'matches' in event
    ? event.matches
    : Boolean(mediaQuery?.matches)
  isCompact.value = matches
  if (matches) {
    tilt.x = 0
    tilt.y = 0
  }
}

watch(items, (list) => {
  if (!list.length) return
  if (active.value >= list.length) active.value = 0
  if (inView.value) startAuto()
})

onMounted(async () => {
  mediaQuery = window.matchMedia('(max-width: 1023px)')
  syncCompact(mediaQuery)
  mediaQuery.addEventListener('change', syncCompact)

  nextTick(() => {
    if (!sectionRef.value || typeof IntersectionObserver === 'undefined') return
    viewObserver = new IntersectionObserver(
      ([entry]) => {
        inView.value = Boolean(entry?.isIntersecting)
        if (inView.value) startAuto()
        else stopAuto()
      },
      { threshold: 0.35 },
    )
    viewObserver.observe(sectionRef.value)
  })

  await serviceController.getServiceList()
})

onBeforeUnmount(() => {
  stopAuto()
  viewObserver?.disconnect()
  viewObserver = null
  mediaQuery?.removeEventListener('change', syncCompact)
})
</script>

<template>
  <section
    ref="sectionRef"
    class="services-stage relative isolate flex w-full min-h-[100svh] items-center overflow-hidden bg-band text-on-band"
    aria-labelledby="services-heading"
  >
    <div class="pointer-events-none absolute inset-0" aria-hidden="true">
      <img
        v-if="current"
        :src="mediaSrc(current.coverImage || '/services/hero.jpg')"
        alt=""
        class="services-bg absolute inset-0 size-full object-cover opacity-30 transition-opacity duration-700"
      >
      <div class="absolute inset-0 bg-gradient-to-l from-band via-band/88 to-band/55" />
      <div class="absolute inset-0 bg-gradient-to-t from-band via-transparent to-band/50" />
      <div class="services-orb absolute -right-24 top-1/4 size-[18rem] rounded-full bg-green-deep/30 blur-3xl sm:size-[30rem]" />
      <div class="services-orb services-orb-b absolute -left-20 bottom-0 size-[16rem] rounded-full bg-gold/15 blur-3xl sm:size-[24rem]" />
      <div class="services-floor absolute inset-x-0 bottom-0 h-[34%] opacity-25 lg:h-[42%] lg:opacity-35" />
      <div
        class="absolute inset-0 opacity-[0.06]"
        style="background-image: radial-gradient(circle at 1px 1px, #fff 1px, transparent 0); background-size: 28px 28px"
      />
    </div>

    <div class="relative mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-14 sm:gap-8 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
      <div class="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between sm:gap-5">
        <div class="max-w-2xl">
          <p class="reveal-item reveal-item-fade text-[11px] font-semibold tracking-[0.22em] text-gold" style="--reveal-i: 0">
            خدمات
          </p>
          <h2
            id="services-heading"
            class="reveal-item mt-2 text-[1.75rem] font-bold tracking-tight sm:mt-3 sm:text-4xl lg:text-[2.7rem] lg:leading-[1.12]"
            style="--reveal-i: 1"
          >
            هر نیاز، درمان متناسب
            <span class="mt-1 block text-on-band/45">همان خدمت</span>
          </h2>
          <p class="reveal-item reveal-item-fade mt-3 max-w-xl text-[14px] leading-7 text-on-band/60 sm:mt-4 sm:text-[15px] sm:leading-8" style="--reveal-i: 2">
            <span class="lg:hidden">کارت را بکشید یا از بندانگشتی‌ها انتخاب کنید.</span>
            <span class="hidden lg:inline">از معاینه تا ایمپلنت و لمینت در جهانشهر — کارت‌ها را بکشید یا ورق بزنید؛ هر خدمت با مسیر شفاف.</span>
          </p>
        </div>

        <div class="reveal-item reveal-item-scale hidden items-center gap-3 lg:flex" style="--reveal-i: 3">
          <div class="flex gap-2">
            <button
              type="button"
              class="inline-flex size-11 items-center justify-center rounded-xl bg-on-band/8 ring-1 ring-on-band/15 transition hover:bg-gold hover:text-on-accent"
              aria-label="خدمت قبلی"
              @click="prev(); stopAuto(); startAuto()"
            >
              →
            </button>
            <button
              type="button"
              class="inline-flex size-11 items-center justify-center rounded-xl bg-on-band/8 ring-1 ring-on-band/15 transition hover:bg-gold hover:text-on-accent"
              aria-label="خدمت بعدی"
              @click="next(); stopAuto(); startAuto()"
            >
              ←
            </button>
          </div>
          <NuxtLink
            to="/practice-areas"
            class="inline-flex rounded-2xl bg-green-deep px-5 py-3 text-sm font-bold text-on-primary shadow-[0_16px_36px_rgba(15,118,110,0.4)] transition hover:-translate-y-0.5 hover:brightness-110"
          >
            همه خدمات
          </NuxtLink>
        </div>
      </div>

      <div
        v-if="loading && !items.length"
        class="py-20 text-center text-on-band/50"
      >
        در حال بارگذاری خدمات...
      </div>

      <div
        v-else-if="!items.length"
        class="py-20 text-center text-on-band/50"
      >
        خدمتی برای نمایش وجود ندارد.
      </div>

      <template v-else>
        <div
          ref="stageRef"
          class="services-deck relative mx-auto flex w-full items-center justify-center"
          @pointermove="onMove"
          @pointerdown="onPointerDown"
          @pointerup="onPointerUp"
          @pointercancel="onPointerUp"
          @pointerenter="stopAuto"
          @pointerleave="onLeave"
        >
          <div
            class="services-scene relative h-[min(118vw,460px)] w-full max-w-lg perspective-[2000px] sm:h-[460px] sm:max-w-5xl lg:h-[500px]"
            :style="{ transform: isCompact ? undefined : `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }"
          >
            <div
              class="absolute left-1/2 top-[42%] size-[55%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-green-deep/30 blur-3xl"
              aria-hidden="true"
            />

            <NuxtLink
              v-for="(item, index) in items"
              :key="item.id"
              :to="item.href"
              class="services-card absolute overflow-hidden rounded-[1.5rem] sm:rounded-[1.75rem] left-[5%] top-[2%] h-[92%] w-[90%] sm:left-[22%] sm:top-[4%] sm:h-[84%] sm:w-[56%]"
              :style="getDeckStyle(index)"
              :tabindex="active === index ? 0 : -1"
              @click="onCardClick($event, index)"
            >
              <span class="services-card-face relative block size-full overflow-hidden rounded-[1.5rem] ring-1 ring-white/15 sm:rounded-[1.75rem]">
                <img
                  :src="mediaSrc(item.coverImage || '/services/hero.jpg')"
                  :alt="item.title"
                  class="absolute inset-0 size-full object-cover"
                  width="900"
                  height="1100"
                  loading="lazy"
                  draggable="false"
                >
                <span class="absolute inset-0 bg-gradient-to-t from-band via-band/55 to-transparent" />
                <span
                  class="pointer-events-none absolute -right-8 top-8 size-28 rounded-full bg-gold/20 blur-2xl sm:size-36"
                  aria-hidden="true"
                />

                <span class="relative z-10 flex h-full flex-col justify-between p-4 sm:p-7">
                  <span
                    class="services-icon inline-flex size-12 items-center justify-center rounded-2xl bg-on-band/10 shadow-[0_18px_36px_rgba(0,0,0,0.35)] ring-1 ring-on-band/20 backdrop-blur-md sm:size-14"
                    aria-hidden="true"
                  >
                    <span
                      class="inline-block size-6 bg-gold sm:size-7"
                      :style="iconMask(item.icon)"
                    />
                  </span>

                  <span>
                    <span class="block font-mono text-[10px] tracking-[0.18em] text-gold">
                      {{ String(index + 1).padStart(2, '0') }} / {{ String(items.length).padStart(2, '0') }}
                    </span>
                    <span class="mt-2 block text-xl font-bold tracking-tight sm:text-3xl">
                      {{ item.title }}
                    </span>
                    <span class="mt-2 block line-clamp-3 max-w-md text-[13px] leading-7 text-on-band/70 sm:mt-3 sm:text-sm">
                      {{ item.description }}
                    </span>
                    <span
                      class="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-gold transition sm:mt-5"
                      :class="active === index ? 'opacity-100' : 'opacity-0'"
                    >
                      جزئیات خدمت
                      <span aria-hidden="true">←</span>
                    </span>
                  </span>
                </span>
              </span>
            </NuxtLink>

            <div
              class="pointer-events-none absolute bottom-1 left-1/2 h-12 w-[70%] -translate-x-1/2 rounded-[100%] bg-black/55 blur-2xl sm:h-14 sm:w-[50%]"
              aria-hidden="true"
            />
          </div>
        </div>

        <!-- Mobile controls -->
        <div class="flex items-center justify-between gap-3 lg:hidden">
          <div class="flex gap-2">
            <button
              type="button"
              class="inline-flex size-12 items-center justify-center rounded-2xl bg-on-band/8 text-lg ring-1 ring-on-band/15"
              aria-label="خدمت قبلی"
              @click="prev(); stopAuto(); startAuto()"
            >
              →
            </button>
            <button
              type="button"
              class="inline-flex size-12 items-center justify-center rounded-2xl bg-on-band/8 text-lg ring-1 ring-on-band/15"
              aria-label="خدمت بعدی"
              @click="next(); stopAuto(); startAuto()"
            >
              ←
            </button>
          </div>
          <NuxtLink
            to="/practice-areas"
            class="inline-flex rounded-2xl bg-green-deep px-4 py-3 text-sm font-bold text-on-primary shadow-[0_12px_28px_rgba(15,118,110,0.35)]"
          >
            همه خدمات
          </NuxtLink>
        </div>

        <!-- Thumb rail: horizontal scroll on mobile -->
        <div
          ref="railRef"
          class="services-rail -mx-4 overflow-x-auto py-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:mx-0 [&::-webkit-scrollbar]:hidden"
        >
          <div class="flex w-max min-w-full gap-2.5 px-4 sm:justify-center sm:px-0">
          <button
            v-for="(item, index) in items"
            :key="`rail-${item.id}`"
            type="button"
            :data-rail-index="index"
            class="group relative h-[3.75rem] w-[4.75rem] shrink-0 overflow-hidden rounded-xl transition sm:h-16 sm:w-24"
            :class="active === index
              ? 'scale-105 outline outline-2 outline-gold'
              : 'opacity-65 outline outline-1 outline-on-band/15'"
            :aria-label="item.title"
            @click="go(index); stopAuto(); startAuto()"
          >
            <img
              :src="mediaSrc(item.coverImage || '/services/hero.jpg')"
              alt=""
              class="size-full object-cover transition duration-500 group-hover:scale-110"
              loading="lazy"
            >
            <span class="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
            <span class="absolute inset-x-0 bottom-1 text-center font-mono text-[9px] text-on-band/90">
              {{ String(index + 1).padStart(2, '0') }}
            </span>
          </button>
          </div>
        </div>
      </template>
    </div>
  </section>
</template>

<style scoped>
.services-bg {
  transform: scale(1.08);
  filter: saturate(0.85);
}

.services-floor {
  background:
    repeating-linear-gradient(
      90deg,
      transparent,
      transparent 56px,
      rgba(255, 255, 255, 0.04) 56px,
      rgba(255, 255, 255, 0.04) 57px
    ),
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 56px,
      rgba(255, 255, 255, 0.03) 56px,
      rgba(255, 255, 255, 0.03) 57px
    );
  mask-image: linear-gradient(to top, black 8%, transparent 92%);
  transform: perspective(1000px) rotateX(68deg) scale(1.45);
  transform-origin: center bottom;
}

.services-scene {
  transform-style: preserve-3d;
  transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
  will-change: transform;
}

.services-card {
  transform-style: preserve-3d;
  transition:
    transform 0.65s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.4s ease;
  will-change: transform, opacity;
  touch-action: pan-y;
}

.services-card-face {
  box-shadow:
    0 20px 48px rgba(0, 0, 0, 0.45),
    0 36px 80px rgba(15, 118, 110, 0.2);
}

.services-icon {
  transform: translateZ(36px);
}

.services-orb {
  animation: services-drift 16s ease-in-out infinite;
}
.services-orb-b {
  animation-duration: 21s;
  animation-direction: reverse;
}

@keyframes services-drift {
  0%,
  100% {
    transform: translate3d(0, 0, 0);
  }
  50% {
    transform: translate3d(18px, -22px, 0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .services-scene,
  .services-card,
  .services-orb,
  .services-orb-b,
  .services-floor,
  .services-bg {
    animation: none !important;
    transition: none !important;
  }
  .services-scene,
  .services-card {
    transform: none !important;
  }
}

@media (max-width: 1023px) {
  .services-floor {
    opacity: 0.16;
    transform: none;
  }
  .services-icon {
    transform: none;
  }
}
</style>
