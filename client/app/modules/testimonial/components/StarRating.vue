<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    modelValue?: number
    /** Display-only rating (1–5) */
    value?: number
    interactive?: boolean
    size?: 'sm' | 'md' | 'lg'
    label?: string
  }>(),
  {
    modelValue: 0,
    value: 0,
    interactive: false,
    size: 'md',
    label: 'امتیاز',
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

const hover = ref(0)
const burst = ref(0)

const current = computed(() =>
  props.interactive ? props.modelValue : props.value,
)

const shown = computed(() => {
  if (props.interactive && hover.value) return hover.value
  return current.value || 0
})

const sizeClass = computed(() => {
  if (props.size === 'sm') return 'size-4'
  if (props.size === 'lg') return 'size-8 sm:size-9'
  return 'size-6 sm:size-7'
})

function pick(n: number) {
  if (!props.interactive) return
  emit('update:modelValue', n)
  burst.value = n
  window.setTimeout(() => {
    if (burst.value === n) burst.value = 0
  }, 420)
}
</script>

<template>
  <div
    class="star-rating inline-flex items-center gap-1"
    :class="{ 'star-rating--interactive': interactive }"
    role="group"
    :aria-label="label"
  >
    <button
      v-for="n in 5"
      :key="n"
      type="button"
      class="star-rating__btn relative inline-flex items-center justify-center rounded-md transition duration-200"
      :class="interactive
        ? 'cursor-pointer hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold'
        : 'cursor-default'"
      :disabled="!interactive"
      :aria-label="`${n} از ۵`"
      :aria-pressed="interactive ? modelValue === n : undefined"
      @mouseenter="interactive && (hover = n)"
      @mouseleave="interactive && (hover = 0)"
      @focus="interactive && (hover = n)"
      @blur="interactive && (hover = 0)"
      @click="pick(n)"
    >
      <span
        class="star-rating__glyph block"
        :class="[
          sizeClass,
          n <= shown ? 'is-on' : 'is-off',
          burst === n ? 'is-burst' : '',
        ]"
        aria-hidden="true"
      />
    </button>
  </div>
</template>

<style scoped>
.star-rating__glyph {
  background: color-mix(in srgb, var(--color-mist-deep) 80%, transparent);
  -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M12 2.6l2.7 6.2 6.7.6-5.1 4.4 1.6 6.5L12 16.8 6.1 20.3l1.6-6.5L2.6 9.4l6.7-.6L12 2.6z'/%3E%3C/svg%3E")
    center / contain no-repeat;
  mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M12 2.6l2.7 6.2 6.7.6-5.1 4.4 1.6 6.5L12 16.8 6.1 20.3l1.6-6.5L2.6 9.4l6.7-.6L12 2.6z'/%3E%3C/svg%3E")
    center / contain no-repeat;
  transition:
    background 0.25s ease,
    transform 0.35s cubic-bezier(0.22, 1, 0.36, 1),
    filter 0.35s ease;
}

.star-rating__glyph.is-on {
  background: var(--color-gold);
  filter: drop-shadow(0 4px 10px color-mix(in srgb, var(--color-gold) 45%, transparent));
}

.star-rating__glyph.is-burst {
  animation: star-pop 0.42s cubic-bezier(0.22, 1, 0.36, 1);
}

@keyframes star-pop {
  0% { transform: scale(0.7) rotate(-12deg); }
  55% { transform: scale(1.28) rotate(6deg); }
  100% { transform: scale(1) rotate(0deg); }
}

@media (prefers-reduced-motion: reduce) {
  .star-rating__glyph.is-burst {
    animation: none;
  }
  .star-rating__btn {
    transition: none;
  }
}
</style>
