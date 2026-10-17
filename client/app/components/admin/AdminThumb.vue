<script setup lang="ts">
const props = defineProps<{
  src?: string | null
  alt?: string
}>()

const mediaSrc = useMediaSrc()
const url = computed(() => mediaSrc(props.src))
</script>

<template>
  <div class="size-14 overflow-hidden rounded-xl bg-mist ring-1 ring-mist-deep">
    <img
      v-if="url"
      :src="url"
      :alt="alt || ''"
      class="size-full object-cover"
    >
  </div>
</template>
