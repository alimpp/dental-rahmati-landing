<script setup lang="ts">
defineProps<{
  active: boolean
}>()
</script>

<template>
  <span
    class="inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-medium"
    :class="active ? 'bg-green-soft text-green-deep' : 'bg-mist text-ink-muted'"
  >
    {{ active ? 'فعال' : 'غیرفعال' }}
  </span>
</template>
