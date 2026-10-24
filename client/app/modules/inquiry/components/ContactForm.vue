<script setup lang="ts">
import { inquiryModule } from '~/modules'
import type { TCreateInquiryPayload } from '~/modules/inquiry/types/index.type'

const props = withDefaults(
  defineProps<{
    source?: TCreateInquiryPayload['source']
    compact?: boolean
    defaultSubject?: string
  }>(),
  {
    source: 'home',
    compact: false,
    defaultSubject: 'درخواست رزرو نوبت',
  },
)

const inquiryDS = inquiryModule.store
const submitting = computed(() => inquiryDS.getSubmitting)
const success = computed(() => inquiryDS.getSuccess)
const error = computed(() => inquiryDS.getError)
const fieldErrors = computed(() => inquiryDS.getFieldErrors)

const form = reactive({
  name: '',
  phone: '',
  email: '',
  subject: props.defaultSubject,
  message: '',
})

watch(
  () => props.defaultSubject,
  (next) => {
    if (next && form.subject !== next) form.subject = next
  },
)

function fieldClass(name: keyof typeof form) {
  const invalid = Boolean(fieldErrors.value[name])
  return [
    'w-full border-0 text-sm text-ink outline-none transition placeholder:text-ink-muted/70',
    props.compact
      ? 'rounded-xl bg-mist/70 px-3.5 py-2.5 ring-1 focus:bg-panel'
      : 'rounded-2xl bg-mist px-4 py-3 ring-1 focus:bg-panel',
    invalid ? 'ring-red-400 focus:ring-red-400' : 'ring-mist-deep focus:ring-gold/45',
  ]
}

function onFieldInput(name: string) {
  inquiryDS.clearFieldError(name)
}

async function onSubmit() {
  const payload: TCreateInquiryPayload = {
    name: form.name,
    phone: form.phone,
    email: form.email || null,
    subject: form.subject,
    message: form.message,
    source: props.source,
  }
  const res = await inquiryModule.controller.submitInquiry(payload)
  if (res.success) {
    form.name = ''
    form.phone = ''
    form.email = ''
    form.subject = props.defaultSubject
    form.message = ''
  }
}
</script>

<template>
  <form class="space-y-4" :class="compact ? 'space-y-3' : ''" novalidate @submit.prevent="onSubmit">
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2" :class="compact ? 'gap-3' : ''">
      <label class="block">
        <span class="mb-1.5 block text-[11px] font-medium text-ink-muted">
          نام و نام خانوادگی <span class="text-gold">*</span>
        </span>
        <input
          v-model="form.name"
          maxlength="120"
          :class="fieldClass('name')"
          placeholder="مثلاً سارا محمدی"
          autocomplete="name"
          @input="onFieldInput('name')"
        >
        <p v-if="fieldErrors.name" class="mt-1 text-[11px] text-red-600">{{ fieldErrors.name }}</p>
      </label>
      <label class="block">
        <span class="mb-1.5 block text-[11px] font-medium text-ink-muted">
          شماره تماس <span class="text-gold">*</span>
        </span>
        <input
          v-model="form.phone"
          maxlength="16"
          dir="ltr"
          class="text-right"
          :class="fieldClass('phone')"
          placeholder="0912xxxxxxx"
          autocomplete="tel"
          inputmode="tel"
          @input="onFieldInput('phone')"
        >
        <p v-if="fieldErrors.phone" class="mt-1 text-[11px] text-red-600">{{ fieldErrors.phone }}</p>
      </label>
    </div>

    <div class="grid grid-cols-1 gap-4" :class="compact ? 'gap-3' : 'sm:grid-cols-2'">
      <label class="block">
        <span class="mb-1.5 block text-[11px] font-medium text-ink-muted">ایمیل (اختیاری)</span>
        <input
          v-model="form.email"
          type="email"
          maxlength="180"
          dir="ltr"
          class="text-right"
          :class="fieldClass('email')"
          placeholder="email@example.com"
          autocomplete="email"
          @input="onFieldInput('email')"
        >
        <p v-if="fieldErrors.email" class="mt-1 text-[11px] text-red-600">{{ fieldErrors.email }}</p>
      </label>
      <label v-if="!compact" class="block">
        <span class="mb-1.5 block text-[11px] font-medium text-ink-muted">
          موضوع <span class="text-gold">*</span>
        </span>
        <input
          v-model="form.subject"
          maxlength="180"
          :class="fieldClass('subject')"
          @input="onFieldInput('subject')"
        >
        <p v-if="fieldErrors.subject" class="mt-1 text-[11px] text-red-600">{{ fieldErrors.subject }}</p>
      </label>
    </div>

    <label class="block">
      <span class="mb-1.5 block text-[11px] font-medium text-ink-muted">
        شرح کوتاه درخواست <span class="text-gold">*</span>
      </span>
      <textarea
        v-model="form.message"
        maxlength="2000"
        :rows="compact ? 4 : 6"
        class="resize-none"
        :class="fieldClass('message')"
        placeholder="موضوع، وضعیت فعلی و نتیجه مورد انتظار را در چند خط بنویسید."
        @input="onFieldInput('message')"
      />
      <p v-if="fieldErrors.message" class="mt-1 text-[11px] text-red-600">{{ fieldErrors.message }}</p>
      <p v-else-if="!compact" class="mt-1.5 text-[11px] text-ink-muted">
        حداقل ۲۰ نویسه — {{ form.message.trim().length }}/2000
      </p>
    </label>

    <p v-if="error && !Object.keys(fieldErrors).length" class="text-xs text-red-600">
      {{ error }}
    </p>
    <p
      v-if="success"
      class="rounded-2xl bg-green-deep/15 px-4 py-3 text-sm text-on-primary ring-1 ring-green-deep/25"
    >
      درخواست شما ثبت شد. به‌زودی برای هماهنگی وقت با شما تماس می‌گیریم.
    </p>

    <button
      type="submit"
      :disabled="submitting"
      class="inline-flex w-full items-center justify-center text-sm font-semibold transition disabled:cursor-wait disabled:opacity-70"
      :class="
        compact
          ? 'rounded-xl bg-green-deep px-5 py-3 font-bold tracking-wide text-on-primary shadow-[0_8px_22px_rgba(15,118,110,0.3)] hover:brightness-110'
          : 'rounded-2xl bg-green-deep px-5 py-3.5 font-bold tracking-wide text-on-primary shadow-[0_8px_22px_rgba(15,118,110,0.3)] hover:brightness-110'
      "
    >
      {{ submitting ? 'در حال ارسال...' : 'ارسال درخواست نوبت' }}
    </button>
  </form>
</template>
