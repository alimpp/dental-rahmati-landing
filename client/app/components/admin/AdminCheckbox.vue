<script setup lang="ts">
const model = defineModel<boolean>({ default: false })

defineProps<{
  label: string
}>()
</script>

<template>
  <label class="inline-flex cursor-pointer items-center gap-3 select-none">
    <span
      class="relative inline-flex size-7 shrink-0 items-center justify-center rounded-lg border-2 transition"
      :class="model
        ? 'border-green-deep bg-green-deep text-ink shadow-[0_0_0_4px_rgba(196,160,53,0.22)]'
        : 'border-mist-deep bg-white text-transparent hover:border-green-deep'"
    >
      <input
        v-model="model"
        class="absolute inset-0 opacity-0"
        type="checkbox"
      >
      <svg viewBox="0 0 16 16" class="size-4" fill="none" aria-hidden="true">
        <path
          d="M3.2 8.3 6.4 11.4 12.8 4.6"
          stroke="currentColor"
          stroke-width="2.2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </span>
    <span class="text-sm font-medium text-ink">{{ label }}</span>
  </label>
</template>
