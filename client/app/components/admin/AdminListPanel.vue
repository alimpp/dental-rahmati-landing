<script setup lang="ts">
defineProps<{
  count?: number
  emptyText?: string
}>()
</script>

<template>
  <div class="min-w-0 w-full">
    <!-- Desktop table -->
    <div class="hidden overflow-hidden rounded-2xl border border-mist bg-white md:block">
      <div class="w-full overflow-x-auto">
        <slot name="table" />
      </div>
      <p
        v-if="!(count ?? 0)"
        class="border-t border-mist p-6 text-center text-sm text-ink-muted"
      >
        {{ emptyText || 'موردی نیست' }}
      </p>
    </div>

    <!-- Mobile cards -->
    <div class="grid gap-3 md:hidden">
      <slot name="cards" />
      <p
        v-if="!(count ?? 0)"
        class="rounded-2xl border border-dashed border-mist bg-white px-4 py-10 text-center text-sm text-ink-muted"
      >
        {{ emptyText || 'موردی نیست' }}
      </p>
    </div>
  </div>
</template>
