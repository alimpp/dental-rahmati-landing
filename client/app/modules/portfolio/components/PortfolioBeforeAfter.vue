<script setup lang="ts">
withDefaults(
  defineProps<{
    beforeSrc: string
    afterSrc: string
    beforeAlt?: string
    afterAlt?: string
    size?: 'card' | 'hero'
  }>(),
  {
    beforeAlt: 'قبل از درمان',
    afterAlt: 'بعد از درمان',
    size: 'hero',
  },
)

const mediaSrc = useMediaSrc()
const root = ref<HTMLElement | null>(null)
const position = ref(52)
const dragging = ref(false)

function setFromClientX(clientX: number) {
  if (!root.value) return
  const rect = root.value.getBoundingClientRect()
  // LTR geometry: 0 = left edge. In RTL page, physical left is still smaller clientX.
  const ratio = (clientX - rect.left) / rect.width
  position.value = Math.min(100, Math.max(0, ratio * 100))
}

function onPointerDown(event: PointerEvent) {
  dragging.value = true
  root.value?.setPointerCapture?.(event.pointerId)
  setFromClientX(event.clientX)
}

function onPointerMove(event: PointerEvent) {
  if (!dragging.value) return
  setFromClientX(event.clientX)
}

function onPointerUp() {
  dragging.value = false
}
</script>

<template>
  <div
    ref="root"
    class="portfolio-ba relative cursor-ew-resize select-none overflow-hidden bg-mist touch-none ring-1 ring-mist-deep"
    :class="size === 'card' ? 'aspect-[16/11] rounded-2xl' : 'aspect-[16/10] rounded-[1.5rem] sm:aspect-[21/11] sm:rounded-[1.75rem]'"
    role="img"
    :aria-label="`${beforeAlt} / ${afterAlt}`"
    @pointerdown.prevent="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="onPointerUp"
    @pointercancel="onPointerUp"
  >
    <!-- After = full base -->
    <img
      :src="mediaSrc(afterSrc)"
      :alt="afterAlt"
      class="absolute inset-0 size-full object-cover"
      width="1200"
      height="750"
      draggable="false"
    >

    <!-- Before = clipped from the right -->
    <img
      :src="mediaSrc(beforeSrc)"
      :alt="beforeAlt"
      class="absolute inset-0 size-full object-cover"
      :style="{ clipPath: `inset(0 ${100 - position}% 0 0)` }"
      width="1200"
      height="750"
      draggable="false"
    >

    <div
      class="absolute inset-y-0 z-10 w-0.5 -translate-x-1/2 bg-white shadow-[0_0_14px_rgba(0,0,0,0.4)]"
      :style="{ left: `${position}%` }"
      aria-hidden="true"
    >
      <span class="absolute left-1/2 top-1/2 flex size-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-panel text-ink shadow-lg ring-1 ring-mist-deep">
        <span class="text-xs font-bold">⇄</span>
      </span>
    </div>

    <span class="pointer-events-none absolute right-3 top-3 z-10 rounded-md bg-band/85 px-2.5 py-1 text-[10px] font-semibold text-on-band backdrop-blur-sm">
      قبل
    </span>
    <span class="pointer-events-none absolute left-3 top-3 z-10 rounded-md bg-green-deep/90 px-2.5 py-1 text-[10px] font-semibold text-on-primary backdrop-blur-sm">
      بعد
    </span>

    <p
      v-if="size === 'hero'"
      class="pointer-events-none absolute inset-x-0 bottom-3 z-10 text-center text-[11px] text-white/85 drop-shadow-md"
    >
      برای مقایسه بکشید
    </p>
  </div>
</template>
