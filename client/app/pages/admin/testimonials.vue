<script setup lang="ts">
import { adminModule } from '~/modules'
import type { TTestimonial } from '~/modules/testimonial/types/index.type'
import { unwrapList } from '~/modules/admin/utils'

definePageMeta({ layout: 'admin', robots: false })

const can = (action: 'view' | 'create' | 'edit' | 'delete') =>
  adminModule.controller.can('testimonials', action)
const { confirm: confirmDelete } = useAdminConfirm()

const items = ref<TTestimonial[]>([])
const error = ref('')
const saving = ref(false)
const modal = ref(false)
const editing = ref<TTestimonial | null>(null)
const form = reactive({
  clientName: '',
  roleOrCompany: '',
  quote: '',
  avatarUrl: '',
  rating: 5 as number | null,
  featured: true,
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
  const response = await adminModule.service.getAll<TTestimonial[]>('/testimonials', { all: 'true' })
  if (!response.success) {
    error.value = response.message
    return
  }
  items.value = unwrapList<TTestimonial>(response.data)
}

function openCreate() {
  editing.value = null
  Object.assign(form, {
    clientName: '',
    roleOrCompany: '',
    quote: '',
    avatarUrl: '',
    rating: 5,
    featured: true,
    sort: items.value.length ? Math.max(...items.value.map((entry) => entry.sort)) + 1 : 0,
    isActive: true,
  })
  modal.value = true
}

function openEdit(item: TTestimonial) {
  editing.value = item
  Object.assign(form, {
    clientName: item.clientName ?? '',
    roleOrCompany: item.roleOrCompany ?? '',
    quote: item.quote ?? '',
    avatarUrl: item.avatarUrl ?? '',
    rating: item.rating ?? 5,
    featured: item.featured !== false,
    sort: item.sort,
    isActive: item.isActive,
  })
  modal.value = true
}

function payload() {
  return {
    clientName: form.clientName,
    roleOrCompany: form.roleOrCompany || null,
    quote: form.quote,
    avatarUrl: form.avatarUrl || null,
    rating: form.rating ? Number(form.rating) : null,
    featured: form.featured,
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
      ? await adminModule.service.updateItem(`/testimonials/${editing.value.id}`, body)
      : await adminModule.service.createItem('/testimonials', body)
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

async function remove(item: TTestimonial) {
  if (!(await confirmDelete(`نظر «${item.clientName}» حذف شود؟`))) return
  const response = await adminModule.service.deleteItem(`/testimonials/${item.id}`)
  if (!response.success) {
    error.value = response.message
    return
  }
  await load()
}
</script>

<template>
  <div>
    <AdminHeader title="نظرات بیماران" action-label="نظر جدید" :show-action="can('create')" @action="openCreate" />
    <p v-if="error" class="mb-3 text-sm text-red-600">{{ error }}</p>
    <div class="overflow-x-auto rounded-2xl border border-mist bg-white">
      <table class="w-full min-w-[640px] text-right text-sm">
        <thead class="bg-mist/60 text-ink-muted">
          <tr>
            <th class="p-3 font-medium">نام</th>
            <th class="p-3 font-medium">سمت</th>
            <th class="p-3 font-medium">نظر</th>
            <th class="p-3 font-medium">ویژه</th>
            <th class="p-3 font-medium">ترتیب</th>
            <th class="p-3 font-medium">وضعیت</th>
            <th class="p-3 font-medium">عملیات</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in items" :key="item.id" class="border-t border-mist">
            <td class="p-3">{{ item.clientName ?? '—' }}</td>
            <td class="p-3">{{ item.roleOrCompany ?? '—' }}</td>
            <td class="p-3 max-w-xs"><span class="line-clamp-2">{{ item.quote }}</span></td>
            <td class="p-3">{{ item.featured ? 'بله' : 'خیر' }}</td>
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
    <AdminModal :open="modal" :title="editing ? 'ویرایش نظر' : 'نظر جدید'" @close="modal = false">
      <form class="grid gap-3" @submit.prevent="save">
        <label class="text-sm">نام بیمار<input v-model="form.clientName" required class="mt-1 w-full rounded-xl border border-mist px-3 py-2"></label>
        <label class="text-sm">سمت / شرکت<input v-model="form.roleOrCompany" class="mt-1 w-full rounded-xl border border-mist px-3 py-2"></label>
        <label class="text-sm">متن نظر<textarea v-model="form.quote" rows="4" required class="mt-1 w-full rounded-xl border border-mist px-3 py-2" /></label>
        <AdminMediaField v-model="form.avatarUrl" label="تصویر" />
        <label class="text-sm">امتیاز (۱ تا ۵)<input v-model.number="form.rating" type="number" min="1" max="5" class="mt-1 w-full rounded-xl border border-mist px-3 py-2"></label>
        <label class="text-sm">ترتیب<input v-model.number="form.sort" type="number" class="mt-1 w-full rounded-xl border border-mist px-3 py-2"></label>
        <AdminCheckbox v-model="form.featured" label="نمایش در صفحه اصلی" />
        <AdminCheckbox v-model="form.isActive" label="فعال" />
        <button class="rounded-xl bg-green-deep py-2 text-ink" :disabled="saving">ذخیره</button>
      </form>
    </AdminModal>
  </div>
</template>
