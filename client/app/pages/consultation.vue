<script setup lang="ts">
import { z } from 'zod'
import { siteContact } from '~/data/site-contact'
import { SEO_PAGES } from '~/data/seo'
import { formatJalaliDate, formatJalaliShort, toIsoDate } from '~/utils/jalali'

interface AvailableDate {
  date: string
  count: number
}

interface AvailableSlot {
  id: string
  date: string
  startTime: string
  endTime: string
  label: string
}

const api = useCustomFetch()

const loading = ref(true)
const booking = ref(false)
const error = ref('')
const success = ref(false)
const fieldErrors = ref<Record<string, string>>({})

const dates = ref<AvailableDate[]>([])
const slots = ref<AvailableSlot[]>([])
const selectedDate = ref('')
const selectedSlot = ref<AvailableSlot | null>(null)

const form = reactive({
  firstName: '',
  lastName: '',
  phone: '',
  notes: '',
})

const PERSIAN_DIGITS = '۰۱۲۳۴۵۶۷۸۹'
const ARABIC_DIGITS = '٠١٢٣٤٥٦٧٨٩'

function toEnglishDigits(value: string) {
  return value
    .replace(/[۰-۹]/g, (d) => String(PERSIAN_DIGITS.indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String(ARABIC_DIGITS.indexOf(d)))
}

const bookSchema = z.object({
  firstName: z.string().trim().min(2, 'نام را وارد کنید').max(80),
  lastName: z.string().trim().min(2, 'نام خانوادگی را وارد کنید').max(80),
  phone: z
    .string()
    .trim()
    .transform((v) => toEnglishDigits(v).replace(/[\s-]/g, ''))
    .refine((v) => /^(09\d{9}|\+989\d{9})$/.test(v), 'شماره موبایل را با ۰۹ وارد کنید'),
  notes: z.string().trim().max(1000).optional().nullable(),
})

usePageSeo({
  title: SEO_PAGES.consultation.title,
  description: SEO_PAGES.consultation.description,
  keywords: SEO_PAGES.consultation.keywords,
  path: '/consultation',
})

useSchemaOrg([
  defineBreadcrumb({
    itemListElement: [
      { name: 'خانه', item: '/' },
      { name: 'رزرو نوبت ایمپلنت و لمینت', item: '/consultation' },
    ],
  }),
])

onMounted(loadDates)

async function loadDates() {
  loading.value = true
  error.value = ''
  try {
    const res = await api<{ success: boolean, data: AvailableDate[], message?: string }>(
      '/appointments/available-dates',
      { query: { from: toIsoDate() } },
    )
    dates.value = res.data || []
    if (dates.value.length && !selectedDate.value) {
      await selectDate(dates.value[0]!.date)
    }
  }
  catch (err) {
    error.value = err instanceof Error ? err.message : 'خطا در دریافت نوبت‌ها'
  }
  finally {
    loading.value = false
  }
}

async function selectDate(date: string) {
  selectedDate.value = date
  selectedSlot.value = null
  success.value = false
  error.value = ''
  try {
    const res = await api<{ success: boolean, data: AvailableSlot[] }>(
      '/appointments/available',
      { query: { from: date, to: date } },
    )
    slots.value = (res.data || []).filter((s) => s.date === date)
  }
  catch (err) {
    slots.value = []
    error.value = err instanceof Error ? err.message : 'خطا در دریافت ساعت‌ها'
  }
}

function pickSlot(slot: AvailableSlot) {
  selectedSlot.value = slot
  success.value = false
  fieldErrors.value = {}
  error.value = ''
}

function clearField(name: string) {
  if (fieldErrors.value[name]) {
    const next = { ...fieldErrors.value }
    delete next[name]
    fieldErrors.value = next
  }
}

async function submit() {
  if (!selectedSlot.value) {
    error.value = 'ابتدا یک نوبت انتخاب کنید'
    return
  }
  const parsed = bookSchema.safeParse(form)
  if (!parsed.success) {
    const errs: Record<string, string> = {}
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? 'form')
      if (!errs[key]) errs[key] = issue.message
    }
    fieldErrors.value = errs
    error.value = Object.values(errs)[0] || 'اطلاعات را کامل کنید'
    return
  }

  booking.value = true
  error.value = ''
  fieldErrors.value = {}
  try {
    const res = await api<{ success: boolean, message: string, data: unknown, errors?: Record<string, string> }>(
      '/appointments/book',
      {
        method: 'POST',
        body: {
          slotId: selectedSlot.value.id,
          firstName: parsed.data.firstName,
          lastName: parsed.data.lastName,
          phone: parsed.data.phone,
          notes: parsed.data.notes || null,
        },
      },
    )
    if (!res.success) {
      error.value = res.message || 'رزرو ناموفق بود'
      if (res.errors) fieldErrors.value = res.errors
      return
    }
    success.value = true
    form.firstName = ''
    form.lastName = ''
    form.phone = ''
    form.notes = ''
    selectedSlot.value = null
    await loadDates()
  }
  catch (err: unknown) {
    const reqErr = err as { data?: { message?: string | string[], errors?: Record<string, string> }, response?: { _data?: { message?: string, errors?: Record<string, string> } } }
    const body = reqErr.data || reqErr.response?._data
    if (body?.errors) fieldErrors.value = body.errors
    const msg = body?.message
    error.value = Array.isArray(msg) ? msg.join('، ') : (msg || (err instanceof Error ? err.message : 'رزرو ناموفق بود'))
    // Refresh slots — maybe taken
    if (selectedDate.value) await selectDate(selectedDate.value)
  }
  finally {
    booking.value = false
  }
}

function fieldClass(name: string) {
  return [
    'box-border max-w-full w-full rounded-2xl bg-mist px-3.5 py-3 text-sm text-ink outline-none ring-1 transition focus:bg-panel sm:px-4',
    fieldErrors.value[name] ? 'ring-red-400' : 'ring-mist-deep focus:ring-green-deep/40',
  ]
}
</script>

<template>
  <div class="min-w-0 w-full overflow-x-clip bg-mist">
    <SiteReveal variant="fade">
      <header class="relative overflow-x-clip border-b border-mist-deep bg-panel">
        <div
          class="pointer-events-none absolute inset-y-0 start-0 w-40 max-w-[40%] bg-green-deep/8 blur-3xl"
          aria-hidden="true"
        />
        <div
          class="pointer-events-none absolute inset-y-0 end-0 w-36 max-w-[35%] bg-gold/15 blur-3xl"
          aria-hidden="true"
        />
        <div class="relative mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
          <p class="text-[11px] font-semibold tracking-[0.22em] text-green-deep">
            نوبت‌دهی آنلاین
          </p>
          <h1 class="mt-3 max-w-2xl text-[1.65rem] font-bold leading-snug tracking-tight text-ink sm:text-4xl sm:leading-[1.2] lg:text-5xl">
            رزرو نوبت ایمپلنت، لمینت و دندان پزشکی دیجیتال در کرج
          </h1>
          <p class="mt-4 max-w-xl text-[14px] leading-7 text-ink-muted sm:text-[15px] sm:leading-8">
            نوبت آنلاین کلینیک دکتر امیر رحمتی برای دندان پزشکی دیجیتال، ایمپلنت دیجیتال، لمینت و کامپوزیت در کرج.
            با انتخاب بازه و ثبت مشخصات، نوبت شما قطعی می‌شود.
          </p>
          <div class="mt-5 flex flex-wrap gap-2 text-[13px] sm:mt-6 sm:gap-3 sm:text-sm">
            <span class="rounded-2xl bg-mist px-3.5 py-2 font-medium text-ink ring-1 ring-mist-deep sm:px-4">
              نام، نام‌خانوادگی و موبایل کافی است
            </span>
            <a
              :href="siteContact.phoneHref"
              class="rounded-2xl bg-band px-3.5 py-2 font-medium text-on-band transition hover:bg-green-deep sm:px-4"
            >
              تماس {{ siteContact.phone }}
            </a>
          </div>
        </div>
      </header>
    </SiteReveal>

    <div class="mx-auto grid w-full max-w-7xl grid-cols-1 gap-5 px-4 py-6 sm:gap-6 sm:px-6 sm:py-10 lg:grid-cols-12 lg:gap-10 lg:px-8 lg:py-14">
      <!-- Side first on mobile as compact how-to -->
      <aside class="order-1 min-w-0 lg:order-2 lg:col-span-5">
        <div class="space-y-4 lg:sticky lg:top-24">
          <div class="overflow-hidden rounded-2xl bg-band p-4 text-on-band sm:rounded-[1.6rem] sm:p-6 lg:p-7">
            <p class="text-[11px] font-semibold tracking-[0.18em] text-gold">چطور کار می‌کند؟</p>
            <ol class="mt-4 grid gap-3 text-[13px] leading-7 text-on-band/80 sm:mt-5 sm:gap-4 sm:text-sm">
              <li class="flex gap-3">
                <span class="mt-0.5 shrink-0 font-mono text-gold">01</span>
                <span>روز دارای نوبت خالی را انتخاب کنید.</span>
              </li>
              <li class="flex gap-3">
                <span class="mt-0.5 shrink-0 font-mono text-gold">02</span>
                <span>یکی از بازه‌های ساعتی آزاد را بزنید.</span>
              </li>
              <li class="flex gap-3">
                <span class="mt-0.5 shrink-0 font-mono text-gold">03</span>
                <span>نام، نام‌خانوادگی و موبایل را وارد و تأیید کنید.</span>
              </li>
            </ol>
            <p class="mt-4 border-t border-white/10 pt-4 text-[12px] text-on-band/55 sm:mt-6 sm:pt-5">
              {{ siteContact.hours }}
            </p>
          </div>

          <div class="hidden rounded-[1.5rem] bg-panel p-5 ring-1 ring-mist-deep sm:block sm:p-6">
            <p class="text-[11px] font-semibold tracking-[0.18em] text-green-deep">نکته</p>
            <p class="mt-3 text-sm leading-7 text-ink-muted">
              هر نوبت فقط یک‌بار قابل رزرو است. اگر کسی زودتر همان ساعت را بگیرد،
              لیست به‌روزرسانی می‌شود و باید بازه دیگری انتخاب کنید.
            </p>
          </div>
        </div>
      </aside>

      <!-- Steps column -->
      <div class="order-2 min-w-0 space-y-4 sm:space-y-6 lg:order-1 lg:col-span-7">
        <p v-if="error" class="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-100">
          {{ error }}
        </p>
        <p
          v-if="success"
          class="rounded-2xl bg-teal-50 px-4 py-3 text-sm font-medium text-teal-900 ring-1 ring-teal-100"
        >
          نوبت شما ثبت شد. منتظر دیدار شما در کلینیک هستیم.
        </p>

        <!-- Step 1: dates -->
        <section class="min-w-0 overflow-hidden rounded-2xl bg-panel ring-1 ring-mist-deep sm:rounded-[1.6rem]">
          <div class="px-4 pt-5 sm:px-7 sm:pt-7">
            <div class="flex items-start gap-3">
              <span class="flex size-8 shrink-0 items-center justify-center rounded-xl bg-green-deep text-sm font-bold text-on-band">1</span>
              <div class="min-w-0">
                <h2 class="text-base font-bold text-ink sm:text-lg">انتخاب روز</h2>
                <p class="text-[13px] text-ink-muted sm:text-sm">روزهایی که نوبت خالی دارند</p>
              </div>
            </div>
          </div>

          <div v-if="loading" class="px-4 py-6 text-sm text-ink-muted sm:px-7">
            در حال بارگذاری…
          </div>
          <div
            v-else-if="!dates.length"
            class="mx-4 my-5 rounded-2xl bg-mist px-4 py-8 text-center text-sm text-ink-muted sm:mx-7"
          >
            فعلاً نوبت خالی‌ای تعریف نشده است. لطفاً بعداً سر بزنید یا تماس بگیرید.
          </div>
          <div
            v-else
            class="mt-4 overflow-x-auto overscroll-x-contain pb-5 [scrollbar-width:thin] touch-pan-x"
          >
            <div class="flex w-max gap-2 px-4 sm:px-7">
              <button
                v-for="day in dates"
                :key="day.date"
                type="button"
                class="w-[7.25rem] shrink-0 snap-start rounded-2xl px-3 py-3 text-start transition ring-1 sm:w-[7.75rem]"
                :class="
                  selectedDate === day.date
                    ? 'bg-band text-on-band ring-band'
                    : 'bg-mist text-ink ring-mist-deep hover:bg-green-soft/50'
                "
                @click="selectDate(day.date)"
              >
                <span class="block text-[11px] opacity-80 sm:text-[12px]">{{ formatJalaliShort(day.date) }}</span>
                <span class="mt-1 block truncate text-[13px] font-bold sm:text-sm">{{ formatJalaliDate(day.date, { weekday: 'long' }) }}</span>
                <span class="mt-1 block text-[11px] opacity-75">{{ day.count }} نوبت</span>
              </button>
            </div>
          </div>
        </section>

        <!-- Step 2: times -->
        <section class="min-w-0 overflow-hidden rounded-2xl bg-panel p-4 ring-1 ring-mist-deep sm:rounded-[1.6rem] sm:p-7">
          <div class="flex items-start gap-3">
            <span class="flex size-8 shrink-0 items-center justify-center rounded-xl bg-green-deep text-sm font-bold text-on-band">2</span>
            <div class="min-w-0">
              <h2 class="text-base font-bold text-ink sm:text-lg">انتخاب ساعت</h2>
              <p class="text-[13px] text-ink-muted sm:text-sm">
                {{ selectedDate ? formatJalaliDate(selectedDate) : 'ابتدا روز را انتخاب کنید' }}
              </p>
            </div>
          </div>

          <div
            v-if="selectedDate && !slots.length"
            class="mt-5 rounded-2xl bg-mist px-4 py-8 text-center text-sm text-ink-muted"
          >
            برای این روز نوبت آزادی باقی نمانده است.
          </div>
          <div
            v-else-if="slots.length"
            class="mt-4 grid grid-cols-2 gap-2 min-[400px]:grid-cols-3 sm:mt-5"
          >
            <button
              v-for="slot in slots"
              :key="slot.id"
              type="button"
              class="min-w-0 rounded-2xl px-2 py-3 text-[13px] font-semibold transition ring-1 sm:px-3 sm:text-sm"
              :class="
                selectedSlot?.id === slot.id
                  ? 'bg-green-deep text-on-band ring-green-deep'
                  : 'bg-mist text-ink ring-mist-deep hover:ring-green-deep/40'
              "
              @click="pickSlot(slot)"
            >
              <span class="block truncate">{{ slot.label }}</span>
            </button>
          </div>
        </section>

        <!-- Step 3: form -->
        <section class="min-w-0 overflow-hidden rounded-2xl bg-panel p-4 ring-1 ring-mist-deep sm:rounded-[1.6rem] sm:p-7">
          <div class="flex items-start gap-3">
            <span class="flex size-8 shrink-0 items-center justify-center rounded-xl bg-green-deep text-sm font-bold text-on-band">3</span>
            <div class="min-w-0">
              <h2 class="text-base font-bold text-ink sm:text-lg">مشخصات شما</h2>
              <p class="text-[13px] text-ink-muted sm:text-sm">
                <template v-if="selectedSlot">
                  رزرو برای {{ formatJalaliShort(selectedSlot.date) }} · {{ selectedSlot.label }}
                </template>
                <template v-else>
                  پس از انتخاب ساعت، فرم فعال می‌شود
                </template>
              </p>
            </div>
          </div>

          <form class="mt-5 space-y-4 sm:mt-6" novalidate @submit.prevent="submit">
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label class="block min-w-0">
                <span class="mb-1.5 block text-[11px] font-medium text-ink-muted">
                  نام <span class="text-green-deep">*</span>
                </span>
                <input
                  v-model="form.firstName"
                  type="text"
                  autocomplete="given-name"
                  :disabled="!selectedSlot || booking"
                  :class="fieldClass('firstName')"
                  @input="clearField('firstName')"
                >
                <span v-if="fieldErrors.firstName" class="mt-1 block text-[11px] text-red-600">{{ fieldErrors.firstName }}</span>
              </label>
              <label class="block min-w-0">
                <span class="mb-1.5 block text-[11px] font-medium text-ink-muted">
                  نام خانوادگی <span class="text-green-deep">*</span>
                </span>
                <input
                  v-model="form.lastName"
                  type="text"
                  autocomplete="family-name"
                  :disabled="!selectedSlot || booking"
                  :class="fieldClass('lastName')"
                  @input="clearField('lastName')"
                >
                <span v-if="fieldErrors.lastName" class="mt-1 block text-[11px] text-red-600">{{ fieldErrors.lastName }}</span>
              </label>
            </div>

            <label class="block min-w-0">
              <span class="mb-1.5 block text-[11px] font-medium text-ink-muted">
                شماره موبایل <span class="text-green-deep">*</span>
              </span>
              <input
                v-model="form.phone"
                type="tel"
                inputmode="tel"
                dir="ltr"
                placeholder="0912…"
                autocomplete="tel"
                :disabled="!selectedSlot || booking"
                :class="[...fieldClass('phone'), 'text-start']"
                @input="clearField('phone')"
              >
              <span v-if="fieldErrors.phone" class="mt-1 block text-[11px] text-red-600">{{ fieldErrors.phone }}</span>
            </label>

            <label class="block min-w-0">
              <span class="mb-1.5 block text-[11px] font-medium text-ink-muted">
                توضیحات <span class="text-ink-muted/70">(اختیاری)</span>
              </span>
              <textarea
                v-model="form.notes"
                rows="3"
                placeholder="مثلاً درد دندان، جرم‌گیری، بلیچینگ…"
                :disabled="!selectedSlot || booking"
                :class="fieldClass('notes')"
                @input="clearField('notes')"
              />
            </label>

            <button
              type="submit"
              class="inline-flex w-full items-center justify-center rounded-2xl bg-green-deep px-5 py-3.5 text-sm font-bold text-on-band transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-45 sm:w-auto sm:min-w-[14rem]"
              :disabled="!selectedSlot || booking"
            >
              {{ booking ? 'در حال ثبت…' : 'تأیید و رزرو نوبت' }}
            </button>
          </form>
        </section>

        <div class="rounded-2xl bg-panel p-4 ring-1 ring-mist-deep sm:hidden">
          <p class="text-[11px] font-semibold tracking-[0.18em] text-green-deep">نکته</p>
          <p class="mt-2 text-[13px] leading-7 text-ink-muted">
            هر نوبت فقط یک‌بار قابل رزرو است. اگر کسی زودتر همان ساعت را بگیرد،
            لیست به‌روزرسانی می‌شود.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
