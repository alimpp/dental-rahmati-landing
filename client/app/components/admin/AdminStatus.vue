<script setup lang="ts">
withDefaults(defineProps<{
  active: boolean
  clickable?: boolean
  busy?: boolean
}>(), {
  clickable: false,
  busy: false,
})

const emit = defineEmits<{
  toggle: []
}>()
</script>

<template>
  <button
    v-if="clickable"
    type="button"
    class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-deep/30 disabled:opacity-60"
    :class="active
      ? 'bg-green-soft text-green-deep hover:brightness-95'
      : 'bg-mist text-ink-muted hover:bg-mist/80'"
    :disabled="busy"
    :title="active ? 'کلیک برای غیرفعال‌کردن' : 'کلیک برای فعال‌کردن'"
    :aria-pressed="active"
    @click.stop="emit('toggle')"
  >
    <span
      class="size-1.5 rounded-full"
      :class="active ? 'bg-green-deep' : 'bg-ink-muted/50'"
      aria-hidden="true"
    />
    {{ active ? 'فعال' : 'غیرفعال' }}
  </button>
  <span
    v-else
    class="inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-medium"
    :class="active ? 'bg-green-soft text-green-deep' : 'bg-mist text-ink-muted'"
  >
    {{ active ? 'فعال' : 'غیرفعال' }}
  </span>
</template>
