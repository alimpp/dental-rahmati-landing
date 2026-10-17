<script setup lang="ts">
import { adminModule } from '~/modules'
import type { TInquiry } from '~/modules/inquiry/types/index.type'
import { formatFaDate, unwrapList } from '~/modules/admin/utils'

definePageMeta({ layout: 'admin', robots: false })

const can = (action: 'view' | 'delete') => adminModule.controller.can('inquiries', action)
const { confirm: confirmDelete } = useAdminConfirm()

const items = ref<TInquiry[]>([])
const error = ref('')

onMounted(async () => {
  if (!can('view')) {
    await navigateTo('/admin')
    return
  }
  await load()
})

async function load() {
  const response = await adminModule.service.getAll<TInquiry[]>('/inquiries')
  if (!response.success) {
    error.value = response.message
    return
  }
  items.value = unwrapList<TInquiry>(response.data)
}

async function remove(item: TInquiry) {
  if (!(await confirmDelete(`درخواست «${item.name}» حذف شود؟`))) return
  const response = await adminModule.service.deleteItem(`/inquiries/${item.id}`)
  if (!response.success) {
    error.value = response.message
    return
  }
  await load()
}
</script>

<template>
  <div>
    <AdminHeader title="درخواست‌ها" />
    <p v-if="error" class="mb-3 text-sm text-red-600">{{ error }}</p>
    <div class="overflow-x-auto rounded-2xl border border-mist bg-white">
      <table class="w-full min-w-[720px] text-right text-sm">
        <thead class="bg-mist/60 text-ink-muted">
          <tr>
            <th class="p-3 font-medium">نام</th>
            <th class="p-3 font-medium">تلفن</th>
            <th class="p-3 font-medium">موضوع</th>
            <th class="p-3 font-medium">منبع</th>
            <th class="p-3 font-medium">تاریخ</th>
            <th class="p-3 font-medium">عملیات</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in items" :key="item.id" class="border-t border-mist align-top">
            <td class="p-3">{{ item.name }}</td>
            <td class="p-3 dir-ltr">{{ item.phone }}</td>
            <td class="p-3">
              <p>{{ item.subject }}</p>
              <p class="mt-1 text-ink-muted">{{ item.message }}</p>
            </td>
            <td class="p-3">{{ item.source }}</td>
            <td class="p-3">{{ formatFaDate(item.createdAt) }}</td>
            <td class="p-3">
              <AdminRowActions
                :can-delete="can('delete')"
                @delete="remove(item)"
              />
            </td>
          </tr>
        </tbody>
      </table>
      <p v-if="!items.length" class="p-6 text-center text-ink-muted">درخواستی ثبت نشده</p>
    </div>
  </div>
</template>
