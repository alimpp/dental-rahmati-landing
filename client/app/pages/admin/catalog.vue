<script setup lang="ts">
import { adminModule } from '~/modules'
import type { TCatalogGalleryImage, TCatalogItem, TCatalogPdf } from '~/modules/catalog/types/index.type'
import { formatFaDate, parseJsonOrThrow, prettyJson, unwrapList } from '~/modules/admin/utils'

definePageMeta({ layout: 'admin', robots: false })

const can = (action: 'view' | 'create' | 'edit' | 'delete') =>
  adminModule.controller.can('catalog', action)
const { confirm: confirmDelete } = useAdminConfirm()

const items = ref<TCatalogItem[]>([])
const error = ref('')
const saving = ref(false)
const modal = ref(false)
const editing = ref<TCatalogItem | null>(null)
const form = reactive({
  title: '',
  slug: '',
  excerpt: '',
  coverImage: '',
  paragraphs: '',
  highlights: '',
  gallery: [] as TCatalogGalleryImage[],
  pdfs: [] as TCatalogPdf[],
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
  const response = await adminModule.service.getAll<TCatalogItem[]>('/catalog', { all: 'true' })
  if (!response.success) {
    error.value = response.message
    return
  }
  items.value = unwrapList<TCatalogItem>(response.data)
}

function openCreate() {
  editing.value = null
  Object.assign(form, {
    title: '',
    slug: '',
    excerpt: '',
    coverImage: '',
    paragraphs: '[]',
    highlights: '[]',
    gallery: [] as TCatalogGalleryImage[],
    pdfs: [] as TCatalogPdf[],
    sort: 0,
    isActive: true,
  })
  modal.value = true
}

function openEdit(item: TCatalogItem) {
  editing.value = item
  Object.assign(form, {
    title: item.title,
    slug: item.slug,
    excerpt: item.excerpt,
    coverImage: item.coverImage,
    paragraphs: prettyJson(item.paragraphs ?? []),
    highlights: prettyJson(item.highlights ?? []),
    gallery: (item.gallery ?? []).map((image) => ({
      url: image.url,
      caption: image.caption || '',
    })),
    pdfs: (item.pdfs ?? []).map((file) => ({ title: file.title, url: file.url })),
    sort: item.sort,
    isActive: item.isActive,
  })
  modal.value = true
}

function payload() {
  return {
    title: form.title,
    slug: form.slug,
    excerpt: form.excerpt,
    coverImage: form.coverImage,
    paragraphs: parseJsonOrThrow(form.paragraphs, 'پاراگراف‌ها'),
    highlights: parseJsonOrThrow(form.highlights, 'نکات کلیدی'),
    gallery: form.gallery.filter((image) => image.url),
    pdfs: form.pdfs.filter((file) => file.title && file.url),
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
      ? await adminModule.service.updateItem(`/catalog/${editing.value.id}`, body)
      : await adminModule.service.createItem('/catalog', body)
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

async function remove(item: TCatalogItem) {
  if (!(await confirmDelete(`کاتالوگ «${item.title}» حذف شود؟`))) return
  const response = await adminModule.service.deleteItem(`/catalog/${item.id}`)
  if (!response.success) {
    error.value = response.message
    return
  }
  await load()
}
</script>

<template>
  <div>
    <AdminHeader title="کاتالوگ" action-label="آیتم جدید" :show-action="can('create')" @action="openCreate" />
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
            <td class="p-3"><AdminThumb :src="item.coverImage" :alt="item.title" /></td>
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
    <AdminModal :open="modal" :title="editing ? 'ویرایش کاتالوگ' : 'آیتم جدید'" @close="modal = false">
      <form class="grid gap-3" @submit.prevent="save">
        <label class="text-sm">عنوان<input v-model="form.title" required class="mt-1 w-full rounded-xl border border-mist px-3 py-2"></label>
        <label class="text-sm">اسلاگ<input v-model="form.slug" required class="mt-1 w-full rounded-xl border border-mist px-3 py-2"></label>
        <label class="text-sm">خلاصه<textarea v-model="form.excerpt" rows="3" required class="mt-1 w-full rounded-xl border border-mist px-3 py-2" /></label>
        <AdminMediaField v-model="form.coverImage" label="کاور" required />
        <label class="text-sm">پاراگراف‌ها (JSON آرایه)<textarea v-model="form.paragraphs" rows="6" class="mt-1 w-full rounded-xl border border-mist px-3 py-2 font-mono text-xs" /></label>
        <label class="text-sm">نکات کلیدی (JSON آرایه)<textarea v-model="form.highlights" rows="4" class="mt-1 w-full rounded-xl border border-mist px-3 py-2 font-mono text-xs" /></label>
        <div class="rounded-2xl border border-mist p-3">
          <div class="mb-3 flex items-center justify-between">
            <p class="text-sm font-medium">گالری تصاویر</p>
            <button
              class="inline-flex items-center gap-1 rounded-lg bg-green-soft px-3 py-1.5 text-xs font-semibold text-green-deep"
              type="button"
              @click="form.gallery.push({ url: '', caption: '' })"
            >
              <AdminIcon src="/icons/admin-plus.svg" size="size-4" />
              افزودن تصویر
            </button>
          </div>
          <div v-if="!form.gallery.length" class="text-xs text-ink-muted">هنوز تصویری اضافه نشده</div>
          <div v-for="(image, index) in form.gallery" :key="index" class="mb-3 grid gap-2 rounded-xl bg-[#f7faf8] p-3 last:mb-0">
            <AdminMediaField v-model="image.url" label="تصویر گالری" />
            <label class="text-sm">عنوان تصویر<input v-model="image.caption" class="mt-1 w-full rounded-xl border border-mist px-3 py-2"></label>
            <button class="justify-self-start text-xs text-red-600" type="button" @click="form.gallery.splice(index, 1)">حذف این تصویر</button>
          </div>
        </div>
        <div class="rounded-2xl border border-mist p-3">
          <div class="mb-3 flex items-center justify-between">
            <p class="text-sm font-medium">فایل‌های PDF</p>
            <button
              class="inline-flex items-center gap-1 rounded-lg bg-green-soft px-3 py-1.5 text-xs font-semibold text-green-deep"
              type="button"
              @click="form.pdfs.push({ title: '', url: '' })"
            >
              <AdminIcon src="/icons/admin-plus.svg" size="size-4" />
              افزودن فایل
            </button>
          </div>
          <div v-if="!form.pdfs.length" class="text-xs text-ink-muted">هنوز فایلی اضافه نشده</div>
          <div v-for="(file, index) in form.pdfs" :key="index" class="mb-3 grid gap-2 rounded-xl bg-[#f7faf8] p-3 last:mb-0">
            <label class="text-sm">عنوان فایل<input v-model="file.title" class="mt-1 w-full rounded-xl border border-mist px-3 py-2"></label>
            <AdminMediaField v-model="file.url" label="فایل PDF" kind="file" accept="application/pdf" />
            <button class="justify-self-start text-xs text-red-600" type="button" @click="form.pdfs.splice(index, 1)">حذف این فایل</button>
          </div>
        </div>
        <AdminCheckbox v-model="form.isActive" label="فعال" />
        <button class="rounded-xl bg-green-deep py-2 text-ink" :disabled="saving">ذخیره</button>
      </form>
    </AdminModal>
  </div>
</template>
