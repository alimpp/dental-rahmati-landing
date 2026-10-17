<script setup lang="ts">
import { adminModule } from '~/modules'
import type { TArticle, TArticlePage } from '~/modules/article/types/index.type'
import { formatFaDate, parseJsonOrThrow, prettyJson } from '~/modules/admin/utils'

definePageMeta({ layout: 'admin', robots: false })

const can = (action: 'view' | 'create' | 'edit' | 'delete') =>
  adminModule.controller.can('articles', action)
const { confirm: confirmDelete } = useAdminConfirm()

const items = ref<TArticle[]>([])
const error = ref('')
const saving = ref(false)
const modal = ref(false)
const editing = ref<TArticle | null>(null)
const form = reactive({
  title: '',
  slug: '',
  excerpt: '',
  category: '',
  author: '',
  coverImage: '',
  sections: '',
  seoTitle: '',
  seoDescription: '',
  seoKeywords: '',
  ogImage: '',
  readingMinutes: 5,
  publishedAt: '',
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
  const response = await adminModule.service.getAll<TArticlePage>('/articles', {
    all: 'true',
    limit: '50',
    page: '1',
  })
  if (!response.success || !response.data) {
    error.value = response.message
    return
  }
  items.value = response.data.items ?? []
}

function openCreate() {
  editing.value = null
  Object.assign(form, {
    title: '',
    slug: '',
    excerpt: '',
    category: '',
    author: '',
    coverImage: '',
    sections: '[]',
    seoTitle: '',
    seoDescription: '',
    seoKeywords: '',
    ogImage: '',
    readingMinutes: 5,
    publishedAt: new Date().toISOString().slice(0, 10),
    featured: false,
    sort: 0,
    isActive: true,
  })
  modal.value = true
}

function openEdit(item: TArticle) {
  editing.value = item
  Object.assign(form, {
    title: item.title,
    slug: item.slug,
    excerpt: item.excerpt,
    category: item.category,
    author: item.author,
    coverImage: item.coverImage,
    sections: prettyJson(item.sections ?? []),
    seoTitle: item.seoTitle ?? '',
    seoDescription: item.seoDescription ?? '',
    seoKeywords: item.seoKeywords ?? '',
    ogImage: item.ogImage ?? '',
    readingMinutes: item.readingMinutes,
    publishedAt: item.publishedAt ? item.publishedAt.slice(0, 10) : '',
    featured: item.featured,
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
    category: form.category,
    author: form.author,
    coverImage: form.coverImage,
    sections: parseJsonOrThrow(form.sections, 'بخش‌ها'),
    seoTitle: form.seoTitle || null,
    seoDescription: form.seoDescription || null,
    seoKeywords: form.seoKeywords || null,
    ogImage: form.ogImage || null,
    readingMinutes: Number(form.readingMinutes) || 5,
    publishedAt: form.publishedAt || null,
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
      ? await adminModule.service.updateItem(`/articles/${editing.value.id}`, body)
      : await adminModule.service.createItem('/articles', body)
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

async function remove(item: TArticle) {
  if (!(await confirmDelete(`مقاله «${item.title}» حذف شود؟`))) return
  const response = await adminModule.service.deleteItem(`/articles/${item.id}`)
  if (!response.success) {
    error.value = response.message
    return
  }
  await load()
}
</script>

<template>
  <div>
    <AdminHeader title="مقالات" action-label="مقاله جدید" :show-action="can('create')" @action="openCreate" />
    <p v-if="error" class="mb-3 text-sm text-red-600">{{ error }}</p>
    <div class="overflow-x-auto rounded-2xl border border-mist bg-white">
      <table class="w-full min-w-[720px] text-right text-sm">
        <thead class="bg-mist/60 text-ink-muted">
          <tr>
            <th class="p-3 font-medium">تصویر</th>
            <th class="p-3 font-medium">عنوان</th>
            <th class="p-3 font-medium">دسته</th>
            <th class="p-3 font-medium">وضعیت</th>
            <th class="p-3 font-medium">تاریخ</th>
            <th class="p-3 font-medium">عملیات</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in items" :key="item.id" class="border-t border-mist">
            <td class="p-3"><AdminThumb :src="item.coverImage" :alt="item.title" /></td>
            <td class="p-3">{{ item.title }}</td>
            <td class="p-3">{{ item.category }}</td>
            <td class="p-3"><AdminStatus :active="item.isActive" /></td>
            <td class="p-3">{{ formatFaDate(item.publishedAt || item.createdAt) }}</td>
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
    <AdminModal :open="modal" :title="editing ? 'ویرایش مقاله' : 'مقاله جدید'" @close="modal = false">
      <form class="grid gap-3" @submit.prevent="save">
        <label class="text-sm">عنوان<input v-model="form.title" required class="mt-1 w-full rounded-xl border border-mist px-3 py-2"></label>
        <label class="text-sm">اسلاگ<input v-model="form.slug" required class="mt-1 w-full rounded-xl border border-mist px-3 py-2"></label>
        <label class="text-sm">خلاصه<textarea v-model="form.excerpt" rows="3" required class="mt-1 w-full rounded-xl border border-mist px-3 py-2" /></label>
        <div class="grid gap-3 sm:grid-cols-2">
          <label class="text-sm">دسته<input v-model="form.category" required class="mt-1 w-full rounded-xl border border-mist px-3 py-2"></label>
          <label class="text-sm">نویسنده<input v-model="form.author" required class="mt-1 w-full rounded-xl border border-mist px-3 py-2"></label>
        </div>
        <AdminMediaField v-model="form.coverImage" label="کاور مقاله" required />
        <AdminMediaField v-model="form.ogImage" label="تصویر اشتراک‌گذاری (اختیاری)" />
        <label class="text-sm">بخش‌ها (JSON)<textarea v-model="form.sections" rows="6" class="mt-1 w-full rounded-xl border border-mist px-3 py-2 font-mono text-xs" /></label>
        <div class="grid gap-3 sm:grid-cols-2">
          <label class="text-sm">زمان مطالعه<input v-model.number="form.readingMinutes" type="number" class="mt-1 w-full rounded-xl border border-mist px-3 py-2"></label>
          <label class="text-sm">تاریخ انتشار<input v-model="form.publishedAt" type="date" class="mt-1 w-full rounded-xl border border-mist px-3 py-2"></label>
        </div>
        <AdminCheckbox v-model="form.featured" label="ویژه" />
        <AdminCheckbox v-model="form.isActive" label="فعال" />
        <button class="rounded-xl bg-green-deep py-2 text-ink" :disabled="saving">ذخیره</button>
      </form>
    </AdminModal>
  </div>
</template>
