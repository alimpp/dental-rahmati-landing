<script setup lang="ts">
import { adminModule } from '~/modules'
import type { TClinicRoom } from '~/modules/clinic-room/types/index.type'
import { formatFaDate, unwrapList } from '~/modules/admin/utils'

definePageMeta({ layout: 'admin', robots: false })

const can = (action: 'view' | 'create' | 'edit' | 'delete') =>
  adminModule.controller.can('clinic', action)
const { confirm: confirmDelete } = useAdminConfirm()

const items = ref<TClinicRoom[]>([])
const error = ref('')
const saving = ref(false)
const modal = ref(false)
const editing = ref<TClinicRoom | null>(null)
const form = reactive({
  eyebrow: '',
  title: '',
  description: '',
  image: '',
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
  const response = await adminModule.service.getAll<TClinicRoom[]>('/clinic-rooms', { all: 'true' })
  if (!response.success) {
    error.value = response.message
    return
  }
  items.value = unwrapList<TClinicRoom>(response.data).sort((a, b) => a.sort - b.sort)
}

function openCreate() {
  editing.value = null
  Object.assign(form, {
    eyebrow: '',
    title: '',
    description: '',
    image: '',
    sort: items.value.length ? Math.max(...items.value.map((entry) => entry.sort)) + 1 : 0,
    isActive: true,
  })
  modal.value = true
}

function openEdit(item: TClinicRoom) {
  editing.value = item
  Object.assign(form, {
    eyebrow: item.eyebrow ?? '',
    title: item.title ?? '',
    description: item.description ?? '',
    image: item.image ?? '',
    sort: item.sort,
    isActive: item.isActive,
  })
  modal.value = true
}

function payload() {
  return {
    eyebrow: form.eyebrow.trim(),
    title: form.title.trim(),
    description: form.description.trim(),
    image: form.image.trim(),
    sort: Number(form.sort) || 0,
    isActive: form.isActive,
  }
}

async function save() {
  saving.value = true
  error.value = ''
  const body = payload()
  const response = editing.value
    ? await adminModule.service.updateItem(`/clinic-rooms/${editing.value.id}`, body)
    : await adminModule.service.createItem('/clinic-rooms', body)
  saving.value = false
  if (!response.success) {
    error.value = response.message
    return
  }
  modal.value = false
  await load()
}

async function remove(item: TClinicRoom) {
  if (!(await confirmDelete(`فضای «${item.title}» حذف شود؟`))) return
  const response = await adminModule.service.deleteItem(`/clinic-rooms/${item.id}`)
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
      title="کلینیک ما"
      action-label="فضای جدید"
      :show-action="can('create')"
      @action="openCreate"
    />
    <p class="mb-4 text-sm leading-7 text-ink-muted">
      فضاهای صفحهٔ «کلینیک ما» را اینجا اضافه کنید: برچسب کوتاه، عنوان، توضیح و تصویر. ترتیب نمایش با عدد «ترتیب» کنترل می‌شود.
    </p>
    <p v-if="error" class="mb-3 text-sm text-red-600">{{ error }}</p>
    <div class="overflow-x-auto rounded-2xl border border-mist bg-white">
      <table class="w-full min-w-[720px] text-right text-sm">
        <thead class="bg-mist/60 text-ink-muted">
          <tr>
            <th class="p-3 font-medium">تصویر</th>
            <th class="p-3 font-medium">برچسب</th>
            <th class="p-3 font-medium">عنوان</th>
            <th class="p-3 font-medium">ترتیب</th>
            <th class="p-3 font-medium">وضعیت</th>
            <th class="p-3 font-medium">تاریخ</th>
            <th class="p-3 font-medium">عملیات</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in items" :key="item.id" class="border-t border-mist">
            <td class="p-3"><AdminThumb :src="item.image" :alt="item.title" /></td>
            <td class="p-3">{{ item.eyebrow }}</td>
            <td class="p-3">
              <p class="font-medium text-ink">{{ item.title }}</p>
              <p class="mt-1 max-w-sm line-clamp-2 text-xs text-ink-muted">{{ item.description }}</p>
            </td>
            <td class="p-3">{{ item.sort }}</td>
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
      <p v-if="!items.length" class="p-6 text-center text-ink-muted">هنوز فضایی ثبت نشده — با «فضای جدید» شروع کنید.</p>
    </div>

    <AdminModal :open="modal" :title="editing ? 'ویرایش فضای کلینیک' : 'فضای جدید کلینیک'" @close="modal = false">
      <form class="grid gap-3" @submit.prevent="save">
        <label class="text-sm">برچسب کوتاه (نوار کناری)
          <input v-model="form.eyebrow" required maxlength="120" placeholder="مثلاً پذیرش" class="mt-1 w-full rounded-xl border border-mist px-3 py-2">
        </label>
        <label class="text-sm">عنوان
          <input v-model="form.title" required maxlength="200" class="mt-1 w-full rounded-xl border border-mist px-3 py-2">
        </label>
        <label class="text-sm">توضیح
          <textarea v-model="form.description" rows="4" required class="mt-1 w-full rounded-xl border border-mist px-3 py-2" />
        </label>
        <AdminMediaField
          v-model="form.image"
          label="تصویر فضا"
          accept="image/jpeg,image/png,image/webp"
          required
        />
        <label class="text-sm">ترتیب
          <input v-model.number="form.sort" type="number" min="0" class="mt-1 w-full rounded-xl border border-mist px-3 py-2">
        </label>
        <AdminCheckbox v-model="form.isActive" label="فعال (نمایش در سایت)" />
        <button class="rounded-xl bg-green-deep py-2 text-ink disabled:opacity-60" :disabled="saving">ذخیره</button>
      </form>
    </AdminModal>
  </div>
</template>
