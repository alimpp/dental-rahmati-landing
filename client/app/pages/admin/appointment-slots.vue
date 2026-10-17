<script setup lang="ts">
import { adminModule } from '~/modules'
import { unwrapList } from '~/modules/admin/utils'
import { formatJalaliDate, toIsoDate } from '~/utils/jalali'

definePageMeta({ layout: 'admin', robots: false })

interface SlotRow {
  id: string
  date: string
  startTime: string
  endTime: string
  isActive: boolean
  isBooked: boolean
  label: string
  booking: {
    id: string
    firstName: string
    lastName: string
    phone: string
  } | null
}

const can = (action: 'view' | 'create' | 'edit' | 'delete') =>
  adminModule.controller.can('appointment_slots', action)
const { confirm: confirmDelete } = useAdminConfirm()

const items = ref<SlotRow[]>([])
const error = ref('')
const saving = ref(false)
const filterDate = ref('')

const form = reactive({
  date: toIsoDate(),
  startTime: '09:00',
  endTime: '10:00',
})

const draftRanges = ref<{ startTime: string, endTime: string }[]>([])

const presets = [
  { startTime: '09:00', endTime: '10:00' },
  { startTime: '10:00', endTime: '11:00' },
  { startTime: '11:00', endTime: '12:00' },
  { startTime: '12:00', endTime: '13:30' },
  { startTime: '14:00', endTime: '16:00' },
  { startTime: '16:30', endTime: '18:00' },
]

const grouped = computed(() => {
  const map = new Map<string, SlotRow[]>()
  for (const item of items.value) {
    const key = item.date
    if (!map.has(key)) map.set(key, [])
    map.get(key)!.push(item)
  }
  return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]))
})

onMounted(async () => {
  if (!can('view')) {
    await navigateTo('/admin')
    return
  }
  await load()
})

async function load() {
  error.value = ''
  const query = filterDate.value ? { date: filterDate.value } : undefined
  const response = await adminModule.service.getAll<SlotRow[]>('/appointments/slots', query)
  if (!response.success) {
    error.value = response.message
    return
  }
  items.value = unwrapList<SlotRow>(response.data)
}

function addDraft() {
  if (!form.startTime || !form.endTime) return
  if (form.endTime <= form.startTime) {
    error.value = 'ساعت پایان باید بعد از شروع باشد'
    return
  }
  const exists = draftRanges.value.some(
    (r) => r.startTime === form.startTime && r.endTime === form.endTime,
  )
  if (exists) return
  draftRanges.value.push({ startTime: form.startTime, endTime: form.endTime })
  draftRanges.value.sort((a, b) => a.startTime.localeCompare(b.startTime))
  error.value = ''
}

function addPreset(preset: { startTime: string, endTime: string }) {
  form.startTime = preset.startTime
  form.endTime = preset.endTime
  addDraft()
}

function removeDraft(index: number) {
  draftRanges.value.splice(index, 1)
}

async function saveBulk() {
  if (!form.date) {
    error.value = 'تاریخ را انتخاب کنید'
    return
  }
  if (!draftRanges.value.length) {
    error.value = 'حداقل یک بازه زمانی اضافه کنید'
    return
  }
  saving.value = true
  error.value = ''
  try {
    const response = await adminModule.service.createItem('/appointments/slots/bulk', {
      date: form.date,
      slots: draftRanges.value,
    })
    saving.value = false
    if (!response.success) {
      error.value = response.message
      return
    }
    draftRanges.value = []
    await load()
  }
  catch (err) {
    saving.value = false
    error.value = err instanceof Error ? err.message : 'خطا در ذخیره'
  }
}

async function toggleActive(item: SlotRow) {
  if (!can('edit') || item.isBooked) return
  const response = await adminModule.service.updateItem(`/appointments/slots/${item.id}`, {
    isActive: !item.isActive,
  })
  if (!response.success) {
    error.value = response.message
    return
  }
  await load()
}

async function remove(item: SlotRow) {
  if (item.isBooked) {
    error.value = 'نوبت رزروشده را از بخش «رزروهای نوبت» لغو کنید'
    return
  }
  if (!(await confirmDelete(`نوبت ${formatJalaliDate(item.date)} — ${item.label} حذف شود؟`))) return
  const response = await adminModule.service.deleteItem(`/appointments/slots/${item.id}`)
  if (!response.success) {
    error.value = response.message
    return
  }
  await load()
}
</script>

<template>
  <div class="space-y-5">
    <AdminHeader
      title="نوبت‌های خالی"
      action-label=""
      :show-action="false"
    />

    <p v-if="error" class="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-100">
      {{ error }}
    </p>

    <!-- Create panel -->
    <section
      v-if="can('create')"
      class="rounded-2xl border border-mist bg-white p-5 shadow-sm sm:p-6"
    >
      <div class="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p class="text-[11px] font-semibold tracking-[0.18em] text-green-deep">
            تعریف نوبت
          </p>
          <h2 class="mt-1 text-lg font-bold text-ink">
            برای یک روز، چند بازه خالی بگذارید
          </h2>
          <p class="mt-1 text-sm text-ink-muted">
            کاربران فقط نوبت‌های فعال و رزرونشده را می‌بینند.
          </p>
        </div>
        <p
          v-if="form.date"
          class="rounded-xl bg-green-soft/60 px-3 py-1.5 text-sm font-medium text-ink"
        >
          {{ formatJalaliDate(form.date) }}
        </p>
      </div>

      <div class="mt-5 grid gap-3 sm:grid-cols-4">
        <label class="text-sm sm:col-span-2">
          <span class="mb-1 block text-ink-muted">تاریخ</span>
          <input
            v-model="form.date"
            type="date"
            class="w-full rounded-xl border border-mist px-3 py-2.5 outline-none focus:border-green-deep"
          >
        </label>
        <label class="text-sm">
          <span class="mb-1 block text-ink-muted">از ساعت</span>
          <input
            v-model="form.startTime"
            type="time"
            class="w-full rounded-xl border border-mist px-3 py-2.5 outline-none focus:border-green-deep"
          >
        </label>
        <label class="text-sm">
          <span class="mb-1 block text-ink-muted">تا ساعت</span>
          <input
            v-model="form.endTime"
            type="time"
            class="w-full rounded-xl border border-mist px-3 py-2.5 outline-none focus:border-green-deep"
          >
        </label>
      </div>

      <div class="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          class="rounded-xl bg-ink px-4 py-2 text-sm font-medium text-white transition hover:bg-green-deep"
          @click="addDraft"
        >
          افزودن بازه
        </button>
        <button
          v-for="preset in presets"
          :key="`${preset.startTime}-${preset.endTime}`"
          type="button"
          class="rounded-full bg-mist/70 px-3 py-1.5 text-[12px] font-medium text-ink ring-1 ring-mist-deep transition hover:bg-green-soft"
          @click="addPreset(preset)"
        >
          {{ preset.startTime }}–{{ preset.endTime }}
        </button>
      </div>

      <div v-if="draftRanges.length" class="mt-4 flex flex-wrap gap-2">
        <span
          v-for="(range, index) in draftRanges"
          :key="`${range.startTime}-${range.endTime}`"
          class="inline-flex items-center gap-2 rounded-full bg-green-soft px-3 py-1.5 text-sm font-medium text-ink"
        >
          {{ range.startTime }} تا {{ range.endTime }}
          <button
            type="button"
            class="text-ink-muted hover:text-red-600"
            aria-label="حذف"
            @click="removeDraft(index)"
          >
            ×
          </button>
        </span>
      </div>

      <button
        type="button"
        class="mt-5 inline-flex items-center justify-center rounded-2xl bg-green-deep px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
        :disabled="saving || !draftRanges.length"
        @click="saveBulk"
      >
        {{ saving ? 'در حال ذخیره…' : `ثبت ${draftRanges.length || ''} نوبت برای این روز` }}
      </button>
    </section>

    <!-- Filter + list -->
    <section class="rounded-2xl border border-mist bg-white p-4 sm:p-5">
      <div class="mb-4 flex flex-wrap items-center gap-3">
        <label class="text-sm">
          <span class="ml-2 text-ink-muted">فیلتر تاریخ</span>
          <input
            v-model="filterDate"
            type="date"
            class="rounded-xl border border-mist px-3 py-2 outline-none focus:border-green-deep"
            @change="load"
          >
        </label>
        <button
          v-if="filterDate"
          type="button"
          class="text-sm text-ink-muted underline"
          @click="filterDate = ''; load()"
        >
          پاک کردن فیلتر
        </button>
      </div>

      <div v-if="!grouped.length" class="rounded-xl bg-mist/40 px-4 py-10 text-center text-sm text-ink-muted">
        هنوز نوبت خالی‌ای ثبت نشده است.
      </div>

      <div v-else class="space-y-5">
        <article
          v-for="[date, slots] in grouped"
          :key="date"
          class="rounded-2xl bg-[#f8fafc] p-4 ring-1 ring-mist"
        >
          <div class="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h3 class="font-bold text-ink">
              {{ formatJalaliDate(date) }}
            </h3>
            <span class="text-[12px] text-ink-muted">
              {{ slots.length }} نوبت
            </span>
          </div>
          <ul class="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            <li
              v-for="slot in slots"
              :key="slot.id"
              class="flex items-center justify-between gap-2 rounded-xl bg-white px-3 py-2.5 ring-1 ring-mist"
            >
              <div class="min-w-0">
                <p class="font-semibold text-ink">
                  {{ slot.label }}
                </p>
                <p class="mt-0.5 text-[11px]" :class="slot.isBooked ? 'text-amber-700' : slot.isActive ? 'text-green-deep' : 'text-ink-muted'">
                  {{ slot.isBooked ? `رزرو: ${slot.booking?.firstName} ${slot.booking?.lastName}` : slot.isActive ? 'آزاد' : 'غیرفعال' }}
                </p>
              </div>
              <div class="flex shrink-0 gap-1">
                <button
                  v-if="can('edit') && !slot.isBooked"
                  type="button"
                  class="rounded-lg px-2 py-1 text-[11px] font-medium ring-1 ring-mist hover:bg-mist"
                  @click="toggleActive(slot)"
                >
                  {{ slot.isActive ? 'غیرفعال' : 'فعال' }}
                </button>
                <button
                  v-if="can('delete') && !slot.isBooked"
                  type="button"
                  class="rounded-lg px-2 py-1 text-[11px] font-medium text-red-600 ring-1 ring-red-100 hover:bg-red-50"
                  @click="remove(slot)"
                >
                  حذف
                </button>
              </div>
            </li>
          </ul>
        </article>
      </div>
    </section>
  </div>
</template>
