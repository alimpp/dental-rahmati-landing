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
  <div class="min-w-0 space-y-5">
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

    <AdminListPanel :count="filtered.length" empty-text="هنوز رزروی ثبت نشده است.">
      <template #table>
        <table class="w-full text-right text-sm">
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
      </template>
      <template #cards>
        <AdminMobileCard
          v-for="item in filtered"
          :key="item.id"
          :title="`${item.firstName} ${item.lastName}`"
          :subtitle="formatWhen(item)"
          :can-delete="can('delete')"
          :meta="`${item.phone} · ${formatJalaliDate(item.createdAt, { dateStyle: 'medium', timeStyle: 'short' })}`"
          @delete="cancelBooking(item)"
        >
          <p v-if="item.notes" class="mt-2 line-clamp-2 text-xs leading-5 text-ink-muted">
            {{ item.notes }}
          </p>
        </AdminMobileCard>
      </template>
    </AdminListPanel>
  </div>
</template>
