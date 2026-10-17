<script setup lang="ts">
import { adminModule } from '~/modules'
import type { TGuide } from '~/modules/guide/types/index.type'
import { unwrapList } from '~/modules/admin/utils'

definePageMeta({ layout: 'admin', robots: false })

const can = (action: 'view' | 'create' | 'edit' | 'delete') =>
  adminModule.controller.can('guides', action)
const { confirm: confirmDelete } = useAdminConfirm()

const items = ref<TGuide[]>([])
const error = ref('')
const saving = ref(false)
const modal = ref(false)
const editing = ref<TGuide | null>(null)
const form = reactive({
  title: '',
  slug: '',
  excerpt: '',
  category: '',
  coverImage: '',
  paragraphsText: '',
  takeawaysText: '',
  featured: false,
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
  const response = await adminModule.service.getAll<TGuide[]>('/guides', { all: 'true' })
  if (!response.success) {
    error.value = response.message
    return
  }
  items.value = unwrapList<TGuide>(response.data)
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

function openCreate() {
  editing.value = null
  Object.assign(form, {
    title: '',
    slug: '',
    excerpt: '',
    category: '',
    coverImage: '',
    paragraphsText: '',
    takeawaysText: '',
    featured: false,
    sort: items.value.length ? Math.max(...items.value.map((entry) => entry.sort)) + 1 : 0,
    isActive: true,
  })
  modal.value = true
}

function openEdit(item: TGuide) {
  editing.value = item
  Object.assign(form, {
    title: item.title ?? '',
    slug: item.slug ?? '',
    excerpt: item.excerpt ?? '',
    category: item.category ?? '',
    coverImage: item.coverImage ?? '',
    paragraphsText: (item.paragraphs ?? []).join('\n\n'),
    takeawaysText: (item.takeaways ?? []).join('\n'),
    featured: item.featured,
    sort: item.sort,
    isActive: item.isActive,
  })
  modal.value = true
}

function payload() {
  return {
    title: form.title,
    slug: form.slug || slugify(form.title),
    excerpt: form.excerpt,
    category: form.category || null,
    coverImage: form.coverImage,
    paragraphs: form.paragraphsText
      .split(/\n\s*\n/)
      .map((part) => part.trim())
      .filter(Boolean),
    takeaways: form.takeawaysText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean),
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
      ? await adminModule.service.updateItem(`/guides/${editing.value.id}`, body)
      : await adminModule.service.createItem('/guides', body)
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

async function remove(item: TGuide) {
  if (!(await confirmDelete(`راهنما «${item.title}» حذف شود؟`))) return
  const response = await adminModule.service.deleteItem(`/guides/${item.id}`)
  if (!response.success) {
    error.value = response.message
    return
  }
  await load()
}
</script>

<template>
  <div>
    <AdminHeader title="راهنماها" action-label="راهنمای جدید" :show-action="can('create')" @action="openCreate" />
    <p v-if="error" class="mb-3 text-sm text-red-600">{{ error }}</p>
    <div class="overflow-x-auto rounded-2xl border border-mist bg-white">
      <table class="w-full min-w-[760px] text-right text-sm">
        <thead class="bg-mist/60 text-ink-muted">
          <tr>
            <th class="p-3 font-medium">تصویر</th>
            <th class="p-3 font-medium">عنوان</th>
            <th class="p-3 font-medium">دسته</th>
            <th class="p-3 font-medium">ترتیب</th>
            <th class="p-3 font-medium">وضعیت</th>
            <th class="p-3 font-medium">عملیات</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in items" :key="item.id" class="border-t border-mist">
            <td class="p-3"><AdminThumb :src="item.coverImage" /></td>
            <td class="p-3">
              <p class="font-medium">{{ item.title }}</p>
              <p class="mt-0.5 text-[11px] text-ink-muted">/guides/{{ item.slug }}</p>
            </td>
            <td class="p-3">{{ item.category || '—' }}</td>
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

    <AdminModal :open="modal" :title="editing ? 'ویرایش راهنما' : 'راهنمای جدید'" @close="modal = false">
      <form class="grid gap-3" @submit.prevent="save">
        <label class="text-sm">عنوان<input v-model="form.title" required class="mt-1 w-full rounded-xl border border-mist px-3 py-2"></label>
        <label class="text-sm">اسلاگ<input v-model="form.slug" required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" class="mt-1 w-full rounded-xl border border-mist px-3 py-2" dir="ltr"></label>
        <label class="text-sm">دسته<input v-model="form.category" class="mt-1 w-full rounded-xl border border-mist px-3 py-2"></label>
        <label class="text-sm">خلاصه<textarea v-model="form.excerpt" rows="2" required class="mt-1 w-full rounded-xl border border-mist px-3 py-2" /></label>
        <label class="text-sm">متن راهنما (پاراگراف‌ها با خط خالی جدا شوند)<textarea v-model="form.paragraphsText" rows="8" required class="mt-1 w-full rounded-xl border border-mist px-3 py-2" /></label>
        <label class="text-sm">نکات کلیدی (هر خط یک مورد)<textarea v-model="form.takeawaysText" rows="3" class="mt-1 w-full rounded-xl border border-mist px-3 py-2" /></label>
        <AdminMediaField v-model="form.coverImage" label="تصویر کاور" />
        <label class="text-sm">ترتیب<input v-model.number="form.sort" type="number" class="mt-1 w-full rounded-xl border border-mist px-3 py-2"></label>
        <AdminCheckbox v-model="form.featured" label="ویژه در صفحه اصلی" />
        <AdminCheckbox v-model="form.isActive" label="فعال" />
        <button class="rounded-xl bg-green-deep py-2 text-ink" :disabled="saving">ذخیره</button>
      </form>
    </AdminModal>
  </div>
</template>
