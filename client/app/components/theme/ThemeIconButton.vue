<script setup lang="ts">
withDefaults(defineProps<{
  label?: string
  tone?: 'default' | 'on-band'
}>(), {
  label: 'انتخاب تم سایت',
  tone: 'default',
})

defineOptions({ inheritAttrs: false })

const emit = defineEmits<{ click: [] }>()
const attrs = useAttrs()
</script>

<template>
  <button
    type="button"
    v-bind="attrs"
    :aria-label="label"
    class="inline-flex size-10 items-center justify-center rounded-md transition-colors duration-100 ease-out"
    :class="[
      tone === 'on-band'
        ? 'text-on-band/70 hover:bg-on-band/10 hover:text-gold'
        : 'text-ink hover:bg-mist',
      attrs.class,
    ]"
    @click="emit('click')"
  >
    <span
      class="inline-block size-5 bg-current"
      :style="{
        maskImage: 'url(/icons/palette.svg)',
        WebkitMaskImage: 'url(/icons/palette.svg)',
        maskRepeat: 'no-repeat',
        WebkitMaskRepeat: 'no-repeat',
        maskPosition: 'center',
        WebkitMaskPosition: 'center',
        maskSize: 'contain',
        WebkitMaskSize: 'contain',
      }"
      aria-hidden="true"
    />
  </button>
</template>
