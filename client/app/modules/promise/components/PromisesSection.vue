<script setup lang="ts">
import { promiseModule } from '~/modules'

const promiseDS = promiseModule.store
const items = computed(() => promiseDS.getVisibleItems)

await promiseModule.controller.getList()

const active = ref(0)
const sectionRef = ref<HTMLElement | null>(null)
const stageRef = ref<HTMLElement | null>(null)
const isCompact = ref(false)
const inView = ref(false)
const tilt = reactive({ x: 0, y: 0 })
const spotlight = reactive({ x: 50, y: 40 })
let timer: ReturnType<typeof setInterval> | null = null
let dragStartX = 0
let dragging = false
let mediaQuery: MediaQueryList | null = null
let viewObserver: IntersectionObserver | null = null

function go(index: number) {
  if (!items.value.length) return
  const len = items.value.length
  active.value = ((index % len) + len) % len
}

function next() {
  go(active.value + 1)
}

function prev() {
  go(active.value - 1)
}

function startAuto() {
  stopAuto()
  if (!inView.value || items.value.length < 2) return
  timer = setInterval(next, 4500)
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
  const nx = (event.clientX - rect.left) / rect.width
  const ny = (event.clientY - rect.top) / rect.height
  tilt.x = (ny - 0.5) * -10
  tilt.y = (nx - 0.5) * 14
  spotlight.x = nx * 100
  spotlight.y = ny * 100
}

function onLeave() {
  tilt.x = 0
  tilt.y = 0
  spotlight.x = 50
  spotlight.y = 40
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
        transform: `translate3d(${offset * 70}%, 6%, -80px) scale(0.86)`,
      }
    }
    return {
      zIndex: isActive ? 30 : 10,
      opacity: isActive ? 1 : 0.45,
      pointerEvents: isActive ? 'auto' : 'none',
      transform: `
        translate3d(${offset * 18}%, ${abs * 2}%, ${isActive ? 40 : -20}px)
        rotateY(${offset * -8}deg)
        scale(${isActive ? 1 : 0.9})
      `,
    }
  }

  return {
    zIndex: isActive ? 30 : 20 - abs,
    opacity: abs > 2 ? 0 : 1 - abs * 0.22,
    pointerEvents: abs > 2 ? 'none' : 'auto',
    transform: `
      translate3d(${offset * 58}%, ${abs * 4}%, ${isActive ? 120 : 20 - abs * 70}px)
      rotateY(${offset * -28}deg)
      rotateX(${isActive ? 0 : abs * 4}deg)
      scale(${isActive ? 1 : 0.78 - abs * 0.05})
    `,
  }
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

onMounted(() => {
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
})

onBeforeUnmount(() => {
  stopAuto()
  viewObserver?.disconnect()
  viewObserver = null
  mediaQuery?.removeEventListener('change', syncCompact)
})

watch(items, (list) => {
  if (active.value >= list.length) active.value = 0
})
</script>

<template>
  <section
    v-if="items.length"
    ref="sectionRef"
    class="promises-stage relative isolate flex w-full items-center overflow-hidden bg-band text-on-band min-h-[100svh] lg:min-h-[100svh]"
    aria-labelledby="promises-heading"
  >
    <div class="pointer-events-none absolute inset-0" aria-hidden="true">
      <div
        class="promises-spotlight absolute size-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl transition-all duration-500 sm:size-[48rem]"
        :style="{
          left: `${spotlight.x}%`,
          top: `${spotlight.y}%`,
          background:
            'radial-gradient(circle, rgba(34,211,238,0.22) 0%, rgba(15,118,110,0.12) 35%, transparent 70%)',
        }"
      />
      <div class="promises-orb promises-orb-a absolute -right-24 top-10 size-[18rem] rounded-full bg-green-deep/35 blur-3xl sm:size-[26rem]" />
      <div class="promises-orb promises-orb-b absolute -left-28 bottom-0 size-[16rem] rounded-full bg-gold/15 blur-3xl sm:size-[22rem]" />
      <div
        class="absolute inset-0 opacity-[0.07]"
        style="background-image: radial-gradient(circle at 1px 1px, #fff 1px, transparent 0); background-size: 32px 32px"
      />
      <div class="promises-floor absolute inset-x-0 bottom-0 h-[34%] opacity-30 lg:h-[40%] lg:opacity-40" />
      <p class="promises-watermark absolute inset-x-0 top-[10%] text-center font-mono text-[42vw] font-bold leading-none text-white/[0.045] select-none sm:top-[14%] sm:text-[28vw] lg:top-[12%] lg:text-[18rem]">
        {{ String(active + 1).padStart(2, '0') }}
      </p>
    </div>

    <div class="relative mx-auto grid w-full max-w-7xl items-center gap-5 px-4 py-14 sm:gap-8 sm:px-6 sm:py-16 lg:grid-cols-12 lg:gap-8 lg:px-8 lg:py-0">
      <!-- Copy -->
      <div class="order-1 lg:order-1 lg:col-span-4 lg:flex lg:min-h-[100svh] lg:flex-col lg:justify-center lg:py-24">
        <p class="reveal-item reveal-item-fade text-[11px] font-semibold tracking-[0.22em] text-gold" style="--reveal-i: 0">
          چرا امیر رحمتی
        </p>
        <h2
          id="promises-heading"
          class="reveal-item mt-3 text-[1.75rem] font-bold tracking-tight sm:mt-4 sm:text-4xl lg:text-[2.6rem] lg:leading-[1.15]"
          style="--reveal-i: 1"
        >
          سه تعهد ساده
          <span class="mt-1 block text-on-band/50">بدون شعار اضافه</span>
        </h2>
        <p class="reveal-item reveal-item-fade mt-3 max-w-md text-[14px] leading-7 text-on-band/70 sm:mt-5 sm:text-[15px] sm:leading-8" style="--reveal-i: 2">
          قبل از جزئیات خدمات، بدانید چطور کار می‌کنیم — شفاف، تخصصی و تا انتها همراه درمان شما.
        </p>

        <div class="reveal-item reveal-item-scale mt-5 hidden items-center gap-3 lg:mt-8 lg:flex" style="--reveal-i: 4">
          <button
            type="button"
            class="inline-flex size-11 items-center justify-center rounded-xl bg-on-band/10 text-on-band ring-1 ring-white/15 transition hover:bg-gold hover:text-on-accent"
            aria-label="تعهد قبلی"
            @click="prev(); stopAuto(); startAuto()"
          >
            →
          </button>
          <button
            type="button"
            class="inline-flex size-11 items-center justify-center rounded-xl bg-on-band/10 text-on-band ring-1 ring-white/15 transition hover:bg-gold hover:text-on-accent"
            aria-label="تعهد بعدی"
            @click="next(); stopAuto(); startAuto()"
          >
            ←
          </button>
          <div class="ms-2 flex gap-1.5">
            <button
              v-for="(_, index) in items"
              :key="`dot-lg-${index}`"
              type="button"
              class="h-1.5 rounded-full transition-all"
              :class="active === index ? 'w-8 bg-gold' : 'w-1.5 bg-on-band/30 hover:bg-on-band/50'"
              :aria-label="`تعهد ${index + 1}`"
              @click="go(index); stopAuto(); startAuto()"
            />
          </div>
        </div>
      </div>

      <!-- Deck -->
      <div
        ref="stageRef"
        class="order-2 relative flex w-full items-center justify-center lg:order-2 lg:col-span-8 lg:min-h-[100svh]"
        @pointermove="onMove"
        @pointerdown="onPointerDown"
        @pointerup="onPointerUp"
        @pointercancel="onPointerUp"
        @pointerenter="stopAuto"
        @pointerleave="onLeave"
      >
        <div
          class="promises-scene relative h-[min(78vw,420px)] w-full max-w-lg perspective-[1800px] sm:h-[420px] sm:max-w-3xl lg:h-[480px] lg:max-w-none"
          :style="{ transform: isCompact ? undefined : `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }"
        >
          <div
            class="absolute left-1/2 top-1/2 size-[60%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-green-deep/25 blur-3xl"
            aria-hidden="true"
          />

          <button
            v-for="(item, index) in items"
            :key="item.id"
            type="button"
            class="promises-card absolute overflow-hidden rounded-[1.5rem] border-0 bg-transparent p-0 text-start sm:rounded-[1.75rem] left-[6%] top-[4%] h-[90%] w-[88%] sm:left-[18%] sm:top-[8%] sm:h-[78%] sm:w-[64%]"
            :style="getDeckStyle(index)"
            :aria-pressed="active === index"
            @click="go(index)"
          >
            <span class="promises-card-face relative flex size-full flex-col justify-between overflow-hidden rounded-[1.5rem] bg-panel p-5 text-ink ring-1 ring-white/20 sm:rounded-[1.75rem] sm:p-8">
              <span
                class="pointer-events-none absolute -right-10 -top-10 size-36 rounded-full bg-green-soft/70 blur-2xl sm:size-44"
                aria-hidden="true"
              />
              <span
                class="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-white to-transparent"
                aria-hidden="true"
              />

              <span class="relative flex items-start justify-between gap-3">
                <span class="promises-badge flex size-14 items-center justify-center rounded-2xl bg-band font-mono text-xl font-bold text-gold shadow-[0_20px_40px_rgba(15,23,42,0.35)] ring-1 ring-white/10 sm:size-[4.5rem] sm:text-3xl">
                  {{ String(index + 1).padStart(2, '0') }}
                </span>
                <span class="promises-chip mt-1 rounded-full bg-green-soft px-3 py-1.5 text-[10px] font-semibold leading-none tracking-[0.16em] text-green-deep">
                  تعهد
                </span>
              </span>

              <span class="relative">
                <span class="block text-xl font-bold tracking-tight text-ink sm:text-3xl">
                  {{ item.title }}
                </span>
                <span class="mt-3 block text-[13px] leading-7 text-ink-muted sm:mt-4 sm:text-[15px] sm:leading-8">
                  {{ item.description }}
                </span>
              </span>
            </span>
          </button>

          <div
            class="pointer-events-none absolute bottom-0 left-1/2 h-10 w-[70%] -translate-x-1/2 rounded-[100%] bg-black/50 blur-2xl sm:h-12 sm:w-[55%]"
            aria-hidden="true"
          />
        </div>
      </div>

      <!-- Mobile controls under deck -->
      <div class="order-3 flex items-center justify-between gap-3 lg:hidden">
        <div class="flex gap-2">
          <button
            type="button"
            class="inline-flex size-12 items-center justify-center rounded-2xl bg-on-band/10 text-lg text-on-band ring-1 ring-white/15"
            aria-label="تعهد قبلی"
            @click="prev(); stopAuto(); startAuto()"
          >
            →
          </button>
          <button
            type="button"
            class="inline-flex size-12 items-center justify-center rounded-2xl bg-on-band/10 text-lg text-on-band ring-1 ring-white/15"
            aria-label="تعهد بعدی"
            @click="next(); stopAuto(); startAuto()"
          >
            ←
          </button>
        </div>
        <div class="flex items-center gap-2">
          <button
            v-for="(_, index) in items"
            :key="`dot-sm-${index}`"
            type="button"
            class="h-2 rounded-full transition-all"
            :class="active === index ? 'w-7 bg-gold' : 'w-2 bg-on-band/30'"
            :aria-label="`تعهد ${index + 1}`"
            @click="go(index); stopAuto(); startAuto()"
          />
        </div>
        <p class="font-mono text-xs text-on-band/45">
          {{ String(active + 1).padStart(2, '0') }}/{{ String(items.length).padStart(2, '0') }}
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.promises-floor {
  background:
    repeating-linear-gradient(
      90deg,
      transparent,
      transparent 54px,
      rgba(255, 255, 255, 0.04) 54px,
      rgba(255, 255, 255, 0.04) 55px
    ),
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 54px,
      rgba(255, 255, 255, 0.03) 54px,
      rgba(255, 255, 255, 0.03) 55px
    );
  mask-image: linear-gradient(to top, black 5%, transparent 90%);
  transform: perspective(1000px) rotateX(68deg) scale(1.45);
  transform-origin: center bottom;
}

.promises-watermark {
  animation: promises-pulse 6s ease-in-out infinite;
}

.promises-scene {
  transform-style: preserve-3d;
  transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
  will-change: transform;
}

.promises-card {
  transform-style: preserve-3d;
  transition:
    transform 0.65s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.4s ease;
  will-change: transform, opacity;
  cursor: pointer;
  touch-action: pan-y;
}

.promises-card-face {
  transform-style: preserve-3d;
  box-shadow:
    0 18px 40px rgba(0, 0, 0, 0.3),
    0 32px 70px rgba(15, 118, 110, 0.18);
}

.promises-badge {
  transform: translateZ(40px);
}

.promises-chip {
  transform: translateZ(28px);
}

.promises-orb-a {
  animation: promises-drift 15s ease-in-out infinite;
}
.promises-orb-b {
  animation: promises-drift 19s ease-in-out infinite reverse;
}

@keyframes promises-drift {
  0%,
  100% {
    transform: translate3d(0, 0, 0) scale(1);
  }
  50% {
    transform: translate3d(-22px, 18px, 0) scale(1.08);
  }
}

@keyframes promises-pulse {
  0%,
  100% {
    opacity: 0.04;
    transform: scale(1);
  }
  50% {
    opacity: 0.07;
    transform: scale(1.03);
  }
}

@media (prefers-reduced-motion: reduce) {
  .promises-scene,
  .promises-card,
  .promises-orb-a,
  .promises-orb-b,
  .promises-floor,
  .promises-watermark,
  .promises-spotlight {
    animation: none !important;
    transition: none !important;
  }
  .promises-scene,
  .promises-card {
    transform: none !important;
  }
}

@media (max-width: 1023px) {
  .promises-floor {
    opacity: 0.18;
    transform: none;
  }
  .promises-badge,
  .promises-chip {
    transform: none;
  }
}
</style>
