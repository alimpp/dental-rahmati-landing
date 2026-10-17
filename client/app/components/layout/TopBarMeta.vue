<script setup lang="ts">
defineProps<{
  icon: string
  label: string
  href?: string
}>()
</script>

<template>
  <component
    :is="href ? 'a' : 'div'"
    :href="href"
    class="inline-flex min-w-0 max-w-full items-center gap-2 text-sm text-ink/90 transition-colors duration-100 ease-out hover:text-ink"
  >
    <span
      class="inline-block size-4 shrink-0 bg-ink"
      :style="{
        maskImage: `url(${icon})`,
        WebkitMaskImage: `url(${icon})`,
        maskRepeat: 'no-repeat',
        WebkitMaskRepeat: 'no-repeat',
        maskPosition: 'center',
        WebkitMaskPosition: 'center',
        maskSize: 'contain',
        WebkitMaskSize: 'contain',
      }"
      aria-hidden="true"
    />
    <span class="min-w-0 truncate leading-none">{{ label }}</span>
  </component>
</template>
