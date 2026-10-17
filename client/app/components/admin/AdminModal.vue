<script setup lang="ts">
defineProps<{
  open: boolean
  title: string
}>()

const emit = defineEmits<{ close: [] }>()
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-3 backdrop-blur-[1px] sm:items-center"
      @click.self="emit('close')"
    >
      <div class="admin-scroll max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[1.5rem] bg-white p-5 shadow-[0_24px_60px_rgba(43,48,54,0.16)] ring-1 ring-mist-deep">
        <div class="mb-4 flex items-center justify-between gap-3">
          <h2 class="text-lg font-semibold text-ink">{{ title }}</h2>
          <button
            class="inline-flex size-9 items-center justify-center rounded-xl border border-mist text-ink-muted transition hover:bg-mist hover:text-ink"
            type="button"
            aria-label="بستن"
            @click="emit('close')"
          >
            <span class="text-lg leading-none">×</span>
          </button>
        </div>
        <slot />
      </div>
    </div>
  </Teleport>
</template>
