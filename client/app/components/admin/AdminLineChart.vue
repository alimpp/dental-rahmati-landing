<script setup lang="ts">
import type { TDashboardPoint } from '~/modules/admin/types/index.type'

const props = defineProps<{
  series: TDashboardPoint[]
}>()

const width = 560
const height = 180
const pad = 16

const points = computed(() => {
  const values = props.series.map((item) => item.visits)
  const max = Math.max(...values, 1)
  return props.series.map((item, index) => {
    const x = pad + (index / Math.max(props.series.length - 1, 1)) * (width - pad * 2)
    const y = height - pad - (item.visits / max) * (height - pad * 2)
    return { ...item, x, y }
  })
})

const line = computed(() =>
  points.value.map((item, index) => `${index === 0 ? 'M' : 'L'}${item.x} ${item.y}`).join(' '),
)

const area = computed(() => {
  if (!points.value.length) return ''
  const first = points.value[0]
  const last = points.value[points.value.length - 1]
  return `${line.value} L${last.x} ${height - pad} L${first.x} ${height - pad} Z`
})
</script>

<template>
  <svg :viewBox="`0 0 ${width} ${height}`" class="h-48 w-full" role="img" aria-label="نمودار بازدید ۱۴ روز">
    <defs>
      <linearGradient id="visitFill" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0%" stop-color="#c4a035" stop-opacity="0.28" />
        <stop offset="100%" stop-color="#c4a035" stop-opacity="0" />
      </linearGradient>
    </defs>
    <path :d="area" fill="url(#visitFill)" />
    <path :d="line" fill="none" stroke="#c4a035" stroke-width="2.4" stroke-linecap="round" />
    <circle
      v-for="item in points"
      :key="item.day"
      :cx="item.x"
      :cy="item.y"
      r="3.2"
      fill="#e6c96a"
    />
  </svg>
</template>
