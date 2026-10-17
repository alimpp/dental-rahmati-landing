<script setup lang="ts">
const progress = ref(0)
const visible = ref(false)

function updateProgress() {
  const doc = document.documentElement
  const scrollable = doc.scrollHeight - window.innerHeight
  if (scrollable <= 8) {
    progress.value = 0
    visible.value = false
    return
  }
  const next = Math.min(100, Math.max(0, (window.scrollY / scrollable) * 100))
  progress.value = next
  visible.value = window.scrollY > 12
}

const onScroll = () => {
  updateProgress()
}

onMounted(() => {
  updateProgress()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onScroll)
})

watch(
  () => useRoute().fullPath,
  async () => {
    await nextTick()
    requestAnimationFrame(updateProgress)
  },
)
</script>

<template>
  <div
    class="pointer-events-none fixed inset-x-0 top-0 z-50 h-[3px] bg-transparent"
    aria-hidden="true"
  >
    <div
      class="h-full w-full origin-right bg-gold transition-[transform,opacity] duration-150 ease-out"
      :class="visible ? 'opacity-100' : 'opacity-0'"
      :style="{ transform: `scaleX(${progress / 100})` }"
    />
  </div>
</template>
