<script setup lang="ts">
/**
 * تور سه‌بعدی فضاهای کلینیک — اسکرول آزاد + ناوبری بندانگشتی
 */
import { CLINIC_ROOMS } from '~/data/clinic-rooms'
import { siteContact } from '~/data/site-contact'

const rooms = CLINIC_ROOMS
const activeId = ref(rooms[0]!.id)
const stripRef = ref<HTMLElement | null>(null)
const heroStageRef = ref<HTMLElement | null>(null)
const heroTilt = reactive({ x: 0, y: 0 })
const heroActive = ref(0)

let roomObserver: IntersectionObserver | null = null
let heroTimer: ReturnType<typeof setInterval> | null = null

const activeIndex = computed(() =>
  Math.max(0, rooms.findIndex(r => r.id === activeId.value)),
)

function scrollToRoom(id: string) {
  const el = document.getElementById(`clinic-room-${id}`)
  if (!el) return
  el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  activeId.value = id
}

function onStripWheel(e: WheelEvent) {
  const strip = stripRef.value
  if (!strip) return
  if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return
  if (strip.scrollWidth > strip.clientWidth + 8) {
    strip.scrollLeft -= e.deltaY
    e.preventDefault()
  }
}

function onHeroMove(event: PointerEvent) {
  const el = heroStageRef.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  const nx = (event.clientX - rect.left) / rect.width - 0.5
  const ny = (event.clientY - rect.top) / rect.height - 0.5
  heroTilt.x = ny * -6
  heroTilt.y = nx * 8
}

function onHeroLeave() {
  heroTilt.x = 0
  heroTilt.y = 0
  startHeroAuto()
}

function heroCardStyle(index: number) {
  const total = Math.min(rooms.length, 7)
  let wrapped = index - heroActive.value
  if (wrapped > total / 2) wrapped -= total
  if (wrapped < -total / 2) wrapped += total
  const abs = Math.abs(wrapped)
  const isActive = wrapped === 0
  return {
    zIndex: isActive ? 20 : 10 - abs,
    opacity: abs > 3 ? 0 : 1 - abs * 0.2,
    transform: `
      translate3d(${wrapped * 11}%, ${abs * 2.5}%, ${isActive ? 90 : 36 - abs * 30}px)
      rotateY(${wrapped * -16}deg)
      rotateX(${abs * 3}deg)
      scale(${isActive ? 1 : 0.86 - abs * 0.03})
    `,
  }
}

function startHeroAuto() {
  stopHeroAuto()
  heroTimer = setInterval(() => {
    heroActive.value = (heroActive.value + 1) % Math.min(rooms.length, 7)
  }, 2800)
}

function stopHeroAuto() {
  if (heroTimer) {
    clearInterval(heroTimer)
    heroTimer = null
  }
}

function onRoomPointer(event: PointerEvent, el: HTMLElement | null) {
  if (!el) return
  const rect = el.getBoundingClientRect()
  const nx = (event.clientX - rect.left) / rect.width - 0.5
  const ny = (event.clientY - rect.top) / rect.height - 0.5
  el.style.setProperty('--rx', `${ny * -7}deg`)
  el.style.setProperty('--ry', `${nx * 9}deg`)
}

function resetRoomPointer(el: HTMLElement | null) {
  if (!el) return
  el.style.setProperty('--rx', '0deg')
  el.style.setProperty('--ry', '0deg')
}

onMounted(() => {
  startHeroAuto()

  const nodes = rooms
    .map(r => document.getElementById(`clinic-room-${r.id}`))
    .filter((n): n is HTMLElement => !!n)

  if (!nodes.length || typeof IntersectionObserver === 'undefined') return

  roomObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter(e => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
      const top = visible[0]
      if (!top?.target?.id) return
      const id = top.target.id.replace('clinic-room-', '')
      if (id) activeId.value = id
    },
    {
      root: null,
      rootMargin: '-28% 0px -42% 0px',
      threshold: [0.15, 0.35, 0.55],
    },
  )

  nodes.forEach(n => roomObserver!.observe(n))
})

onBeforeUnmount(() => {
  stopHeroAuto()
  roomObserver?.disconnect()
  roomObserver = null
})

useHead({
  link: rooms.slice(0, 4).map(s => ({
    rel: 'preload' as const,
    as: 'image' as const,
    href: s.image,
  })),
})
</script>

<template>
  <div class="clinic-tour bg-surface text-ink">
    <!-- Hero 3D -->
    <header class="clinic-hero relative isolate flex min-h-[100svh] w-full items-end overflow-hidden bg-band text-on-band">
      <div class="pointer-events-none absolute inset-0" aria-hidden="true">
        <img
          :src="rooms[heroActive]?.image || '/clinic/01-facade.jpg'"
          alt=""
          class="clinic-hero-bg absolute inset-0 size-full object-cover opacity-40"
          fetchpriority="high"
        >
        <div class="absolute inset-0 bg-gradient-to-l from-band via-band/80 to-band/50" />
        <div class="absolute inset-0 bg-gradient-to-t from-band via-transparent to-band/45" />
        <div class="clinic-orb absolute -right-28 top-1/4 size-[30rem] rounded-full bg-green-deep/30 blur-3xl" />
        <div class="clinic-orb clinic-orb-b absolute -left-20 bottom-10 size-[22rem] rounded-full bg-gold/15 blur-3xl" />
        <div class="clinic-floor absolute inset-x-0 bottom-0 h-[38%] opacity-35" />
      </div>

      <div class="relative mx-auto grid w-full max-w-7xl items-end gap-8 px-4 pb-16 pt-28 sm:px-6 lg:grid-cols-12 lg:gap-10 lg:px-8 lg:pb-20 lg:pt-32">
        <div class="lg:col-span-5 lg:pb-6">
          <p class="reveal-item reveal-item-fade text-[11px] font-semibold tracking-[0.22em] text-gold" style="--reveal-i: 0">
            کلینیک ما · کرج جهانشهر
          </p>
          <h1 class="reveal-item mt-4 max-w-xl text-3xl font-bold leading-snug sm:text-5xl sm:leading-[1.15]" style="--reveal-i: 1">
            قدم‌زدن در
            <span class="mt-1 block text-on-band/55">۱۲ فضای کلینیک</span>
          </h1>
          <p class="reveal-item reveal-item-fade mt-5 max-w-md text-[15px] leading-8 text-on-band/75" style="--reveal-i: 2">
            {{ siteContact.address }} — از ورودی تا یونیت، VIP، دیجیتال و استریل را با اسکرول آرام ببینید.
          </p>

          <div class="reveal-item reveal-item-scale mt-8 flex flex-wrap gap-3" style="--reveal-i: 3">
            <button
              type="button"
              class="clinic-cta inline-flex rounded-2xl bg-gold px-5 py-3 text-sm font-bold text-on-accent shadow-[0_16px_40px_rgba(34,211,238,0.28)] transition hover:-translate-y-0.5 hover:brightness-110"
              @click="scrollToRoom(rooms[0]!.id)"
            >
              شروع تور فضاها
            </button>
            <NuxtLink
              to="/consultation"
              class="inline-flex rounded-2xl bg-green-deep px-5 py-3 text-sm font-bold tracking-wide text-on-primary shadow-[0_12px_32px_rgba(15,118,110,0.4)] ring-1 ring-white/20 transition hover:-translate-y-0.5 hover:brightness-110"
            >
              رزرو نوبت
            </NuxtLink>
          </div>

          <p class="reveal-item reveal-item-fade mt-6 text-sm text-on-band/45" style="--reveal-i: 4">
            {{ activeIndex + 1 }} از {{ rooms.length }} · نوار بندانگشتی برای پرش سریع
          </p>
        </div>

        <div
          ref="heroStageRef"
          class="relative flex min-h-[18rem] items-center justify-center sm:min-h-[22rem] lg:col-span-7 lg:min-h-[28rem]"
          @pointermove="onHeroMove"
          @pointerenter="stopHeroAuto"
          @pointerleave="onHeroLeave"
        >
          <div
            class="clinic-hero-scene relative h-[min(52vw,360px)] w-full max-w-lg perspective-[1600px] sm:h-[400px] lg:h-[440px] lg:max-w-none"
            :style="{ transform: `rotateX(${heroTilt.x}deg) rotateY(${heroTilt.y}deg)` }"
          >
            <button
              v-for="(room, index) in rooms.slice(0, 7)"
              :key="`hero-${room.id}`"
              type="button"
              class="clinic-hero-card absolute left-[14%] top-[6%] h-[82%] w-[72%] overflow-hidden rounded-[1.5rem] border-0 bg-transparent p-0"
              :style="heroCardStyle(index)"
              :aria-label="room.title"
              @click="heroActive = index; scrollToRoom(room.id)"
            >
              <span class="clinic-hero-card-face relative block size-full overflow-hidden rounded-[1.5rem] ring-1 ring-white/15">
                <img
                  :src="room.image"
                  :alt="room.title"
                  class="size-full object-cover"
                  width="720"
                  height="900"
                  :loading="index < 3 ? 'eager' : 'lazy'"
                  draggable="false"
                >
                <span class="absolute inset-0 bg-gradient-to-t from-band/85 via-transparent to-transparent" />
                <span class="absolute inset-x-0 bottom-0 p-4">
                  <span class="block text-[10px] font-semibold tracking-[0.18em] text-gold">{{ room.eyebrow }}</span>
                  <span class="mt-1 block text-sm font-bold text-on-band sm:text-base">{{ room.title }}</span>
                </span>
              </span>
            </button>
            <div
              class="pointer-events-none absolute bottom-0 left-1/2 h-10 w-[65%] -translate-x-1/2 rounded-[100%] bg-black/50 blur-2xl"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    </header>

    <!-- Sticky strip -->
    <div class="clinic-strip sticky top-[var(--clinic-header-offset,4.5rem)] z-20 border-y border-mist-deep/80 bg-surface/90 backdrop-blur-xl">
      <div class="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <div class="hidden shrink-0 sm:block">
          <p class="text-[11px] tracking-[0.18em] text-gold">
            فضاها
          </p>
          <p class="mt-0.5 font-mono text-[10px] text-ink-muted">
            {{ String(activeIndex + 1).padStart(2, '0') }}/{{ String(rooms.length).padStart(2, '0') }}
          </p>
        </div>
        <div
          ref="stripRef"
          class="flex min-w-0 flex-1 gap-2.5 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          @wheel="onStripWheel"
        >
          <button
            v-for="(room, i) in rooms"
            :key="room.id"
            type="button"
            class="clinic-thumb group relative h-[4.25rem] w-[5rem] shrink-0 overflow-hidden rounded-2xl transition duration-400 sm:h-[4.75rem] sm:w-[5.5rem]"
            :class="activeId === room.id ? 'clinic-thumb-active' : 'clinic-thumb-idle'"
            :aria-current="activeId === room.id ? 'true' : undefined"
            @click="scrollToRoom(room.id)"
          >
            <img
              :src="room.image"
              :alt="room.title"
              class="size-full object-cover transition duration-500 group-hover:scale-110"
              loading="lazy"
            >
            <span class="absolute inset-0 bg-gradient-to-t from-band/70 via-band/10 to-transparent" />
            <span
              class="absolute inset-x-0 bottom-1.5 text-center font-mono text-[10px] font-semibold"
              :class="activeId === room.id ? 'text-gold' : 'text-on-band/90'"
            >
              {{ String(i + 1).padStart(2, '0') }}
            </span>
          </button>
        </div>
      </div>
      <div
        class="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-l from-transparent via-gold/50 to-transparent"
        aria-hidden="true"
      />
    </div>

    <!-- Rooms -->
    <div class="relative mx-auto max-w-7xl lg:grid lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-10 lg:px-8">
      <nav
        class="sticky top-[calc(var(--clinic-header-offset,4.5rem)+6rem)] z-10 hidden max-h-[calc(100vh-9rem)] self-start overflow-y-auto py-12 lg:block"
        aria-label="فهرست فضاهای کلینیک"
      >
        <div class="clinic-side-rail relative">
          <ol class="relative space-y-1">
            <li
              v-for="(room, i) in rooms"
              :key="room.id"
            >
              <button
                type="button"
                class="clinic-side-item group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-right transition"
                :class="activeId === room.id
                  ? 'bg-green-soft/80 text-green-deep'
                  : 'text-ink-muted hover:bg-mist hover:text-ink'"
                @click="scrollToRoom(room.id)"
              >
                <span
                  class="clinic-side-dot size-2.5 shrink-0 rounded-full ring-2 ring-surface transition"
                  :class="activeId === room.id ? 'bg-gold scale-125' : 'bg-mist-deep group-hover:bg-green-deep'"
                  aria-hidden="true"
                />
                <span class="font-mono text-[10px] opacity-60">{{ String(i + 1).padStart(2, '0') }}</span>
                <span class="text-sm font-medium">{{ room.eyebrow }}</span>
              </button>
            </li>
          </ol>
        </div>
      </nav>

      <div class="px-4 sm:px-6 lg:px-0">
        <article
          v-for="(room, i) in rooms"
          :id="`clinic-room-${room.id}`"
          :key="room.id"
          class="clinic-room scroll-mt-[calc(var(--clinic-header-offset,4.5rem)+6.25rem)] border-b border-mist/80 py-14 last:border-b-0 sm:py-16 lg:py-20"
        >
          <SiteReveal :variant="i % 2 === 0 ? 'tilt' : 'zoom'" delay="30ms">
            <div
              class="grid items-center gap-8 lg:grid-cols-12 lg:gap-12"
              :class="i % 2 === 1 ? 'lg:[&>*:first-child]:order-2' : ''"
            >
              <div
                class="clinic-room-stage relative lg:col-span-7"
                @pointermove="onRoomPointer($event, ($event.currentTarget as HTMLElement))"
                @pointerleave="resetRoomPointer($event.currentTarget as HTMLElement)"
              >
                <div class="clinic-room-scene perspective-[1400px]">
                  <div class="clinic-room-frame group relative overflow-hidden rounded-[1.75rem] bg-mist ring-1 ring-mist-deep">
                    <div class="aspect-[16/11] sm:aspect-[5/3]">
                      <img
                        :src="room.image"
                        :alt="room.title"
                        class="clinic-room-img size-full object-cover transition duration-700"
                        :loading="i < 2 ? 'eager' : 'lazy'"
                      >
                    </div>
                    <div
                      class="pointer-events-none absolute inset-0 bg-gradient-to-tr from-band/25 via-transparent to-gold/10 opacity-60"
                      aria-hidden="true"
                    />
                    <span class="clinic-room-badge absolute top-4 inset-inline-start-4 inline-flex items-center gap-2 rounded-2xl bg-panel/90 px-3.5 py-1.5 font-mono text-[11px] font-bold text-green-deep shadow-[0_12px_28px_rgba(15,23,42,0.12)] ring-1 ring-mist-deep backdrop-blur-md">
                      <span class="size-1.5 rounded-full bg-gold" aria-hidden="true" />
                      {{ String(i + 1).padStart(2, '0') }} / {{ String(rooms.length).padStart(2, '0') }}
                    </span>
                    <div
                      class="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-white to-transparent opacity-70"
                      aria-hidden="true"
                    />
                  </div>
                  <div
                    class="pointer-events-none absolute -bottom-4 left-1/2 h-10 w-[70%] -translate-x-1/2 rounded-[100%] bg-green-deep/20 blur-2xl"
                    aria-hidden="true"
                  />
                </div>
              </div>

              <div class="clinic-room-copy lg:col-span-5">
                <p class="text-[11px] font-semibold tracking-[0.2em] text-gold">
                  {{ room.eyebrow }}
                </p>
                <h2 class="mt-3 text-2xl font-bold leading-snug tracking-tight text-ink sm:text-3xl">
                  {{ room.title }}
                </h2>
                <p class="mt-4 text-[15px] leading-8 text-ink-muted">
                  {{ room.description }}
                </p>
                <div class="mt-8 flex flex-wrap gap-2">
                  <button
                    v-if="i < rooms.length - 1"
                    type="button"
                    class="inline-flex items-center gap-2 rounded-2xl bg-panel px-4 py-2.5 text-sm font-semibold text-ink ring-1 ring-mist-deep transition hover:-translate-y-0.5 hover:bg-green-soft hover:text-green-deep hover:shadow-[0_12px_28px_rgba(15,118,110,0.12)]"
                    @click="scrollToRoom(rooms[i + 1]!.id)"
                  >
                    فضای بعد: {{ rooms[i + 1]!.eyebrow }}
                    <span aria-hidden="true">←</span>
                  </button>
                  <NuxtLink
                    v-else
                    to="#clinic-next"
                    class="inline-flex rounded-2xl bg-green-deep px-4 py-2.5 text-sm font-semibold text-on-primary shadow-[0_12px_28px_rgba(15,118,110,0.28)] transition hover:-translate-y-0.5 hover:brightness-110"
                  >
                    ادامه: خدمات و مقالات
                  </NuxtLink>
                </div>
              </div>
            </div>
          </SiteReveal>
        </article>
      </div>
    </div>
  </div>
</template>

<style scoped>
.clinic-tour {
  --clinic-header-offset: 4.75rem;
}

.clinic-hero-bg {
  transform: scale(1.08);
  transition: opacity 0.7s ease;
  filter: saturate(0.92);
}

.clinic-floor {
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
  transform: perspective(1000px) rotateX(68deg) scale(1.4);
  transform-origin: center bottom;
}

.clinic-hero-scene {
  transform-style: preserve-3d;
  transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
  will-change: transform;
}

.clinic-hero-card {
  transform-style: preserve-3d;
  transition:
    transform 0.65s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.45s ease;
  will-change: transform, opacity;
  cursor: pointer;
}

.clinic-hero-card-face {
  box-shadow:
    0 22px 50px rgba(0, 0, 0, 0.45),
    0 40px 90px rgba(15, 118, 110, 0.18);
}

.clinic-orb {
  animation: clinic-drift 16s ease-in-out infinite;
}
.clinic-orb-b {
  animation-duration: 21s;
  animation-direction: reverse;
}

.clinic-thumb {
  transform: translateZ(0);
  box-shadow: 0 8px 20px rgba(15, 23, 42, 0.06);
}
.clinic-thumb-idle {
  outline: 1px solid var(--color-mist-deep);
  outline-offset: -1px;
}
.clinic-thumb-active {
  outline: 2px solid var(--color-gold);
  outline-offset: 0;
  transform: translateY(-4px) scale(1.04);
  box-shadow:
    0 14px 28px rgba(15, 118, 110, 0.18),
    0 0 0 4px color-mix(in oklab, var(--color-gold) 25%, transparent);
}

.clinic-room-stage {
  --rx: 0deg;
  --ry: 0deg;
}

.clinic-room-scene {
  transform-style: preserve-3d;
}

.clinic-room-frame {
  transform-style: preserve-3d;
  transform: rotateX(var(--rx)) rotateY(var(--ry)) translateZ(0);
  transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
  box-shadow:
    0 18px 40px rgba(15, 23, 42, 0.08),
    0 40px 80px rgba(15, 118, 110, 0.08);
  will-change: transform;
}

.clinic-room-stage:hover .clinic-room-img {
  transform: scale(1.04);
}

.clinic-room-badge {
  transform: translateZ(36px);
}

.clinic-room-copy {
  transform: translateZ(12px);
}

@keyframes clinic-drift {
  0%,
  100% {
    transform: translate3d(0, 0, 0);
  }
  50% {
    transform: translate3d(16px, -20px, 0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .clinic-hero-scene,
  .clinic-hero-card,
  .clinic-room-frame,
  .clinic-orb,
  .clinic-orb-b,
  .clinic-floor,
  .clinic-thumb-active {
    animation: none !important;
    transition: none !important;
    transform: none !important;
  }
}

@media (max-width: 1023px) {
  .clinic-floor {
    opacity: 0.2;
    transform: none;
  }
  .clinic-room-frame {
    transform: none !important;
  }
}
</style>
