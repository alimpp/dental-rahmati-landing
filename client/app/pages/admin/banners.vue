<script setup lang="ts">
import { adminModule } from '~/modules'
import type { TBanner } from '~/modules/banner/types/index.type'
import { formatFaDate, unwrapList } from '~/modules/admin/utils'

definePageMeta({ layout: 'admin', robots: false })

const can = (action: 'view' | 'create' | 'edit' | 'delete') =>
  adminModule.controller.can('banners', action)
const { confirm: confirmDelete } = useAdminConfirm()

const items = ref<TBanner[]>([])
const error = ref('')
const saving = ref(false)
const modal = ref(false)
const editing = ref<TBanner | null>(null)
const form = reactive({
  image: '',
  title: '',
  subtitle: '',
  description: '',
  link: '',
  sort: 0,
  button1Text: '',
  button1Link: '',
  button2Text: '',
  button2Link: '',
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
  const response = await adminModule.service.getAll<TBanner[]>('/banners', { all: 'true' })
  if (!response.success) {
    error.value = response.message
    return
  }
  items.value = unwrapList<TBanner>(response.data)
}

function openCreate() {
  editing.value = null
  Object.assign(form, {
    image: '',
    title: '',
    subtitle: '',
    description: '',
    link: '',
    sort: 0,
    button1Text: '',
    button1Link: '',
    button2Text: '',
    button2Link: '',
    isActive: true,
  })
  modal.value = true
}

function openEdit(item: TBanner) {
  editing.value = item
  Object.assign(form, {
    image: item.image,
    title: item.title,
    subtitle: item.subtitle ?? '',
    description: item.description ?? '',
    link: item.link ?? '',
    sort: item.sort,
    button1Text: item.button1Text ?? '',
    button1Link: item.button1Link ?? '',
    button2Text: item.button2Text ?? '',
    button2Link: item.button2Link ?? '',
    isActive: item.isActive,
  })
  modal.value = true
}

function payload() {
  return {
    image: form.image,
    title: form.title,
    subtitle: form.subtitle || null,
    description: form.description || null,
    link: form.link || null,
    sort: Number(form.sort) || 0,
    button1Text: form.button1Text || null,
    button1Link: form.button1Link || null,
    button2Text: form.button2Text || null,
    button2Link: form.button2Link || null,
    isActive: form.isActive,
  }
}

async function save() {
  saving.value = true
  error.value = ''
  const response = editing.value
    ? await adminModule.service.updateItem(`/banners/${editing.value.id}`, payload())
    : await adminModule.service.createItem('/banners', payload())
  saving.value = false
  if (!response.success) {
    error.value = response.message
    return
  }
  modal.value = false
  await load()
}

async function remove(item: TBanner) {
  if (!(await confirmDelete(`بنر «${item.title}» حذف شود؟`))) return
  const response = await adminModule.service.deleteItem(`/banners/${item.id}`)
  if (!response.success) {
    error.value = response.message
    return
  }
  await load()
}
</script>

<template>
  <div>
    <AdminHeader
      title="بنرها"
      action-label="بنر جدید"
      :show-action="can('create')"
      @action="openCreate"
    />
    <p v-if="error" class="mb-3 text-sm text-red-600">{{ error }}</p>
    <div class="overflow-x-auto rounded-2xl border border-mist bg-white">
      <table class="w-full min-w-[640px] text-right text-sm">
        <thead class="bg-mist/60 text-ink-muted">
          <tr>
            <th class="p-3 font-medium">تصویر</th>
            <th class="p-3 font-medium">عنوان</th>
            <th class="p-3 font-medium">وضعیت</th>
            <th class="p-3 font-medium">ترتیب</th>
            <th class="p-3 font-medium">تاریخ</th>
            <th class="p-3 font-medium">عملیات</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in items" :key="item.id" class="border-t border-mist">
            <td class="p-3"><AdminThumb :src="item.image" :alt="item.title" /></td>
            <td class="p-3">{{ item.title }}</td>
            <td class="p-3"><AdminStatus :active="item.isActive" /></td>
            <td class="p-3">{{ item.sort }}</td>
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

    <AdminModal :open="modal" :title="editing ? 'ویرایش بنر' : 'بنر جدید'" @close="modal = false">
      <form class="grid gap-3" @submit.prevent="save">
        <label class="text-sm">عنوان<input v-model="form.title" required class="mt-1 w-full rounded-xl border border-mist px-3 py-2"></label>
        <AdminMediaField v-model="form.image" label="تصویر بنر" required />
        <label class="text-sm">زیرعنوان<input v-model="form.subtitle" class="mt-1 w-full rounded-xl border border-mist px-3 py-2"></label>
        <label class="text-sm">توضیح<textarea v-model="form.description" rows="3" class="mt-1 w-full rounded-xl border border-mist px-3 py-2" /></label>
        <div class="grid gap-3 sm:grid-cols-2">
          <label class="text-sm">دکمه ۱<input v-model="form.button1Text" class="mt-1 w-full rounded-xl border border-mist px-3 py-2"></label>
          <label class="text-sm">لینک دکمه ۱<input v-model="form.button1Link" class="mt-1 w-full rounded-xl border border-mist px-3 py-2"></label>
          <label class="text-sm">دکمه ۲<input v-model="form.button2Text" class="mt-1 w-full rounded-xl border border-mist px-3 py-2"></label>
          <label class="text-sm">لینک دکمه ۲<input v-model="form.button2Link" class="mt-1 w-full rounded-xl border border-mist px-3 py-2"></label>
        </div>
        <label class="text-sm">ترتیب<input v-model.number="form.sort" type="number" class="mt-1 w-full rounded-xl border border-mist px-3 py-2"></label>
        <AdminCheckbox v-model="form.isActive" label="فعال" />
        <button class="rounded-xl bg-green-deep py-2 text-ink disabled:opacity-60" :disabled="saving">ذخیره</button>
      </form>
    </AdminModal>
  </div>
</template>
