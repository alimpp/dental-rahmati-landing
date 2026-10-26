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
    class="inline-flex min-w-0 max-w-full items-center gap-2 text-[13px] text-on-primary/90 transition-colors duration-150 hover:text-on-primary"
  >
    <span
      class="inline-block size-3.5 shrink-0 bg-on-primary/90"
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
