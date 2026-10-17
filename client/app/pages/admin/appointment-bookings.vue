<script setup lang="ts">
import { adminModule } from '~/modules'
import { unwrapList } from '~/modules/admin/utils'
import { formatJalaliDate } from '~/utils/jalali'

definePageMeta({ layout: 'admin', robots: false })

interface BookingRow {
  id: string
  firstName: string
  lastName: string
  phone: string
  notes: string | null
  createdAt: string
  slot: {
    id: string
    date: string
    startTime: string
    endTime: string
    label: string
  } | null
}

const can = (action: 'view' | 'delete') =>
  adminModule.controller.can('appointment_bookings', action)
const { confirm: confirmDelete } = useAdminConfirm()

const items = ref<BookingRow[]>([])
const error = ref('')
const query = ref('')

const filtered = computed(() => {
  const q = query.value.trim()
  if (!q) return items.value
  return items.value.filter((item) => {
    const hay = [
      item.firstName,
      item.lastName,
      item.phone,
      item.notes,
      item.slot?.date,
      item.slot?.label,
    ]
      .filter(Boolean)
      .join(' ')
    return hay.includes(q)
  })
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
  const response = await adminModule.service.getAll<BookingRow[]>('/appointments/bookings')
  if (!response.success) {
    error.value = response.message
    return
  }
  items.value = unwrapList<BookingRow>(response.data)
}

async function cancelBooking(item: BookingRow) {
  if (!(await confirmDelete(
    `رزرو «${item.firstName} ${item.lastName}» لغو شود؟ نوبت دوباره آزاد می‌شود.`,
  ))) return
  const response = await adminModule.service.deleteItem(`/appointments/bookings/${item.id}`)
  if (!response.success) {
    error.value = response.message
    return
  }
  await load()
}

function formatWhen(item: BookingRow) {
  if (!item.slot) return '—'
  return `${formatJalaliDate(item.slot.date)} · ${item.slot.label}`
}
</script>

<template>
  <div class="space-y-5">
    <AdminHeader title="رزروهای نوبت" :show-action="false" />

    <p v-if="error" class="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-100">
      {{ error }}
    </p>

    <div class="flex flex-wrap items-center justify-between gap-3">
      <p class="text-sm text-ink-muted">
        {{ filtered.length }} رزرو
      </p>
      <input
        v-model="query"
        type="search"
        placeholder="جستجو نام، تلفن یا تاریخ…"
        class="w-full max-w-xs rounded-xl border border-mist bg-white px-3 py-2 text-sm outline-none focus:border-green-deep"
      >
    </div>

    <div v-if="!filtered.length" class="rounded-2xl border border-mist bg-white px-4 py-12 text-center text-sm text-ink-muted">
      هنوز رزروی ثبت نشده است.
    </div>

    <div v-else class="overflow-x-auto rounded-2xl border border-mist bg-white">
      <table class="w-full min-w-[720px] text-right text-sm">
        <thead class="bg-mist/60 text-ink-muted">
          <tr>
            <th class="p-3 font-medium">بیمار</th>
            <th class="p-3 font-medium">تلفن</th>
            <th class="p-3 font-medium">نوبت</th>
            <th class="p-3 font-medium">توضیحات</th>
            <th class="p-3 font-medium">ثبت</th>
            <th class="p-3 font-medium">عملیات</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in filtered"
            :key="item.id"
            class="border-t border-mist/80"
          >
            <td class="p-3 font-semibold text-ink">
              {{ item.firstName }} {{ item.lastName }}
            </td>
            <td class="p-3" dir="ltr">
              <a :href="`tel:${item.phone}`" class="text-green-deep hover:underline">
                {{ item.phone }}
              </a>
            </td>
            <td class="p-3 text-ink">
              {{ formatWhen(item) }}
            </td>
            <td class="max-w-[220px] truncate p-3 text-ink-muted">
              {{ item.notes || '—' }}
            </td>
            <td class="p-3 text-[12px] text-ink-muted">
              {{ formatJalaliDate(item.createdAt, { dateStyle: 'medium', timeStyle: 'short' }) }}
            </td>
            <td class="p-3">
              <button
                v-if="can('delete')"
                type="button"
                class="rounded-lg px-2.5 py-1 text-[12px] font-medium text-red-600 ring-1 ring-red-100 hover:bg-red-50"
                @click="cancelBooking(item)"
              >
                لغو رزرو
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
