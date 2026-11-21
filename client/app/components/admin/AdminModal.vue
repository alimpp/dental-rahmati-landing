<script setup lang="ts">
defineProps<{
  open: boolean
  title: string
}>()

const emit = defineEmits<{ close: [] }>()
const slots = useSlots()
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-50 flex items-end justify-center bg-ink/45 p-3 backdrop-blur-[1px] sm:items-center"
      role="dialog"
      aria-modal="true"
    >
      <div
        class="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-[1.5rem] bg-white shadow-[0_24px_60px_rgba(43,48,54,0.18)] ring-1 ring-mist-deep"
        @click.stop
      >
        <header class="flex shrink-0 items-center justify-between gap-3 border-b border-mist px-5 py-4">
          <h2 class="text-lg font-semibold text-ink">{{ title }}</h2>
          <button
            class="inline-flex size-9 items-center justify-center rounded-xl border border-mist text-ink-muted transition hover:bg-mist hover:text-ink"
            type="button"
            aria-label="بستن"
            @click="emit('close')"
          >
            <span class="text-lg leading-none">×</span>
          </button>
        </header>

        <div class="admin-scroll min-h-0 flex-1 overflow-y-auto px-5 py-4">
          <slot />
        </div>

        <footer
          v-if="slots.footer"
          class="shrink-0 border-t border-mist bg-white px-5 py-4"
        >
          <slot name="footer" />
        </footer>
      </div>
    </div>
  </Teleport>
</template>
