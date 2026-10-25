<script setup lang="ts">
import type { TPortfolioGalleryImage } from '~/modules/portfolio/types/index.type'

const props = defineProps<{
  images: TPortfolioGalleryImage[]
  title?: string
}>()

const mediaSrc = useMediaSrc()
const active = ref<number | null>(null)
const slideDir = ref<'next' | 'prev'>('next')
const scale = ref(1)
const offset = ref({ x: 0, y: 0 })
const dragging = ref(false)
const dragStart = ref({ x: 0, y: 0 })
const offsetStart = ref({ x: 0, y: 0 })
const pinchStartDist = ref(0)
const pinchStartScale = ref(1)

const MIN_SCALE = 1
const MAX_SCALE = 4

const activeImage = computed(() =>
  active.value === null ? null : props.images[active.value] ?? null,
)

function resetZoom() {
  scale.value = 1
  offset.value = { x: 0, y: 0 }
}

function open(index: number) {
  slideDir.value = 'next'
  resetZoom()
  active.value = index
}

function close() {
  active.value = null
  resetZoom()
}

function next() {
  if (active.value === null || !props.images.length) return
  slideDir.value = 'next'
  resetZoom()
  active.value = (active.value + 1) % props.images.length
}

function prev() {
  if (active.value === null || !props.images.length) return
  slideDir.value = 'prev'
  resetZoom()
  active.value = (active.value - 1 + props.images.length) % props.images.length
}

function zoomBy(delta: number) {
  const next = Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale.value + delta))
  scale.value = next
  if (next <= MIN_SCALE) offset.value = { x: 0, y: 0 }
}

function onWheel(event: WheelEvent) {
  if (active.value === null) return
  event.preventDefault()
  zoomBy(event.deltaY < 0 ? 0.2 : -0.2)
}

function onDoubleClick() {
  if (scale.value > 1) resetZoom()
  else scale.value = 2.2
}

function onPointerDown(event: PointerEvent) {
  if (scale.value <= 1) return
  dragging.value = true
  dragStart.value = { x: event.clientX, y: event.clientY }
  offsetStart.value = { ...offset.value }
  ;(event.currentTarget as HTMLElement).setPointerCapture?.(event.pointerId)
}

function onPointerMove(event: PointerEvent) {
  if (!dragging.value) return
  offset.value = {
    x: offsetStart.value.x + (event.clientX - dragStart.value.x),
    y: offsetStart.value.y + (event.clientY - dragStart.value.y),
  }
}

function onPointerUp() {
  dragging.value = false
}

function touchDistance(touches: TouchList) {
  if (touches.length < 2) return 0
  const a = touches[0]!
  const b = touches[1]!
  return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY)
}

function onTouchStart(event: TouchEvent) {
  if (event.touches.length === 2) {
    pinchStartDist.value = touchDistance(event.touches)
    pinchStartScale.value = scale.value
  }
}

function onTouchMove(event: TouchEvent) {
  if (event.touches.length === 2 && pinchStartDist.value > 0) {
    event.preventDefault()
    const dist = touchDistance(event.touches)
    const next = pinchStartScale.value * (dist / pinchStartDist.value)
    scale.value = Math.min(MAX_SCALE, Math.max(MIN_SCALE, next))
    if (scale.value <= MIN_SCALE) offset.value = { x: 0, y: 0 }
  }
}

function onKey(event: KeyboardEvent) {
  if (active.value === null) return
  if (event.key === 'Escape') close()
  if (event.key === 'ArrowRight') next()
  if (event.key === 'ArrowLeft') prev()
  if (event.key === '+' || event.key === '=') zoomBy(0.25)
  if (event.key === '-') zoomBy(-0.25)
  if (event.key === '0') resetZoom()
}

function chevronStyle(point: 'left' | 'right') {
  return {
    maskImage: 'url(/icons/admin-chevron.svg)',
    WebkitMaskImage: 'url(/icons/admin-chevron.svg)',
    maskRepeat: 'no-repeat',
    WebkitMaskRepeat: 'no-repeat',
    maskPosition: 'center',
    WebkitMaskPosition: 'center',
    maskSize: 'contain',
    WebkitMaskSize: 'contain',
    transform: point === 'left' ? 'rotate(90deg)' : 'rotate(-90deg)',
  }
}

onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))

watch(active, (value) => {
  if (!import.meta.client) return
  document.body.style.overflow = value === null ? '' : 'hidden'
})

defineExpose({ open, close })

function tileClass(index: number) {
  if (index === 0) return 'col-span-2 row-span-2 aspect-auto min-h-[14rem] sm:min-h-[18rem] lg:min-h-[22rem]'
  if (index === 3 || index === 7) return 'col-span-2 aspect-[21/10] sm:col-span-1 sm:aspect-[4/3]'
  return 'aspect-[4/3]'
}
</script>

<template>
  <section v-if="images.length" id="gallery" class="scroll-mt-28">
    <div class="flex flex-wrap items-end justify-between gap-3">
      <div>
        <p class="text-[11px] font-medium tracking-[0.18em] text-gold">
          گالری تصاویر
        </p>
        <h2 class="mt-2 text-2xl font-semibold tracking-tight text-ink">
          {{ title || 'نگاهی نزدیک‌تر' }}
        </h2>
      </div>
      <p class="text-[12px] text-ink-muted">
        {{ images.length }} تصویر · کلیک برای بزرگ‌نمایی و ورق زدن
      </p>
    </div>

    <ul class="mt-6 grid auto-rows-fr grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:gap-4">
      <li
        v-for="(image, index) in images"
        :key="`${image.url}-${index}`"
        class="reveal-item reveal-item-scale group"
        :class="tileClass(index)"
        :style="{ '--reveal-i': index }"
      >
        <button
          type="button"
          class="relative block size-full min-h-[8rem] overflow-hidden rounded-2xl bg-mist ring-1 ring-mist-deep transition hover:ring-gold/40"
          @click="open(index)"
        >
          <img
            :src="mediaSrc(image.url)"
            :alt="image.caption || `تصویر ${index + 1}`"
            class="size-full object-cover transition duration-700 group-hover:scale-105"
            width="640"
            height="480"
            loading="lazy"
          >
          <span
            class="pointer-events-none absolute inset-0 bg-gradient-to-t from-band/50 via-transparent to-transparent opacity-0 transition group-hover:opacity-100"
            aria-hidden="true"
          />
          <span
            v-if="image.caption"
            class="absolute inset-x-0 bottom-0 translate-y-1 px-3 pb-3 pt-8 text-right text-[11px] leading-5 text-on-band opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100"
          >
            {{ image.caption }}
          </span>
          <span
            class="absolute left-3 top-3 rounded-full bg-panel/90 px-2 py-1 font-mono text-[10px] font-semibold text-ink opacity-0 transition group-hover:opacity-100"
          >
            {{ String(index + 1).padStart(2, '0') }}
          </span>
        </button>
      </li>
    </ul>

    <Teleport to="body">
      <Transition name="gallery-overlay">
        <div
          v-if="activeImage"
          class="fixed inset-0 z-[90] flex items-center justify-center bg-band/92 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="نمایش گالری"
          @click.self="close"
          @wheel="onWheel"
        >
          <button
            type="button"
            class="absolute left-4 top-4 z-10 rounded-xl bg-on-band/10 px-3 py-2 text-sm text-on-band ring-1 ring-on-band/20 transition hover:bg-on-band/20"
            @click="close"
          >
            بستن
          </button>

          <div class="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 rounded-2xl bg-on-band/10 p-1.5 ring-1 ring-on-band/20 backdrop-blur-md">
            <button
              type="button"
              class="rounded-xl px-3 py-2 text-sm text-on-band transition hover:bg-on-band/15"
              aria-label="کوچک‌نمایی"
              @click="zoomBy(-0.35)"
            >
              −
            </button>
            <button
              type="button"
              class="min-w-[3.5rem] rounded-xl px-2 py-2 text-center text-xs text-on-band/80"
              aria-label="بازنشانی زوم"
              @click="resetZoom"
            >
              {{ Math.round(scale * 100) }}٪
            </button>
            <button
              type="button"
              class="rounded-xl px-3 py-2 text-sm text-on-band transition hover:bg-on-band/15"
              aria-label="بزرگ‌نمایی"
              @click="zoomBy(0.35)"
            >
              +
            </button>
            <span class="mx-1 h-5 w-px bg-on-band/20" aria-hidden="true" />
            <p class="hidden px-2 text-[11px] text-on-band/65 sm:block">
              {{ (active ?? 0) + 1 }} / {{ images.length }}
            </p>
          </div>

          <button
            type="button"
            class="absolute right-4 top-1/2 z-10 flex size-12 -translate-y-1/2 items-center justify-center rounded-full bg-on-band/10 text-on-band ring-1 ring-on-band/20 transition hover:bg-on-band/20"
            aria-label="تصویر بعدی"
            @click="next"
          >
            <span class="inline-block size-6 bg-panel" :style="chevronStyle('right')" aria-hidden="true" />
          </button>
          <button
            type="button"
            class="absolute left-4 top-1/2 z-10 flex size-12 -translate-y-1/2 items-center justify-center rounded-full bg-on-band/10 text-on-band ring-1 ring-on-band/20 transition hover:bg-on-band/20"
            aria-label="تصویر قبلی"
            @click="prev"
          >
            <span class="inline-block size-6 bg-panel" :style="chevronStyle('left')" aria-hidden="true" />
          </button>

          <figure class="relative max-h-[85vh] max-w-5xl overflow-hidden">
            <Transition :name="slideDir === 'next' ? 'gallery-slide-next' : 'gallery-slide-prev'" mode="out-in">
              <div
                :key="active ?? 0"
                class="gallery-slide touch-none select-none"
                :class="scale > 1 ? 'cursor-grab active:cursor-grabbing' : 'cursor-zoom-in'"
                @dblclick="onDoubleClick"
                @pointerdown="onPointerDown"
                @pointermove="onPointerMove"
                @pointerup="onPointerUp"
                @pointercancel="onPointerUp"
                @touchstart.passive="onTouchStart"
                @touchmove="onTouchMove"
              >
                <img
                  :src="mediaSrc(activeImage.url)"
                  :alt="activeImage.caption || title || 'گالری'"
                  class="max-h-[75vh] w-full rounded-2xl object-contain transition-transform duration-150 will-change-transform"
                  :style="{
                    transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
                  }"
                  draggable="false"
                >
                <figcaption
                  v-if="activeImage.caption"
                  class="mt-4 text-center text-sm text-on-band/80"
                >
                  {{ activeImage.caption }}
                </figcaption>
              </div>
            </Transition>
          </figure>
        </div>
      </Transition>
    </Teleport>
  </section>
</template>

<style scoped>
.gallery-overlay-enter-active,
.gallery-overlay-leave-active {
  transition: opacity 0.28s ease;
}
.gallery-overlay-enter-from,
.gallery-overlay-leave-to {
  opacity: 0;
}

.gallery-slide-next-enter-active,
.gallery-slide-next-leave-active,
.gallery-slide-prev-enter-active,
.gallery-slide-prev-leave-active {
  transition:
    opacity 0.32s ease,
    transform 0.32s cubic-bezier(0.22, 1, 0.36, 1);
}

.gallery-slide-next-enter-from {
  opacity: 0;
  transform: translateX(2.5rem) scale(0.98);
}
.gallery-slide-next-leave-to {
  opacity: 0;
  transform: translateX(-2.5rem) scale(0.98);
}

.gallery-slide-prev-enter-from {
  opacity: 0;
  transform: translateX(-2.5rem) scale(0.98);
}
.gallery-slide-prev-leave-to {
  opacity: 0;
  transform: translateX(2.5rem) scale(0.98);
}
</style>
