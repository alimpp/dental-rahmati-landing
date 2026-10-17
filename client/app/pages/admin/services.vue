<script setup lang="ts">
import { adminModule } from '~/modules'
import type { TService } from '~/modules/service/types/index.type'
import { formatFaDate, parseJsonOrThrow, prettyJson, unwrapList } from '~/modules/admin/utils'

definePageMeta({ layout: 'admin', robots: false })

const can = (action: 'view' | 'create' | 'edit' | 'delete') =>
  adminModule.controller.can('services', action)
const { confirm: confirmDelete } = useAdminConfirm()

const items = ref<TService[]>([])
const error = ref('')
const saving = ref(false)
const modal = ref(false)
const editing = ref<TService | null>(null)
const form = reactive({
  title: '',
  slug: '',
  description: '',
  icon: '',
  coverImage: '',
  casePathTitle: '',
  casePathDescription: '',
  sections: '',
  requiredDocuments: '',
  seoTitle: '',
  seoDescription: '',
  seoKeywords: '',
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
  const response = await adminModule.service.getAll<TService[]>('/services', { all: 'true' })
  if (!response.success) {
    error.value = response.message
    return
  }
  items.value = unwrapList<TService>(response.data)
}

function openCreate() {
  editing.value = null
  Object.assign(form, {
    title: '',
    slug: '',
    description: '',
    icon: '',
    coverImage: '',
    casePathTitle: '',
    casePathDescription: '',
    sections: '[]',
    requiredDocuments: '[]',
    seoTitle: '',
    seoDescription: '',
    seoKeywords: '',
    sort: 0,
    isActive: true,
  })
  modal.value = true
}

function openEdit(item: TService) {
  editing.value = item
  Object.assign(form, {
    title: item.title,
    slug: item.slug,
    description: item.description,
    icon: item.icon,
    coverImage: item.coverImage ?? '',
    casePathTitle: item.casePathTitle ?? '',
    casePathDescription: item.casePathDescription ?? '',
    sections: prettyJson(item.sections ?? []),
    requiredDocuments: prettyJson(item.requiredDocuments ?? []),
    seoTitle: item.seoTitle ?? '',
    seoDescription: item.seoDescription ?? '',
    seoKeywords: item.seoKeywords ?? '',
    sort: item.sort,
    isActive: item.isActive,
  })
  modal.value = true
}

function payload() {
  return {
    title: form.title,
    slug: form.slug,
    description: form.description,
    icon: form.icon,
    coverImage: form.coverImage || null,
    casePathTitle: form.casePathTitle || null,
    casePathDescription: form.casePathDescription || null,
    sections: parseJsonOrThrow(form.sections, 'بخش‌ها'),
    requiredDocuments: parseJsonOrThrow(form.requiredDocuments, 'مدارک'),
    seoTitle: form.seoTitle || null,
    seoDescription: form.seoDescription || null,
    seoKeywords: form.seoKeywords || null,
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
      ? await adminModule.service.updateItem(`/services/${editing.value.id}`, body)
      : await adminModule.service.createItem('/services', body)
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

async function remove(item: TService) {
  if (!(await confirmDelete(`خدمت «${item.title}» حذف شود؟`))) return
  const response = await adminModule.service.deleteItem(`/services/${item.id}`)
  if (!response.success) {
    error.value = response.message
    return
  }
  await load()
}
</script>

<template>
  <div>
    <AdminHeader title="خدمات" action-label="خدمت جدید" :show-action="can('create')" @action="openCreate" />
    <p v-if="error" class="mb-3 text-sm text-red-600">{{ error }}</p>
    <div class="overflow-x-auto rounded-2xl border border-mist bg-white">
      <table class="w-full min-w-[640px] text-right text-sm">
        <thead class="bg-mist/60 text-ink-muted">
          <tr>
            <th class="p-3 font-medium">تصویر</th>
            <th class="p-3 font-medium">عنوان</th>
            <th class="p-3 font-medium">اسلاگ</th>
            <th class="p-3 font-medium">وضعیت</th>
            <th class="p-3 font-medium">تاریخ</th>
            <th class="p-3 font-medium">عملیات</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in items" :key="item.id" class="border-t border-mist">
            <td class="p-3"><AdminThumb :src="item.coverImage || item.icon" :alt="item.title" /></td>
            <td class="p-3">{{ item.title }}</td>
            <td class="p-3">{{ item.slug }}</td>
            <td class="p-3"><AdminStatus :active="item.isActive" /></td>
            <td class="p-3">{{ formatFaDate(item.updatedAt || item.createdAt) }}</td>
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
    <AdminModal :open="modal" :title="editing ? 'ویرایش خدمت' : 'خدمت جدید'" @close="modal = false">
      <form class="grid gap-3" @submit.prevent="save">
        <label class="text-sm">عنوان<input v-model="form.title" required class="mt-1 w-full rounded-xl border border-mist px-3 py-2"></label>
        <label class="text-sm">اسلاگ<input v-model="form.slug" required class="mt-1 w-full rounded-xl border border-mist px-3 py-2"></label>
        <label class="text-sm">توضیح<textarea v-model="form.description" rows="3" required class="mt-1 w-full rounded-xl border border-mist px-3 py-2" /></label>
        <AdminMediaField v-model="form.icon" label="آیکون" required accept="image/jpeg,image/png,image/webp,image/svg+xml" />
        <AdminMediaField v-model="form.coverImage" label="کاور" />
        <label class="text-sm">عنوان مسیر درمان<input v-model="form.casePathTitle" class="mt-1 w-full rounded-xl border border-mist px-3 py-2"></label>
        <label class="text-sm">توضیح مسیر درمان<textarea v-model="form.casePathDescription" rows="2" class="mt-1 w-full rounded-xl border border-mist px-3 py-2" /></label>
        <label class="text-sm">بخش‌ها (JSON)<textarea v-model="form.sections" rows="5" class="mt-1 w-full rounded-xl border border-mist px-3 py-2 font-mono text-xs" /></label>
        <label class="text-sm">مدارک لازم (JSON آرایه)<textarea v-model="form.requiredDocuments" rows="3" class="mt-1 w-full rounded-xl border border-mist px-3 py-2 font-mono text-xs" /></label>
        <label class="text-sm">ترتیب<input v-model.number="form.sort" type="number" class="mt-1 w-full rounded-xl border border-mist px-3 py-2"></label>
        <AdminCheckbox v-model="form.isActive" label="فعال" />
        <button class="rounded-xl bg-green-deep py-2 text-ink" :disabled="saving">ذخیره</button>
      </form>
    </AdminModal>
  </div>
</template>
