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

const kpis = computed(() => {
  const totals = data.value?.totals
  if (!totals) return []
  return [
    { label: 'بازدید کل سایت', value: fa(totals.visits), icon: '/icons/admin-dashboard.svg', tone: 'green' },
    { label: 'بازدید امروز', value: fa(totals.visitsToday), icon: '/icons/clock.svg', tone: 'gold' },
    { label: 'بازدید هفته', value: fa(totals.visitsWeek), icon: '/icons/admin-banner.svg', tone: 'green' },
    { label: 'بازدید مقالات', value: fa(totals.articleVisits), icon: '/icons/articles.svg', tone: 'gold' },
    { label: 'درخواست‌ها', value: fa(totals.inquiries), icon: '/icons/contact.svg', tone: 'green' },
    { label: 'مقالات', value: fa(totals.articles), icon: '/icons/articles.svg', tone: 'gold' },
    { label: 'خدمات', value: fa(totals.services), icon: '/icons/practice.svg', tone: 'green' },
    { label: 'راهنماها', value: fa(totals.guides), icon: '/icons/articles.svg', tone: 'gold' },
  ]
})
</script>

<template>
  <div>
    <div class="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-mist bg-white px-4 py-3">
      <p class="text-sm text-ink-muted">
        <span class="font-medium text-ink">{{ user?.displayName || user?.username }}</span>،
        آمار از بازدید واقعی صفحات سایت خوانده می‌شود.
      </p>
      <NuxtLink
        v-if="adminModule.controller.can('reports', 'view')"
        to="/admin/reports"
        class="inline-flex items-center gap-1.5 rounded-xl bg-green-soft px-3 py-2 text-[12px] font-medium text-green-deep transition hover:bg-green-deep hover:text-ink"
      >
        <AdminIcon src="/icons/admin-report.svg" size="size-3.5" />
        گزارش تفصیلی
      </NuxtLink>
    </div>

    <p v-if="error" class="mb-4 text-sm text-red-600">{{ error }}</p>

    <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <article
        v-for="item in kpis"
        :key="item.label"
        class="rounded-2xl border border-mist bg-white p-4"
      >
        <div class="flex items-center justify-between">
          <span
            class="inline-flex size-10 items-center justify-center rounded-xl"
            :class="item.tone === 'gold' ? 'bg-gold/15 text-gold' : 'bg-green-soft text-green-deep'"
          >
            <AdminIcon :src="item.icon" />
          </span>
        </div>
        <p class="mt-4 text-2xl font-semibold text-ink">{{ item.value }}</p>
        <p class="mt-1 text-xs text-ink-muted">{{ item.label }}</p>
      </article>
    </div>

    <div class="mt-5 grid gap-4 xl:grid-cols-5">
      <section class="rounded-2xl border border-mist bg-white p-5 xl:col-span-3">
        <div class="mb-3 flex items-end justify-between">
          <div>
            <h2 class="font-semibold text-ink">بازدید ۱۴ روز اخیر</h2>
            <p class="text-xs text-ink-muted">روند کل بازدید سایت</p>
          </div>
          <span class="text-[11px] text-gold">خط سبز · نقاط طلایی</span>
        </div>
        <AdminLineChart v-if="data?.series?.length" :series="data.series" />
        <p v-else class="py-10 text-center text-sm text-ink-muted">هنوز نموداری نیست</p>
      </section>

      <section class="rounded-2xl border border-mist bg-white p-5 xl:col-span-2">
        <h2 class="mb-1 font-semibold text-ink">پربازدیدترین صفحات</h2>
        <p class="mb-4 text-xs text-ink-muted">آمار تجمعی همه مسیرها</p>
        <AdminBarChart v-if="data?.pages?.length" :items="data.pages" />
        <p v-else class="text-sm text-ink-muted">صفحه‌ای ثبت نشده</p>
      </section>
    </div>

    <section class="mt-4 rounded-2xl border border-mist bg-white p-5">
      <h2 class="mb-1 font-semibold text-ink">بازدید مقالات</h2>
      <p class="mb-4 text-xs text-ink-muted">مسیرهای جزئی مقالات</p>
      <div class="overflow-x-auto">
        <table class="w-full min-w-[520px] text-right text-sm">
          <thead class="text-ink-muted">
            <tr>
              <th class="p-2 font-medium">مقاله</th>
              <th class="p-2 font-medium">مسیر</th>
              <th class="p-2 font-medium">بازدید</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in data?.articles ?? []" :key="item.path" class="border-t border-mist">
              <td class="p-2">{{ item.label }}</td>
              <td class="p-2 text-ink-muted dir-ltr">{{ item.path }}</td>
              <td class="p-2 text-green-deep">{{ fa(item.visits) }}</td>
            </tr>
          </tbody>
        </table>
        <p v-if="!data?.articles?.length" class="p-4 text-sm text-ink-muted">هنوز بازدید مقاله‌ای جدا ثبت نشده</p>
      </div>
    </section>
  </div>
</template>
