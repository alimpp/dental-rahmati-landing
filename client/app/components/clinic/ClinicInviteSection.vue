<script setup lang="ts">
import { CLINIC_ROOMS } from '~/data/clinic-rooms'

const rooms = CLINIC_ROOMS
const previewRooms = computed(() => rooms.slice(0, 8))

const stageRef = ref<HTMLElement | null>(null)
const tilt = reactive({ x: 0, y: 0 })
const active = ref(0)

let autoTimer: ReturnType<typeof setInterval> | null = null

function onPointerMove(event: PointerEvent) {
  const el = stageRef.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  const nx = (event.clientX - rect.left) / rect.width - 0.5
  const ny = (event.clientY - rect.top) / rect.height - 0.5
  tilt.x = ny * -7
  tilt.y = nx * 9
}

function onStageLeave() {
  tilt.x = 0
  tilt.y = 0
  startAuto()
}

function setActive(index: number) {
  active.value = index
}

function startAuto() {
  stopAuto()
  autoTimer = setInterval(() => {
    active.value = (active.value + 1) % previewRooms.value.length
  }, 3200)
}

function stopAuto() {
  if (autoTimer) {
    clearInterval(autoTimer)
    autoTimer = null
  }
}

onMounted(() => {
  startAuto()
})

onBeforeUnmount(() => {
  stopAuto()
})

/** Fan layout offsets for stacked 3D frames */
function cardStyle(index: number) {
  const total = previewRooms.value.length
  let wrapped = index - active.value
  if (wrapped > total / 2) wrapped -= total
  if (wrapped < -total / 2) wrapped += total

  const abs = Math.abs(wrapped)
  const isActive = wrapped === 0

  return {
    zIndex: isActive ? 20 : 10 - abs,
    opacity: abs > 3 ? 0 : 1 - abs * 0.18,
    transform: `
      translate3d(${wrapped * 9}%, ${Math.abs(wrapped) * 2.2}%, ${isActive ? 80 : 40 - abs * 28}px)
      rotateY(${wrapped * -14}deg)
      rotateX(${abs * 2.5}deg)
      scale(${isActive ? 1 : 0.88 - abs * 0.04})
    `,
    filter: isActive ? 'none' : `brightness(${1 - abs * 0.12})`,
  }
}
</script>

<template>
  <section
    class="clinic-invite relative isolate flex min-h-[100svh] w-full items-center overflow-hidden bg-band text-on-band"
    aria-labelledby="clinic-invite-heading"
  >
    <!-- Atmosphere / depth floor -->
    <div class="pointer-events-none absolute inset-0" aria-hidden="true">
      <img
        :src="previewRooms[active]?.image || '/clinic/02-lobby.jpg'"
        alt=""
        class="clinic-invite-bg absolute inset-0 size-full object-cover opacity-35 transition-opacity duration-700"
      >
      <div class="absolute inset-0 bg-gradient-to-l from-band via-band/85 to-band/55" />
      <div class="absolute inset-0 bg-gradient-to-t from-band via-transparent to-band/40" />
      <div class="clinic-invite-orb absolute -right-32 top-1/4 size-[32rem] rounded-full bg-green-deep/30 blur-3xl" />
      <div class="clinic-invite-orb clinic-invite-orb-b absolute -left-24 bottom-0 size-[24rem] rounded-full bg-gold/15 blur-3xl" />
      <div class="clinic-invite-floor absolute inset-x-0 bottom-0 h-[42%] opacity-40" />
    </div>

    <div
      class="relative mx-auto grid w-full max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-12 lg:gap-8 lg:px-8 lg:py-0"
    >
      <!-- Copy -->
      <div class="order-2 flex flex-col justify-center lg:order-1 lg:col-span-5 lg:min-h-[100svh] lg:py-24">
        <p
          class="reveal-item reveal-item-fade text-[11px] font-semibold tracking-[0.22em] text-gold"
          style="--reveal-i: 0"
        >
          کلینیک ما
        </p>
        <h2
          id="clinic-invite-heading"
          class="reveal-item mt-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15]"
          style="--reveal-i: 1"
        >
          ۱۲ فضای کلینیک
          <span class="mt-1 block text-on-band/55">جهانشهر را ببینید</span>
        </h2>
        <p
          class="reveal-item reveal-item-fade mt-5 max-w-md text-[15px] leading-8 text-on-band/70"
          style="--reveal-i: 2"
        >
          تور تصویری ورودی، پذیرش، یونیت‌ها، دیجیتال، VIP و استریل — قدم‌به‌قدم داخل کلینیک، بدون شلوغی.
        </p>

        <div
          class="reveal-item reveal-item-left mt-7 flex flex-wrap gap-2"
          style="--reveal-i: 3"
        >
          <span
            v-for="room in rooms.slice(0, 5)"
            :key="room.id"
            class="rounded-lg bg-on-band/10 px-3 py-1.5 text-[11px] font-medium leading-none text-on-band/80 ring-1 ring-on-band/15"
          >
            {{ room.eyebrow }}
          </span>
          <span class="rounded-lg bg-on-band/10 px-3 py-1.5 text-[11px] font-medium leading-none text-gold ring-1 ring-gold/30">
            +{{ rooms.length - 5 }} فضای دیگر
          </span>
        </div>

        <div
          class="reveal-item reveal-item-scale mt-9 flex flex-wrap items-center gap-4"
          style="--reveal-i: 4"
        >
          <NuxtLink
            to="/clinic"
            class="clinic-invite-cta inline-flex items-center gap-2 rounded-2xl bg-gold px-6 py-3.5 text-sm font-bold text-on-accent shadow-[0_16px_40px_rgba(34,211,238,0.28)] transition hover:-translate-y-0.5 hover:brightness-110"
          >
            ورود به تور کلینیک
            <span aria-hidden="true">←</span>
          </NuxtLink>
          <p class="text-sm text-on-band/45">
            {{ rooms.length }} فضای واقعی · عکس و توضیح کوتاه
          </p>
        </div>
      </div>

      <!-- 3D gallery stage -->
      <div
        ref="stageRef"
        class="order-1 flex min-h-[22rem] items-center justify-center sm:min-h-[28rem] lg:order-2 lg:col-span-7 lg:min-h-[100svh]"
        @pointermove="onPointerMove"
        @pointerenter="stopAuto"
        @pointerleave="onStageLeave"
      >
        <div
          class="clinic-invite-scene relative h-[min(58vw,420px)] w-full max-w-xl perspective-[1600px] sm:h-[460px] lg:h-[520px] lg:max-w-none"
          :style="{
            transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          }"
        >
          <div
            class="absolute left-1/2 top-1/2 size-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-green-deep/20 blur-3xl"
            aria-hidden="true"
          />

          <button
            v-for="(room, index) in previewRooms"
            :key="room.id"
            type="button"
            class="clinic-invite-card absolute left-[12%] top-[8%] h-[78%] w-[76%] overflow-hidden rounded-[1.5rem] border-0 bg-transparent p-0 text-start focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
            :style="cardStyle(index)"
            :aria-pressed="active === index"
            :aria-label="room.title"
            @click="setActive(index)"
          >
            <span class="clinic-invite-card-face relative block size-full overflow-hidden rounded-[1.5rem] ring-1 ring-white/15">
              <img
                :src="room.image"
                :alt="room.title"
                class="size-full object-cover"
                width="720"
                height="900"
                loading="lazy"
                draggable="false"
              >
              <span class="absolute inset-0 bg-gradient-to-t from-band/90 via-band/20 to-transparent" />
              <span class="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                <span class="block text-[10px] font-semibold tracking-[0.18em] text-gold">
                  {{ room.eyebrow }}
                </span>
                <span class="mt-1 block text-base font-bold text-on-band sm:text-lg">
                  {{ room.title }}
                </span>
              </span>
              <span
                class="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-white/50 to-transparent"
                aria-hidden="true"
              />
            </span>
          </button>

          <!-- Deck shadow / base plate -->
          <div
            class="pointer-events-none absolute bottom-[2%] left-1/2 h-8 w-[70%] -translate-x-1/2 rounded-[100%] bg-black/45 blur-2xl"
            aria-hidden="true"
          />
        </div>
      </div>
    </div>

    <!-- Room dots -->
    <div
      class="absolute inset-x-0 bottom-6 z-20 flex justify-center gap-1.5 sm:bottom-8"
      role="tablist"
      aria-label="فضاهای کلینیک"
    >
      <button
        v-for="(room, index) in previewRooms"
        :key="`dot-${room.id}`"
        type="button"
        class="size-2 rounded-full transition"
        :class="active === index ? 'w-6 bg-gold' : 'bg-on-band/30 hover:bg-on-band/50'"
        :aria-label="room.eyebrow"
        :aria-selected="active === index"
        @click="setActive(index)"
      />
    </div>
  </section>
</template>

<style scoped>
.clinic-invite-bg {
  transform: scale(1.08);
  filter: saturate(0.9);
}

.clinic-invite-floor {
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
  mask-image: linear-gradient(to top, black 5%, transparent 90%);
  transform: perspective(1000px) rotateX(68deg) scale(1.4);
  transform-origin: center bottom;
}

.clinic-invite-scene {
  transform-style: preserve-3d;
  transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
  will-change: transform;
}

.clinic-invite-card {
  transform-style: preserve-3d;
  transition:
    transform 0.65s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.45s ease,
    filter 0.45s ease;
  will-change: transform, opacity;
  cursor: pointer;
}

.clinic-invite-card-face {
  transform-style: preserve-3d;
  box-shadow:
    0 20px 50px rgba(0, 0, 0, 0.45),
    0 40px 90px rgba(15, 118, 110, 0.18);
}

.clinic-invite-orb {
  animation: clinic-invite-drift 16s ease-in-out infinite;
}
.clinic-invite-orb-b {
  animation-duration: 20s;
  animation-direction: reverse;
}

.clinic-invite-cta:active {
  transform: translateY(0);
}

@keyframes clinic-invite-drift {
  0%,
  100% {
    transform: translate3d(0, 0, 0);
  }
  50% {
    transform: translate3d(18px, -22px, 0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .clinic-invite-scene,
  .clinic-invite-card,
  .clinic-invite-orb,
  .clinic-invite-orb-b,
  .clinic-invite-floor,
  .clinic-invite-bg {
    animation: none !important;
    transition: none !important;
  }

  .clinic-invite-scene {
    transform: none !important;
  }
}

@media (max-width: 1023px) {
  .clinic-invite-floor {
    opacity: 0.22;
    transform: none;
  }
}
</style>
