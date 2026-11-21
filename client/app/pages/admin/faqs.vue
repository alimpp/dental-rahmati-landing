<script setup lang="ts">
import { adminModule } from '~/modules'
import type { TFaq } from '~/modules/faq/types/index.type'
import { unwrapList } from '~/modules/admin/utils'

definePageMeta({ layout: 'admin', robots: false })

const can = (action: 'view' | 'create' | 'edit' | 'delete') =>
  adminModule.controller.can('faqs', action)
const { confirm: confirmDelete } = useAdminConfirm()

const items = ref<TFaq[]>([])
const error = ref('')
const saving = ref(false)
const togglingId = ref<string | null>(null)
const modal = ref(false)
const editing = ref<TFaq | null>(null)
const form = reactive({
  question: '',
  answer: '',
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
  const response = await adminModule.service.getAll<TFaq[]>('/faqs', { all: 'true' })
  if (!response.success) {
    error.value = response.message
    return
  }
  items.value = unwrapList<TFaq>(response.data)
}

function openCreate() {
  editing.value = null
  Object.assign(form, {
    question: '',
    answer: '',
    sort: items.value.length ? Math.max(...items.value.map((entry) => entry.sort)) + 1 : 0,
    isActive: true,
  })
  modal.value = true
}

function openEdit(item: TFaq) {
  editing.value = item
  Object.assign(form, {
    question: item.question ?? '',
    answer: item.answer ?? '',
    sort: item.sort,
    isActive: item.isActive,
  })
  modal.value = true
}

function payload() {
  return {
    question: form.question,
    answer: form.answer,
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
      ? await adminModule.service.updateItem(`/faqs/${editing.value.id}`, body)
      : await adminModule.service.createItem('/faqs', body)
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


async function toggleActive(item: TFaq) {
  if (!can('edit')) return
  togglingId.value = item.id
  error.value = ''
  const response = await adminModule.service.updateItem(`/faqs/${item.id}`, {
    isActive: !item.isActive,
  })
  togglingId.value = null
  if (!response.success) {
    error.value = response.message
    return
  }
  await load()
}

async function remove(item: TFaq) {
  if (!(await confirmDelete(`سوال «${item.question}» حذف شود؟`))) return
  const response = await adminModule.service.deleteItem(`/faqs/${item.id}`)
  if (!response.success) {
    error.value = response.message
    return
  }
  await load()
}
</script>

<template>
  <div class="min-w-0">
    <AdminHeader title="سوالات متداول" action-label="سوال جدید" :show-action="can('create')" @action="openCreate" />
    <p v-if="error" class="mb-3 text-sm text-red-600">{{ error }}</p>
    <AdminListPanel :count="items.length">
      <template #table>
        <table class="w-full text-right text-sm">
        <thead class="bg-mist/60 text-ink-muted">
          <tr>
            <th class="p-3 font-medium">سوال</th>
            <th class="p-3 font-medium">پاسخ</th>
            <th class="p-3 font-medium">ترتیب</th>
            <th class="p-3 font-medium">وضعیت</th>
            <th class="p-3 font-medium">عملیات</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in items" :key="item.id" class="border-t border-mist">
            <td class="p-3">{{ item.question ?? '—' }}</td>
            <td class="p-3 max-w-xs"><span class="line-clamp-2">{{ item.answer }}</span></td>
            <td class="p-3">{{ item.sort }}</td>
            <td class="p-3"><AdminStatus
                  :active="item.isActive"
                  :clickable="can('edit')"
                  :busy="togglingId === item.id"
                  @toggle="toggleActive(item)"
                /></td>
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
      </template>
      <template #cards>
        <AdminMobileCard
          v-for="item in items"
          :key="item.id"
          :title="item.question"
          :subtitle="item.answer"
          
          :active="item.isActive"
          :can-toggle="can('edit')"
          :toggle-busy="togglingId === item.id"
          :can-edit="can('edit')"
          :can-delete="can('delete')"
          :meta="`ترتیب ${item.sort}`"
          @toggle="toggleActive(item)"
          @edit="openEdit(item)"
          @delete="remove(item)"
        />
      </template>
    </AdminListPanel>
    <AdminModal :open="modal" :title="editing ? 'ویرایش سوال' : 'سوال جدید'" @close="modal = false">
      <form id="admin-faqs-form" class="grid gap-3" @submit.prevent="save">
        <label class="text-sm">سوال<input v-model="form.question" required class="mt-1 w-full rounded-xl border border-mist px-3 py-2"></label>
        <label class="text-sm">پاسخ<textarea v-model="form.answer" rows="5" required class="mt-1 w-full rounded-xl border border-mist px-3 py-2" /></label>
        <label class="text-sm">ترتیب<input v-model.number="form.sort" type="number" class="mt-1 w-full rounded-xl border border-mist px-3 py-2"></label>
        <AdminCheckbox v-model="form.isActive" label="فعال" />

        </form>
      <template #footer>
          <button class="w-full rounded-xl bg-green-deep py-2.5 text-sm font-semibold text-on-primary shadow-sm transition hover:brightness-110 disabled:opacity-60" type="submit" form="admin-faqs-form" :disabled="saving">ذخیره</button>
      </template>
    </AdminModal>
  </div>
</template>
