<script setup lang="ts">
import { adminModule } from '~/modules'
import type {
  TVisitDayDetail,
  TVisitReport,
  VisitReportRange,
} from '~/modules/admin/types/index.type'

definePageMeta({ layout: 'admin', robots: false })

const error = ref('')
const loading = ref(false)
const range = ref('daily')
const data = ref<TVisitReport | null>(null)
const query = ref('')

const detailOpen = ref(false)
const detailLoading = ref(false)
const detailError = ref('')
const detail = ref<TVisitDayDetail | null>(null)
const detailTitle = ref('')

const rangeOptions = [
  { value: 'daily', label: 'روزانه — ۳۰ روز' },
  { value: 'weekly', label: 'هفتگی — ۱۲ هفته' },
  { value: 'monthly', label: 'ماهانه — ۱۲ ماه' },
]

onMounted(async () => {
  if (!adminModule.controller.can('reports', 'view')) {
    await navigateTo('/admin')
    return
  }
  await load()
})

watch(range, () => load())

async function load() {
  loading.value = true
  error.value = ''
  const response = await adminModule.controller.getReports(range.value as VisitReportRange)
  loading.value = false
  if (!response.success || !response.data) {
    error.value = response.message || 'گزارش در دسترس نیست'
    return
  }
  data.value = response.data
}

async function openDayDetail(bucket: string) {
  detailOpen.value = true
  detailLoading.value = true
  detailError.value = ''
  detail.value = null
  detailTitle.value = formatBucket(bucket)
  const response = await adminModule.controller.getDayDetail(
    bucket,
    range.value as VisitReportRange,
  )
  detailLoading.value = false
  if (!response.success || !response.data) {
    detailError.value = response.message || 'جزئیات بازدید در دسترس نیست'
    return
  }
  detail.value = response.data
}

function closeDetail() {
  detailOpen.value = false
  detail.value = null
  detailError.value = ''
}

function fa(value?: number) {
  return (value ?? 0).toLocaleString('fa-IR')
}

function formatBucket(value: string) {
  if (range.value === 'monthly') {
    const [year, month] = value.split('-')
    return new Date(Number(year), Number(month) - 1, 1).toLocaleDateString('fa-IR', {
      year: 'numeric',
      month: 'long',
    })
  }
  return new Date(`${value}T12:00:00`).toLocaleDateString('fa-IR')
}

function formatDayLabel(iso: string) {
  return new Date(`${iso}T12:00:00`).toLocaleDateString('fa-IR', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

const change = computed(() => data.value?.totals.changePercent ?? 0)
const kpis = computed(() => {
  const totals = data.value?.totals
  if (!totals) return []
  return [
    { label: 'بازدید یکتا', value: fa(totals.visits), hint: 'این دوره' },
    { label: 'بازدید مقالات', value: fa(totals.articleVisits), hint: 'زیرمجموعه' },
    { label: 'تعداد صفحات', value: fa(totals.uniquePaths), hint: 'مسیر یکتا' },
    {
      label: 'رشد نسبت به قبل',
      value: `${change.value > 0 ? '+' : ''}${fa(change.value)}٪`,
      hint: 'دوره قبلی',
    },
  ]
})

const filteredPages = computed(() => {
  const pages = data.value?.pages ?? []
  const q = query.value.trim()
  if (!q) return pages
  return pages.filter(
    (p) => p.label.includes(q) || p.path.includes(q),
  )
})

const maxPageVisits = computed(() =>
  Math.max(1, ...filteredPages.value.map((p) => p.visits)),
)

const showDayColumn = computed(() => range.value !== 'daily')
</script>

<template>
  <div class="space-y-4">
    <div class="flex flex-col gap-3 rounded-2xl border border-mist bg-white p-3 sm:flex-row sm:items-center sm:justify-between sm:p-4">
      <div>
        <p class="text-sm font-medium text-ink">گزارش بازدید صفحات</p>
        <p class="mt-0.5 text-[12px] text-ink-muted">
          {{ data?.note || 'هر دستگاه در هر صفحه، حداکثر یک‌بار در روز شمارش می‌شود.' }}
          برای دیدن ساعت دقیق، روی هر روز در جدول زمانی کلیک کنید.
        </p>
      </div>
      <AdminSelect
        v-model="range"
        class="sm:w-56"
        :options="rangeOptions"
        :allow-empty="false"
        placeholder="بازه گزارش"
      />
    </div>

    <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
    <p v-else-if="loading" class="text-sm text-ink-muted">در حال بارگذاری گزارش...</p>

    <div class="grid gap-3 grid-cols-2 xl:grid-cols-4">
      <article v-for="item in kpis" :key="item.label" class="rounded-2xl border border-mist bg-white p-3 sm:p-4">
        <p class="text-[11px] text-ink-muted">{{ item.hint }}</p>
        <p class="mt-1 text-xl font-semibold tabular-nums text-ink sm:text-2xl">{{ item.value }}</p>
        <p class="mt-1 text-[12px] text-ink-muted">{{ item.label }}</p>
      </article>
    </div>

    <div class="grid gap-4 xl:grid-cols-5">
      <section class="rounded-2xl border border-mist bg-white p-4 sm:p-5 xl:col-span-3">
        <h2 class="font-semibold text-ink">روند بازدید یکتا</h2>
        <p class="mb-3 text-[11px] text-ink-muted">{{ rangeOptions.find((item) => item.value === range)?.label }}</p>
        <AdminLineChart v-if="data?.series?.length" :series="data.series" />
        <p v-else class="py-10 text-center text-sm text-ink-muted">در این بازه بازدیدی نیست</p>
      </section>

      <section class="rounded-2xl border border-mist bg-white p-4 sm:p-5 xl:col-span-2">
        <div class="mb-3 flex items-center justify-between gap-2">
          <h2 class="font-semibold text-ink">جدول زمانی</h2>
          <p class="text-[11px] text-ink-muted">کلیک = ساعت‌ها</p>
        </div>
        <div class="max-h-72 space-y-2 overflow-y-auto pe-1">
          <button
            v-for="item in data?.series ?? []"
            :key="item.day"
            type="button"
            class="flex w-full items-center justify-between gap-2 rounded-xl bg-[#f8fafc] px-3 py-2 text-sm ring-1 ring-mist/70 transition hover:bg-green-soft/40 hover:ring-green-deep/30"
            @click="openDayDetail(item.day)"
          >
            <span class="text-ink-muted">{{ formatBucket(item.day) }}</span>
            <span class="tabular-nums font-semibold text-green-deep">{{ fa(item.visits) }}</span>
          </button>
          <p v-if="!data?.series?.length" class="py-6 text-center text-sm text-ink-muted">داده‌ای نیست</p>
        </div>
      </section>
    </div>

    <section class="rounded-2xl border border-mist bg-white p-4 sm:p-5">
      <div class="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 class="font-semibold text-ink">جزئیات صفحات</h2>
          <p class="text-[11px] text-ink-muted">تا ۲۵ صفحه پربازدید این دوره</p>
        </div>
        <input
          v-model="query"
          type="search"
          placeholder="جستجوی صفحه…"
          class="w-full rounded-xl border border-mist px-3 py-2 text-sm outline-none focus:border-green-deep sm:max-w-xs"
        >
      </div>

      <ul class="space-y-2">
        <li
          v-for="(item, index) in filteredPages"
          :key="item.path"
          class="rounded-2xl bg-[#f8fafc] p-3 ring-1 ring-mist/80"
        >
          <div class="flex items-start justify-between gap-3">
            <div class="min-w-0">
              <p class="truncate text-sm font-medium text-ink">
                <span class="me-2 text-ink-muted tabular-nums">{{ fa(index + 1) }}.</span>
                {{ item.label }}
              </p>
              <p class="mt-0.5 truncate text-[11px] text-ink-muted dir-ltr">{{ item.path }}</p>
            </div>
            <p class="shrink-0 tabular-nums text-sm font-bold text-green-deep">
              {{ fa(item.visits) }}
            </p>
          </div>
          <div class="mt-2 h-1.5 overflow-hidden rounded-full bg-mist">
            <div
              class="h-full rounded-full bg-green-deep"
              :style="{ width: `${Math.max(6, (item.visits / maxPageVisits) * 100)}%` }"
            />
          </div>
        </li>
      </ul>
      <p v-if="!filteredPages.length" class="py-8 text-center text-sm text-ink-muted">
        صفحه‌ای با این جستجو پیدا نشد
      </p>
    </section>

    <AdminModal
      :open="detailOpen"
      :title="`ساعت بازدید — ${detailTitle}`"
      @close="closeDetail"
    >
      <p v-if="detailLoading" class="py-8 text-center text-sm text-ink-muted">
        در حال بارگذاری ساعت‌ها…
      </p>
      <p v-else-if="detailError" class="text-sm text-red-600">{{ detailError }}</p>
      <template v-else-if="detail">
        <p class="mb-4 text-[13px] text-ink-muted">
          {{ fa(detail.total) }} بازدید یکتا در این بازه — هر ردیف زمان ثبت همان دستگاه روی همان صفحه است.
        </p>
        <div class="max-h-[55vh] space-y-2 overflow-y-auto pe-1">
          <div
            v-for="hit in detail.visits"
            :key="hit.id"
            class="flex items-start justify-between gap-3 rounded-xl bg-[#f8fafc] px-3 py-2.5 ring-1 ring-mist/70"
          >
            <div class="min-w-0">
              <p class="truncate text-sm font-medium text-ink">{{ hit.label }}</p>
              <p class="mt-0.5 truncate text-[11px] text-ink-muted dir-ltr">{{ hit.path }}</p>
              <p v-if="showDayColumn" class="mt-1 text-[11px] text-ink-muted">
                {{ formatDayLabel(hit.day) }}
              </p>
            </div>
            <p class="shrink-0 tabular-nums text-sm font-bold text-green-deep dir-ltr">
              {{ hit.timeShort }}
            </p>
          </div>
          <p v-if="!detail.visits.length" class="py-8 text-center text-sm text-ink-muted">
            بازدیدی در این بازه ثبت نشده
          </p>
        </div>
      </template>
    </AdminModal>
  </div>
</template>
