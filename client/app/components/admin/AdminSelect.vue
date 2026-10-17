<script setup lang="ts">
export type AdminSelectOption = { value: string; label: string }

const model = defineModel<string>({ default: '' })

const props = withDefaults(
  defineProps<{
    options: AdminSelectOption[]
    placeholder?: string
    allowEmpty?: boolean
  }>(),
  { allowEmpty: true },
)

const open = ref(false)
const root = ref<HTMLElement | null>(null)

const selected = computed(() =>
  props.options.find((item) => item.value === model.value)?.label || props.placeholder || 'انتخاب کنید',
)

function pick(value: string) {
  model.value = value
  open.value = false
}

function onDoc(event: MouseEvent) {
  if (!root.value?.contains(event.target as Node)) open.value = false
}

onMounted(() => document.addEventListener('click', onDoc))
onBeforeUnmount(() => document.removeEventListener('click', onDoc))
</script>

<template>
  <div ref="root" class="relative min-w-[220px]">
    <button
      class="flex w-full items-center justify-between gap-3 rounded-2xl border border-mist bg-white px-4 py-2.5 text-sm shadow-sm transition hover:border-green-soft"
      :class="open ? 'ring-2 ring-green-soft' : ''"
      type="button"
      @click="open = !open"
    >
      <span class="truncate font-medium text-ink">{{ selected }}</span>
      <span
        class="inline-block size-4 text-gold transition"
        :class="open ? 'rotate-180' : ''"
      >
        <AdminIcon src="/icons/admin-chevron.svg" size="size-4" />
      </span>
    </button>
    <ul
      v-if="open"
      class="admin-scroll absolute z-30 mt-2 max-h-72 w-full overflow-auto rounded-2xl border border-mist bg-white py-1 shadow-[0_16px_40px_rgba(43,48,54,0.12)]"
    >
      <li v-if="allowEmpty">
        <button
          class="flex w-full px-4 py-2.5 text-right text-sm transition"
          :class="model === '' ? 'bg-green-soft text-green-deep' : 'text-ink hover:bg-mist/70'"
          type="button"
          @click="pick('')"
        >
          {{ placeholder || 'همه' }}
        </button>
      </li>
      <li v-for="item in options" :key="item.value">
        <button
          class="flex w-full px-4 py-2.5 text-right text-sm transition"
          :class="model === item.value ? 'bg-green-soft text-green-deep' : 'text-ink hover:bg-mist/70'"
          type="button"
          @click="pick(item.value)"
        >
          {{ item.label }}
        </button>
      </li>
    </ul>
  </div>
</template>
