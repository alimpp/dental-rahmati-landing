<script setup lang="ts">
import { processStepModule } from '~/modules'

const stepDS = processStepModule.store
const steps = computed(() => stepDS.getVisibleItems)

await processStepModule.controller.getList()

const sectionRef = ref<HTMLElement | null>(null)
const active = ref(0)
const inView = ref(false)
const isCompact = ref(false)
const tilt = reactive({ x: 0, y: 0 })
let timer: ReturnType<typeof setInterval> | null = null
let mediaQuery: MediaQueryList | null = null
let viewObserver: IntersectionObserver | null = null

const progress = computed(() => {
  if (!steps.value.length) return 0
  return ((active.value + 1) / steps.value.length) * 100
})

function go(index: number) {
  if (!steps.value.length) return
  const len = steps.value.length
  active.value = ((index % len) + len) % len
}

function next() {
  go(active.value + 1)
}

function startAuto() {
  stopAuto()
  if (!inView.value || steps.value.length < 2) return
  timer = setInterval(next, 3800)
}

function stopAuto() {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

function onMove(event: PointerEvent) {
  if (isCompact.value) return
  const el = sectionRef.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  const nx = (event.clientX - rect.left) / rect.width - 0.5
  const ny = (event.clientY - rect.top) / rect.height - 0.5
  tilt.x = ny * -4
  tilt.y = nx * 5
}

function onLeave() {
  tilt.x = 0
  tilt.y = 0
  if (inView.value) startAuto()
}

function cardStyle(index: number): Record<string, string | number> {
  const isActive = index === active.value
  const dist = Math.abs(index - active.value)
  if (isCompact.value) {
    return {
      transform: isActive
        ? 'translateY(0) scale(1)'
        : 'translateY(0) scale(0.985)',
      opacity: isActive ? 1 : 0.72,
      zIndex: isActive ? 5 : 1,
    }
  }
  return {
    transform: `
      translateZ(${isActive ? 48 : 12 - dist * 8}px)
      translateY(${isActive ? -10 : dist * 4}px)
      rotateY(${(index - active.value) * -4}deg)
      scale(${isActive ? 1.04 : 0.94 - dist * 0.02})
    `,
    opacity: dist > 2 ? 0.55 : 1 - dist * 0.12,
    zIndex: isActive ? 8 : 4 - dist,
  }
}

function onMqChange(e: MediaQueryListEvent) {
  isCompact.value = e.matches
  if (e.matches) {
    tilt.x = 0
    tilt.y = 0
  }
}

onMounted(() => {
  mediaQuery = window.matchMedia('(max-width: 1023px)')
  isCompact.value = mediaQuery.matches
  mediaQuery.addEventListener('change', onMqChange)

  nextTick(() => {
    if (!sectionRef.value || typeof IntersectionObserver === 'undefined') return
    viewObserver = new IntersectionObserver(
      ([entry]) => {
        inView.value = Boolean(entry?.isIntersecting)
        if (inView.value) startAuto()
        else stopAuto()
      },
      { threshold: 0.3 },
    )
    viewObserver.observe(sectionRef.value)
  })
})

onBeforeUnmount(() => {
  stopAuto()
  viewObserver?.disconnect()
  viewObserver = null
  mediaQuery?.removeEventListener('change', onMqChange)
})
</script>

<template>
  <section
    v-if="steps.length"
    ref="sectionRef"
    class="case-path relative isolate overflow-hidden bg-mist py-14 sm:py-20 lg:py-24"
    aria-labelledby="case-path-heading"
    @pointermove="onMove"
    @pointerleave="onLeave"
    @pointerenter="stopAuto"
  >
    <div class="pointer-events-none absolute inset-0" aria-hidden="true">
      <div class="case-path-orb absolute -right-20 top-10 size-[22rem] rounded-full bg-green-soft/80 blur-3xl" />
      <div class="case-path-orb case-path-orb-b absolute -left-16 bottom-0 size-[18rem] rounded-full bg-gold/15 blur-3xl" />
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_0%,rgba(15,118,110,0.08),transparent_55%)]" />
    </div>

    <div class="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div class="max-w-xl">
          <p class="reveal-item reveal-item-fade text-[11px] font-semibold tracking-[0.22em] text-gold" style="--reveal-i: 0">
            مسیر درمان
          </p>
          <h2
            id="case-path-heading"
            class="reveal-item mt-3 text-[1.75rem] font-bold tracking-tight text-ink sm:text-4xl"
            style="--reveal-i: 1"
          >
            از نوبت‌گیری تا پیگیری
          </h2>
          <p class="reveal-item reveal-item-fade mt-3 text-[14px] leading-7 text-ink-muted sm:mt-4 sm:text-[15px] sm:leading-8" style="--reveal-i: 2">
            مراقبت شما در چهار گام مشخص پیش می‌رود؛ هر مرحله شفاف، قابل‌فهم و همراه با شما.
          </p>
        </div>

        <div class="reveal-item reveal-item-scale flex flex-wrap items-center gap-3" style="--reveal-i: 3">
          <div class="flex items-center gap-2 rounded-2xl bg-panel px-3 py-2 ring-1 ring-mist-deep">
            <span class="font-mono text-xs text-ink-muted">گام</span>
            <span class="font-mono text-sm font-bold text-green-deep">
              {{ String(active + 1).padStart(2, '0') }} / {{ String(steps.length).padStart(2, '0') }}
            </span>
          </div>
          <NuxtLink
            to="/consultation"
            class="inline-flex rounded-2xl bg-green-deep px-5 py-3 text-sm font-bold text-on-primary shadow-[0_14px_32px_rgba(15,118,110,0.28)] transition hover:-translate-y-0.5 hover:brightness-110"
          >
            شروع با رزرو نوبت
          </NuxtLink>
        </div>
      </div>

      <!-- Progress track -->
      <div class="reveal-item reveal-item-fade relative mt-8 sm:mt-10" style="--reveal-i: 3">
        <div class="h-1.5 overflow-hidden rounded-full bg-mist-deep/70">
          <div
            class="case-path-progress h-full rounded-full bg-gradient-to-l from-green-deep to-gold"
            :style="{ width: `${progress}%` }"
          />
        </div>
        <div class="mt-3 flex justify-between gap-2">
          <button
            v-for="(step, index) in steps"
            :key="`dot-${step.id}`"
            type="button"
            class="flex min-w-0 flex-1 flex-col items-center gap-1.5"
            @click="go(index); stopAuto(); startAuto()"
          >
            <span
              class="size-2.5 rounded-full transition"
              :class="index <= active ? 'bg-green-deep scale-125' : 'bg-mist-deep'"
            />
            <span
              class="hidden truncate text-[10px] font-medium sm:block"
              :class="index === active ? 'text-green-deep' : 'text-ink-muted'"
            >
              {{ step.title }}
            </span>
          </button>
        </div>
      </div>

      <!-- Steps stage -->
      <div
        class="case-path-stage relative mt-8 sm:mt-10"
        :style="isCompact ? undefined : { transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }"
      >
        <ol
          class="case-path-scene grid gap-4 sm:gap-5 lg:grid-cols-4 lg:gap-5"
        >
          <li
            v-for="(step, index) in steps"
            :key="step.id"
            class="case-path-card reveal-item"
            :class="index === active ? 'case-path-card-active' : ''"
            :style="{ ...cardStyle(index), '--reveal-i': index + 4 }"
          >
            <button
              type="button"
              class="case-path-card-face group relative flex h-full w-full flex-col overflow-hidden rounded-[1.5rem] bg-panel p-5 text-start ring-1 ring-mist-deep sm:p-6"
              :aria-pressed="active === index"
              @click="go(index); stopAuto(); startAuto()"
            >
              <span
                class="pointer-events-none absolute -left-8 -top-8 size-28 rounded-full blur-2xl transition duration-500"
                :class="index === active ? 'bg-gold/25' : 'bg-green-soft/50'"
                aria-hidden="true"
              />
              <span
                class="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-white to-transparent"
                aria-hidden="true"
              />

              <span class="relative flex items-start justify-between gap-3">
                <span
                  class="case-path-badge inline-flex size-12 items-center justify-center rounded-2xl font-mono text-lg font-bold transition sm:size-14 sm:text-xl"
                  :class="index === active
                    ? 'bg-band text-gold shadow-[0_16px_36px_rgba(15,23,42,0.3)] ring-1 ring-white/10'
                    : 'bg-mist text-ink ring-1 ring-mist-deep'"
                >
                  {{ String(index + 1).padStart(2, '0') }}
                </span>
                <span
                  v-if="index === active"
                  class="mt-1 rounded-full bg-green-soft px-3 py-1.5 text-[10px] font-semibold leading-none tracking-[0.14em] text-green-deep"
                >
                  الان
                </span>
              </span>

              <span class="relative mt-5 block text-lg font-bold tracking-tight text-ink sm:text-xl">
                {{ step.title }}
              </span>
              <span class="relative mt-3 block flex-1 text-[13px] leading-7 text-ink-muted sm:text-[14px] sm:leading-7">
                {{ step.description }}
              </span>

              <span
                class="relative mt-5 inline-flex items-center gap-2 text-xs font-semibold transition"
                :class="index === active ? 'text-green-deep opacity-100' : 'text-ink-muted opacity-0 group-hover:opacity-70'"
              >
                {{ index < steps.length - 1 ? 'گام بعد ←' : 'پایان مسیر' }}
              </span>
            </button>
          </li>
        </ol>
      </div>
    </div>
  </section>
</template>

<style scoped>
.case-path-stage {
  transform-style: preserve-3d;
  perspective: 1400px;
  transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
}

.case-path-scene {
  transform-style: preserve-3d;
}

.case-path-card {
  transform-style: preserve-3d;
  transition:
    transform 0.55s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.4s ease;
  will-change: transform, opacity;
}

.case-path-card-face {
  transform-style: preserve-3d;
  box-shadow:
    0 10px 24px rgba(15, 23, 42, 0.05),
    0 22px 48px rgba(15, 118, 110, 0.07);
  transition:
    box-shadow 0.45s ease,
    background-color 0.35s ease;
  min-height: 17.5rem;
}

.case-path-card-active .case-path-card-face {
  box-shadow:
    0 18px 40px rgba(15, 23, 42, 0.1),
    0 36px 72px rgba(15, 118, 110, 0.14),
    inset 0 0 0 1px color-mix(in oklab, var(--color-gold) 45%, transparent);
}

.case-path-badge {
  transform: translateZ(28px);
}

.case-path-progress {
  transition: width 0.55s cubic-bezier(0.22, 1, 0.36, 1);
}

.case-path-orb {
  animation: case-path-drift 16s ease-in-out infinite;
}
.case-path-orb-b {
  animation-duration: 20s;
  animation-direction: reverse;
}

@keyframes case-path-drift {
  0%,
  100% {
    transform: translate3d(0, 0, 0);
  }
  50% {
    transform: translate3d(14px, -16px, 0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .case-path-card,
  .case-path-stage,
  .case-path-progress,
  .case-path-orb,
  .case-path-orb-b {
    animation: none !important;
    transition: none !important;
  }
  .case-path-card,
  .case-path-stage {
    transform: none !important;
  }
}

@media (max-width: 1023px) {
  .case-path-card-face {
    min-height: 0;
  }
  .case-path-badge {
    transform: none;
  }
}
</style>
