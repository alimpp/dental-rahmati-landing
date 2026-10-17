<script setup lang="ts">
defineProps<{
  src: string
  size?: string
}>()
</script>

<template>
  <span
    class="inline-block shrink-0 bg-current"
    :class="size || 'size-5'"
    :style="{
      maskImage: `url(${src})`,
      WebkitMaskImage: `url(${src})`,
      maskRepeat: 'no-repeat',
      WebkitMaskRepeat: 'no-repeat',
      maskPosition: 'center',
      WebkitMaskPosition: 'center',
      maskSize: 'contain',
      WebkitMaskSize: 'contain',
    }"
    aria-hidden="true"
  />
</template>
