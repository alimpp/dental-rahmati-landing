<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    text: string
    as?: string
    speed?: number
    startDelay?: number
    caret?: boolean
  }>(),
  {
    as: 'span',
    speed: 28,
    startDelay: 120,
    caret: true,
  },
)

const root = ref<HTMLElement | null>(null)
const shown = ref('')
const done = ref(false)
let timer: ReturnType<typeof setTimeout> | null = null
let started = false
let io: IntersectionObserver | null = null

function clear() {
  if (timer) {
    clearTimeout(timer)
    timer = null
  }
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
    shown.value = full
    done.value = true
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
  typeAll()
}

onMounted(async () => {
  await nextTick()
  if (!root.value || typeof window === 'undefined') {
    start()
    return
  }

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    start()
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
      v-if="caret && !done"
      class="site-type-caret"
      aria-hidden="true"
    >|</span>
  </component>
</template>
