<script setup lang="ts">
import { statModule } from '~/modules'

const statDS = statModule.store
const items = computed(() => statDS.getVisibleItems)

await statModule.controller.getList()

function maskStyle(icon: string) {
  return {
    maskImage: `url(${icon})`,
    WebkitMaskImage: `url(${icon})`,
    maskRepeat: 'no-repeat',
    WebkitMaskRepeat: 'no-repeat',
    maskPosition: 'center',
    WebkitMaskPosition: 'center',
    maskSize: 'contain',
    WebkitMaskSize: 'contain',
  }
}
</script>

<template>
  <section v-if="items.length" class="bg-ink py-14 sm:py-16">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <ul class="grid grid-cols-2 gap-6 lg:grid-cols-4 lg:gap-8">
        <li
          v-for="(stat, index) in items"
          :key="stat.id"
          class="reveal-item reveal-item-scale group"
          :style="{ '--reveal-i': index }"
        >
          <div class="flex h-full flex-col border-t border-white/15 pt-5">
            <span
              v-if="stat.icon"
              class="mb-4 inline-block size-5 bg-gold"
              :style="maskStyle(stat.icon)"
              aria-hidden="true"
            />
            <p class="stat-value text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {{ stat.value }}
            </p>
            <p class="mt-3 text-sm leading-7 text-white/65">
              {{ stat.label }}
            </p>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.stat-value {
  font-variant-numeric: tabular-nums;
  animation: stat-count 0.9s cubic-bezier(0.22, 1, 0.36, 1) both;
}

@keyframes stat-count {
  from {
    opacity: 0;
    transform: translateY(10px);
    filter: blur(3px);
  }
  to {
    opacity: 1;
    transform: none;
    filter: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .stat-value {
    animation: none;
  }
}
</style>
