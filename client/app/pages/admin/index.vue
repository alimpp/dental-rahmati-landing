<script setup lang="ts">
import { adminModule } from '~/modules'
import type { TDashboard } from '~/modules/admin/types/index.type'

definePageMeta({
  layout: 'admin',
  robots: false,
})

const user = computed(() => adminModule.store.getUser)
const error = ref('')
const data = ref<TDashboard | null>(null)

onMounted(async () => {
  const response = await adminModule.controller.getDashboard()
  if (!response.success || !response.data) {
    error.value = response.message || 'آمار در دسترس نیست'
    return
  }
  data.value = response.data
})

function fa(value?: number) {
  return (value ?? 0).toLocaleString('fa-IR')
}

const primaryKpis = computed(() => {
  const totals = data.value?.totals
  if (!totals) return []
  return [
    { label: 'بازدید یکتای امروز', value: fa(totals.visitsToday), hint: 'هر دستگاه یک‌بار', tone: 'gold' as const },
    { label: 'بازدید یکتای هفته', value: fa(totals.visitsWeek), hint: '۷ روز اخیر', tone: 'green' as const },
    { label: 'دستگاه امروز', value: fa(totals.devicesToday), hint: 'دیوایس‌های فعال', tone: 'green' as const },
    { label: 'بازدید مقالات', value: fa(totals.articleVisits), hint: 'تجمعی', tone: 'gold' as const },
  ]
})

const secondaryKpis = computed(() => {
  const totals = data.value?.totals
  if (!totals) return []
  return [
    { label: 'کل بازدید یکتا', value: fa(totals.visits) },
    { label: 'صفحات دیده‌شده', value: fa(totals.uniquePaths) },
    { label: 'درخواست‌ها', value: fa(totals.inquiries) },
    { label: 'مقالات', value: fa(totals.articles) },
    { label: 'خدمات', value: fa(totals.services) },
  ]
})
</script>

<template>
  <div class="space-y-4">
    <div class="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-mist bg-white px-3 py-3 sm:px-4">
      <p class="text-[13px] leading-6 text-ink-muted">
        <span class="font-medium text-ink">{{ user?.displayName || user?.username }}</span>
        — هر دستگاه در هر صفحه، حداکثر یک‌بار در روز شمارش می‌شود.
      </p>
      <NuxtLink
        v-if="adminModule.controller.can('reports', 'view')"
        to="/admin/reports"
        class="inline-flex items-center gap-1.5 rounded-xl bg-green-soft px-3 py-2 text-[12px] font-medium text-green-deep transition hover:bg-green-deep hover:text-on-primary"
      >
        <AdminIcon src="/icons/admin-report.svg" size="size-3.5" />
        گزارش تفصیلی
      </NuxtLink>
    </div>

    <p v-if="error" class="text-sm text-red-600">{{ error }}</p>

    <div class="grid gap-3 grid-cols-2 xl:grid-cols-4">
      <article
        v-for="item in primaryKpis"
        :key="item.label"
        class="rounded-2xl border border-mist bg-white p-3 sm:p-4"
      >
        <p
          class="text-[11px] font-medium"
          :class="item.tone === 'gold' ? 'text-gold' : 'text-green-deep'"
        >
          {{ item.hint }}
        </p>
        <p class="mt-2 text-xl font-semibold tabular-nums text-ink sm:text-2xl">{{ item.value }}</p>
        <p class="mt-1 text-[12px] text-ink-muted">{{ item.label }}</p>
      </article>
    </div>

    <div class="grid gap-2 grid-cols-2 sm:grid-cols-3 xl:grid-cols-6">
      <article
        v-for="item in secondaryKpis"
        :key="item.label"
        class="rounded-xl border border-mist/80 bg-white px-3 py-2.5"
      >
        <p class="text-base font-semibold tabular-nums text-ink">{{ item.value }}</p>
        <p class="mt-0.5 text-[11px] text-ink-muted">{{ item.label }}</p>
      </article>
    </div>

    <div class="grid gap-4 xl:grid-cols-5">
      <section class="rounded-2xl border border-mist bg-white p-4 sm:p-5 xl:col-span-3">
        <div class="mb-3 flex items-end justify-between gap-2">
          <div>
            <h2 class="font-semibold text-ink">روند ۱۴ روز</h2>
            <p class="text-[11px] text-ink-muted">بازدید یکتای روزانه</p>
          </div>
        </div>
        <AdminLineChart v-if="data?.series?.length" :series="data.series" />
        <p v-else class="py-10 text-center text-sm text-ink-muted">هنوز نموداری نیست</p>
      </section>

      <section class="rounded-2xl border border-mist bg-white p-4 sm:p-5 xl:col-span-2">
        <h2 class="mb-1 font-semibold text-ink">پربازدیدترین صفحات</h2>
        <p class="mb-4 text-[11px] text-ink-muted">بر اساس بازدید یکتای دستگاه</p>
        <AdminBarChart v-if="data?.pages?.length" :items="data.pages" />
        <p v-else class="text-sm text-ink-muted">صفحه‌ای ثبت نشده</p>
      </section>
    </div>

    <section class="rounded-2xl border border-mist bg-white p-4 sm:p-5">
      <h2 class="mb-1 font-semibold text-ink">بازدید مقالات</h2>
      <p class="mb-3 text-[11px] text-ink-muted">جزئیات مسیرهای مقاله</p>
      <div class="overflow-x-auto">
        <table class="w-full min-w-[480px] text-right text-sm">
          <thead class="text-ink-muted">
            <tr>
              <th class="p-2 font-medium">مقاله</th>
              <th class="hidden p-2 font-medium sm:table-cell">مسیر</th>
              <th class="p-2 font-medium">بازدید یکتا</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in data?.articles ?? []" :key="item.path" class="border-t border-mist">
              <td class="p-2">{{ item.label }}</td>
              <td class="hidden p-2 text-ink-muted dir-ltr sm:table-cell">{{ item.path }}</td>
              <td class="p-2 tabular-nums text-green-deep">{{ fa(item.visits) }}</td>
            </tr>
          </tbody>
        </table>
        <p v-if="!data?.articles?.length" class="p-4 text-sm text-ink-muted">هنوز بازدید مقاله‌ای جدا ثبت نشده</p>
      </div>
    </section>
  </div>
</template>
