<script setup lang="ts">
import { adminModule } from '~/modules'

const model = defineModel<string>({ default: '' })

const props = withDefaults(
  defineProps<{
    label: string
    kind?: 'image' | 'file'
    accept?: string
    required?: boolean
  }>(),
  {
    kind: 'image',
    accept: 'image/jpeg,image/png,image/webp,image/gif,image/svg+xml',
    required: false,
  },
)

const mediaSrc = useMediaSrc()
const uploading = ref(false)
const error = ref('')
const input = ref<HTMLInputElement | null>(null)

const preview = computed(() => mediaSrc(model.value))
const isImage = computed(() => {
  const value = model.value.toLowerCase()
  return props.kind === 'image' || /\.(jpe?g|png|webp|gif|svg)(\?|$)/.test(value)
})
const isPdf = computed(() => model.value.toLowerCase().includes('.pdf'))

async function onFile(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  uploading.value = true
  error.value = ''
  const response = await adminModule.service.uploadFile(file, props.kind)
  uploading.value = false
  if (!response.success || !response.data?.url) {
    error.value = response.message || 'آپلود نشد'
    return
  }
  model.value = response.data.url
  if (input.value) input.value.value = ''
}

function clear() {
  model.value = ''
  if (input.value) input.value.value = ''
}
</script>

<template>
  <div class="text-sm">
    <p class="mb-1.5 font-medium text-ink">{{ label }}</p>
    <div class="overflow-hidden rounded-2xl border border-mist bg-[#f7faf8]">
      <div v-if="preview && isImage" class="relative h-40 bg-mist">
        <img :src="preview" alt="" class="size-full object-cover">
        <button
          class="absolute left-3 top-3 rounded-lg bg-white/90 px-2 py-1 text-[11px] text-red-600"
          type="button"
          @click="clear"
        >
          حذف فایل
        </button>
      </div>
      <div v-else-if="preview" class="flex items-center justify-between gap-3 px-4 py-3">
        <a :href="preview" class="inline-flex items-center gap-2 text-green-deep" target="_blank" rel="noreferrer">
          <AdminIcon :src="isPdf ? '/icons/admin-file.svg' : '/icons/admin-upload.svg'" size="size-5" />
          <span class="truncate">{{ model }}</span>
        </a>
        <button class="text-[11px] text-red-600" type="button" @click="clear">حذف</button>
      </div>
      <label class="flex cursor-pointer items-center justify-center gap-2 px-4 py-4 text-sm text-ink-muted transition hover:bg-green-soft/40">
        <AdminIcon src="/icons/admin-upload.svg" size="size-5" />
        <span>{{ uploading ? 'در حال آپلود...' : 'انتخاب فایل از دستگاه' }}</span>
        <input
          ref="input"
          class="sr-only"
          type="file"
          :accept="accept"
          :required="required && !model"
          :disabled="uploading"
          @change="onFile"
        >
      </label>
    </div>
    <p v-if="error" class="mt-1 text-xs text-red-600">{{ error }}</p>
  </div>
</template>
