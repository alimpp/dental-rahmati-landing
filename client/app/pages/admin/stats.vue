<script setup lang="ts">
import { adminModule } from '~/modules'
import type { TStat } from '~/modules/stat/types/index.type'
import { unwrapList } from '~/modules/admin/utils'

definePageMeta({ layout: 'admin', robots: false })

const can = (action: 'view' | 'create' | 'edit' | 'delete') =>
  adminModule.controller.can('stats', action)
const { confirm: confirmDelete } = useAdminConfirm()

const items = ref<TStat[]>([])
const error = ref('')
const saving = ref(false)
const modal = ref(false)
const editing = ref<TStat | null>(null)
const form = reactive({
  value: '',
  label: '',
  icon: '',
  sort: 0,
  isActive: true,
})

onMounted(async () => {
  if (!can('view')) {
    await navigateTo('/admin')
    return
  }
  await load()
})

async function load() {
  const response = await adminModule.service.getAll<TStat[]>('/stats', { all: 'true' })
  if (!response.success) {
    error.value = response.message
    return
  }
  items.value = unwrapList<TStat>(response.data)
}

function openCreate() {
  editing.value = null
  Object.assign(form, {
    value: '',
    label: '',
    icon: '',
    sort: items.value.length ? Math.max(...items.value.map((entry) => entry.sort)) + 1 : 0,
    isActive: true,
  })
  modal.value = true
}

function openEdit(item: TStat) {
  editing.value = item
  Object.assign(form, {
    value: item.value ?? '',
    label: item.label ?? '',
    icon: item.icon ?? '',
    sort: item.sort,
    isActive: item.isActive,
  })
  modal.value = true
}

function payload() {
  return {
    value: form.value,
    label: form.label,
    icon: form.icon || null,
    sort: Number(form.sort) || 0,
    isActive: form.isActive,
  }
}

async function save() {
  saving.value = true
  error.value = ''
  try {
    const body = payload()
    const response = editing.value
      ? await adminModule.service.updateItem(`/stats/${editing.value.id}`, body)
      : await adminModule.service.createItem('/stats', body)
    saving.value = false
    if (!response.success) {
      error.value = response.message
      return
    }
    modal.value = false
    await load()
  }
  catch (err) {
    saving.value = false
    error.value = err instanceof Error ? err.message : 'خطا در ذخیره'
  }
}

async function remove(item: TStat) {
  if (!(await confirmDelete(`آمار «${item.label}» حذف شود؟`))) return
  const response = await adminModule.service.deleteItem(`/stats/${item.id}`)
  if (!response.success) {
    error.value = response.message
    return
  }
  await load()
}
</script>

<template>
  <div>
    <AdminHeader title="آمار صفحه اصلی" action-label="آمار جدید" :show-action="can('create')" @action="openCreate" />
    <p v-if="error" class="mb-3 text-sm text-red-600">{{ error }}</p>
    <div class="overflow-x-auto rounded-2xl border border-mist bg-white">
      <table class="w-full min-w-[640px] text-right text-sm">
        <thead class="bg-mist/60 text-ink-muted">
          <tr>
            <th class="p-3 font-medium">مقدار</th>
            <th class="p-3 font-medium">عنوان</th>
            <th class="p-3 font-medium">ترتیب</th>
            <th class="p-3 font-medium">وضعیت</th>
            <th class="p-3 font-medium">عملیات</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in items" :key="item.id" class="border-t border-mist">
            <td class="p-3">{{ item.value ?? '—' }}</td>
            <td class="p-3">{{ item.label ?? '—' }}</td>
            <td class="p-3">{{ item.sort }}</td>
            <td class="p-3"><AdminStatus :active="item.isActive" /></td>
            <td class="p-3">
              <AdminRowActions
                :can-edit="can('edit')"
                :can-delete="can('delete')"
                @edit="openEdit(item)"
                @delete="remove(item)"
              />
            </td>
          </tr>
        </tbody>
      </table>
      <p v-if="!items.length" class="p-6 text-center text-ink-muted">موردی نیست</p>
    </div>
    <AdminModal :open="modal" :title="editing ? 'ویرایش آمار' : 'آمار جدید'" @close="modal = false">
      <form class="grid gap-3" @submit.prevent="save">
        <label class="text-sm">مقدار (مثلا +۸۸)<input v-model="form.value" required class="mt-1 w-full rounded-xl border border-mist px-3 py-2"></label>
        <label class="text-sm">عنوان<textarea v-model="form.label" rows="2" required class="mt-1 w-full rounded-xl border border-mist px-3 py-2" /></label>
        <label class="text-sm">آیکن
          <select v-model="form.icon" class="mt-1 w-full rounded-xl border border-mist px-3 py-2">
            <option value="">بدون آیکن</option>
            <option value="/icons/stat-lawyer.svg">دندانپزشک</option>
            <option value="/icons/stat-cases.svg">بیمار</option>
            <option value="/icons/stat-experience.svg">تجربه</option>
            <option value="/icons/stat-success.svg">موفقیت</option>
          </select>
        </label>
        <label class="text-sm">ترتیب<input v-model.number="form.sort" type="number" class="mt-1 w-full rounded-xl border border-mist px-3 py-2"></label>
        <AdminCheckbox v-model="form.isActive" label="فعال" />
        <button class="rounded-xl bg-green-deep py-2 text-ink" :disabled="saving">ذخیره</button>
      </form>
    </AdminModal>
  </div>
</template>
