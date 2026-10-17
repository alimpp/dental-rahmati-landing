<script setup lang="ts">
import { adminModule } from '~/modules'
import type { TVisitReport, VisitReportRange } from '~/modules/admin/types/index.type'

definePageMeta({ layout: 'admin', robots: false })

const error = ref('')
const loading = ref(false)
const range = ref('daily')
const data = ref<TVisitReport | null>(null)

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

const change = computed(() => data.value?.totals.changePercent ?? 0)
const kpis = computed(() => {
  const totals = data.value?.totals
  if (!totals) return []
  return [
    { label: 'بازدید این دوره', value: fa(totals.visits) },
    { label: 'بازدید مقالات', value: fa(totals.articleVisits) },
    { label: 'تعداد صفحات', value: fa(totals.uniquePaths) },
    { label: 'نسبت به دوره قبل', value: `${change.value > 0 ? '+' : ''}${fa(change.value)}٪` },
  ]
})
</script>

<template>
  <div>
    <div class="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
      <AdminSelect
        v-model="range"
        :options="rangeOptions"
        :allow-empty="false"
        placeholder="بازه گزارش"
      />
    </div>

    <p v-if="error" class="mb-3 text-sm text-red-600">{{ error }}</p>
    <p v-else-if="loading" class="mb-3 text-sm text-ink-muted">در حال بارگذاری گزارش...</p>

    <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <article v-for="item in kpis" :key="item.label" class="rounded-2xl border border-mist bg-white p-4">
        <p class="text-2xl font-semibold text-ink">{{ item.value }}</p>
        <p class="mt-1 text-xs text-ink-muted">{{ item.label }}</p>
      </article>
    </div>

    <div class="mt-5 grid gap-4 xl:grid-cols-5">
      <section class="rounded-2xl border border-mist bg-white p-5 xl:col-span-3">
        <h2 class="font-semibold text-ink">روند بازدید</h2>
        <p class="mb-3 text-xs text-ink-muted">{{ rangeOptions.find((item) => item.value === range)?.label }}</p>
        <AdminLineChart v-if="data?.series?.length" :series="data.series" />
        <p v-else class="py-10 text-center text-sm text-ink-muted">در این بازه بازدیدی نیست</p>
      </section>
      <section class="rounded-2xl border border-mist bg-white p-5 xl:col-span-2">
        <h2 class="mb-3 font-semibold text-ink">پربازدیدترین صفحات</h2>
        <AdminBarChart v-if="data?.pages?.length" :items="data.pages" />
        <p v-else class="text-sm text-ink-muted">صفحه‌ای ثبت نشده</p>
      </section>
    </div>

    <section class="mt-4 overflow-x-auto rounded-2xl border border-mist bg-white">
      <table class="w-full min-w-[520px] text-right text-sm">
        <thead class="bg-mist/60 text-ink-muted">
          <tr>
            <th class="p-3 font-medium">بازه</th>
            <th class="p-3 font-medium">بازدید</th>
            <th class="p-3 font-medium">مقالات</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in data?.series ?? []" :key="item.day" class="border-t border-mist">
            <td class="p-3">{{ formatBucket(item.day) }}</td>
            <td class="p-3 text-green-deep">{{ fa(item.visits) }}</td>
            <td class="p-3">{{ fa(item.articleVisits) }}</td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>
