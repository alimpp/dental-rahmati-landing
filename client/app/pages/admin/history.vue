<script setup lang="ts">
import { adminModule } from '~/modules'
import {
  MODULE_LABELS,
  type AdminModuleKey,
  type TAuditLog,
} from '~/modules/admin/types/index.type'
import { formatFaDate } from '~/modules/admin/utils'

definePageMeta({ layout: 'admin', robots: false })

const items = ref<TAuditLog[]>([])
const error = ref('')
const page = ref(1)
const pageCount = ref(1)
const moduleFilter = ref('')

const modules = Object.entries(MODULE_LABELS) as [AdminModuleKey, string][]

onMounted(async () => {
  if (!adminModule.controller.can('history', 'view')) {
    await navigateTo('/admin')
    return
  }
  await load()
})

async function load() {
  const response = await adminModule.controller.getHistory({
    module: moduleFilter.value || undefined,
    page: page.value,
    limit: 20,
  })
  if (!response.success || !response.data) {
    error.value = response.message
    return
  }
  items.value = response.data.items
  pageCount.value = response.data.pageCount
}

watch(moduleFilter, () => {
  page.value = 1
  load()
})
</script>

<template>
  <div>
    <AdminHeader title="تاریخچه" />
    <div class="mb-4">
      <AdminSelect
        v-model="moduleFilter"
        :options="modules.map(([value, label]) => ({ value, label }))"
        placeholder="همه بخش‌ها"
      />
    </div>
    <p v-if="error" class="mb-3 text-sm text-red-600">{{ error }}</p>
    <div class="overflow-x-auto rounded-2xl border border-mist bg-white">
      <table class="w-full min-w-[720px] text-right text-sm">
        <thead class="bg-mist/60 text-ink-muted">
          <tr>
            <th class="p-3 font-medium">زمان</th>
            <th class="p-3 font-medium">کاربر</th>
            <th class="p-3 font-medium">بخش</th>
            <th class="p-3 font-medium">عملیات</th>
            <th class="p-3 font-medium">شرح</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in items" :key="item.id" class="border-t border-mist">
            <td class="p-3 whitespace-nowrap">{{ formatFaDate(item.createdAt) }}</td>
            <td class="p-3">{{ item.actorUsername }}</td>
            <td class="p-3">{{ MODULE_LABELS[item.module as AdminModuleKey] || item.module }}</td>
            <td class="p-3">{{ item.action }}</td>
            <td class="p-3">{{ item.summary }}</td>
          </tr>
        </tbody>
      </table>
      <p v-if="!items.length" class="p-6 text-center text-ink-muted">سابقه‌ای نیست</p>
    </div>
    <div v-if="pageCount > 1" class="mt-4 flex gap-2">
      <button
        class="rounded-lg border border-mist bg-white px-3 py-1 text-sm disabled:opacity-40"
        :disabled="page <= 1"
        type="button"
        @click="page -= 1; load()"
      >
        قبلی
      </button>
      <button
        class="rounded-lg border border-mist bg-white px-3 py-1 text-sm disabled:opacity-40"
        :disabled="page >= pageCount"
        type="button"
        @click="page += 1; load()"
      >
        بعدی
      </button>
    </div>
  </div>
</template>
