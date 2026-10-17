<script setup lang="ts">
const props = defineProps<{
  items: { label: string; visits: number }[]
}>()

const max = computed(() => Math.max(...props.items.map((item) => item.visits), 1))
</script>

<template>
  <ul class="space-y-3">
    <li v-for="item in items" :key="item.label">
      <div class="mb-1 flex items-center justify-between gap-3 text-xs">
        <span class="truncate text-ink">{{ item.label }}</span>
        <span class="shrink-0 text-gold">{{ item.visits.toLocaleString('fa-IR') }}</span>
      </div>
      <div class="h-2 overflow-hidden rounded-full bg-mist">
        <div
          class="h-full rounded-full bg-gradient-to-l from-gold to-green-deep"
          :style="{ width: `${Math.max(8, (item.visits / max) * 100)}%` }"
        />
      </div>
    </li>
  </ul>
</template>
