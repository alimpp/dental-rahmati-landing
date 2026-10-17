<script setup lang="ts">
export type RevealVariant =
  | 'fade'
  | 'soft'
  | 'up'
  | 'rise'
  | 'drop'
  | 'left'
  | 'right'
  | 'zoom'
  | 'bloom'
  | 'expand'
  | 'tilt'
  | 'clip'
  | 'slide'

withDefaults(
  defineProps<{
    variant?: RevealVariant
    delay?: string
  }>(),
  { variant: 'up', delay: '0ms' },
)

const root = ref<HTMLElement | null>(null)
const shown = ref(false)

function isNearView() {
  if (!root.value || typeof window === 'undefined') return false
  const rect = root.value.getBoundingClientRect()
  const vh = window.innerHeight || 0
  // Generous: any overlap with viewport (or just above fold) counts.
  return rect.top < vh + 48 && rect.bottom > -48
}

onMounted(() => {
  if (typeof window === 'undefined') {
    shown.value = true
    return
  }

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    shown.value = true
    return
  }

  let io: IntersectionObserver | null = null
  let failsafe: ReturnType<typeof setTimeout> | null = null

  const cleanup = () => {
    io?.disconnect()
    io = null
    if (failsafe) {
      clearTimeout(failsafe)
      failsafe = null
    }
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('resize', onScroll)
  }

  const reveal = () => {
    if (shown.value) return
    shown.value = true
    cleanup()
  }

  const onScroll = () => {
    if (isNearView()) reveal()
  }

  if (isNearView()) {
    requestAnimationFrame(reveal)
  }

  // threshold 0 + positive bottom margin: more reliable on mobile Safari
  // where opacity/transform + overflow-x-clip can starve higher thresholds.
  io = new IntersectionObserver(
    (entries) => {
      if (!entries[0]?.isIntersecting) return
      reveal()
    },
    { threshold: 0, rootMargin: '64px 0px 64px 0px' },
  )

  if (root.value) io.observe(root.value)

  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll, { passive: true })

  // If IO never fires (stuck main thread / Safari quirk), force-show once near.
  failsafe = setTimeout(() => {
    if (isNearView()) reveal()
  }, 1800)

  onBeforeUnmount(cleanup)
})
</script>

<template>
  <div
    ref="root"
    class="site-reveal"
    :class="[`reveal-${variant}`, shown && 'is-in']"
    :style="{ '--reveal-delay': delay }"
  >
    <slot />
  </div>
</template>
