<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    text: string
    as?: string
    speed?: number
    startDelay?: number
    caret?: boolean
    /** When false (default), renders full text immediately — safe for SEO/SSR headings. */
    animate?: boolean
  }>(),
  {
    as: 'span',
    speed: 28,
    startDelay: 120,
    caret: true,
    animate: false,
  },
)

const root = ref<HTMLElement | null>(null)
const shown = ref(props.text || '')
const done = ref(true)
let timer: ReturnType<typeof setTimeout> | null = null
let started = false
let io: IntersectionObserver | null = null

function clear() {
  if (timer) {
    clearTimeout(timer)
    timer = null
  }
}

function showFull() {
  clear()
  shown.value = props.text || ''
  done.value = true
  started = true
}

function typeAll() {
  clear()
  const full = props.text || ''
  if (!full) {
    shown.value = ''
    done.value = true
    return
  }

  if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    showFull()
    return
  }

  let i = 0
  shown.value = ''
  done.value = false

  const tick = () => {
    i += 1
    shown.value = full.slice(0, i)
    if (i >= full.length) {
      done.value = true
      return
    }
    timer = setTimeout(tick, props.speed)
  }

  timer = setTimeout(tick, props.startDelay)
}

function start() {
  if (started) return
  started = true
  if (!props.animate) {
    showFull()
    return
  }
  typeAll()
}

onMounted(async () => {
  if (!props.animate) {
    showFull()
    return
  }

  await nextTick()
  if (!root.value || typeof window === 'undefined') {
    start()
    return
  }

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    showFull()
    return
  }

  io = new IntersectionObserver(
    (entries) => {
      if (!entries[0]?.isIntersecting) return
      start()
      io?.disconnect()
      io = null
    },
    { threshold: 0.12, rootMargin: '48px' },
  )
  io.observe(root.value)
})

watch(
  () => props.text,
  () => {
    started = false
    if (!props.animate) {
      showFull()
      return
    }
    done.value = false
    shown.value = ''
    start()
  },
)

onBeforeUnmount(() => {
  clear()
  io?.disconnect()
  io = null
})
</script>

<template>
  <component
    :is="as"
    ref="root"
    class="site-type-text inline"
  >
    {{ shown }}<span
      v-if="animate && caret && !done"
      class="site-type-caret"
      aria-hidden="true"
    >|</span>
  </component>
</template>
