<script setup lang="ts">
import { adminModule } from '~/modules'
import type { TPortfolioGalleryImage, TPortfolioItem } from '~/modules/portfolio/types/index.type'
import { formatFaDate, unwrapList } from '~/modules/admin/utils'

definePageMeta({ layout: 'admin', robots: false })

const can = (action: 'view' | 'create' | 'edit' | 'delete') =>
  adminModule.controller.can('portfolio', action)
const { confirm: confirmDelete } = useAdminConfirm()

const items = ref<TPortfolioItem[]>([])
const error = ref('')
const saving = ref(false)
const modal = ref(false)
const editing = ref<TPortfolioItem | null>(null)
const form = reactive({
  title: '',
  slug: '',
  treatment: '',
  patientAlias: '',
  description: '',
  coverImage: '',
  beforeImage: '',
  afterImage: '',
  gallery: [] as TPortfolioGalleryImage[],
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
  const response = await adminModule.service.getAll<TPortfolioItem[]>('/portfolio', { all: 'true' })
  if (!response.success) {
    error.value = response.message
    return
  }
  items.value = unwrapList<TPortfolioItem>(response.data)
}

function openCreate() {
  editing.value = null
  Object.assign(form, {
    title: '',
    slug: '',
    treatment: '',
    patientAlias: '',
    description: '',
    coverImage: '',
    beforeImage: '',
    afterImage: '',
    gallery: [] as TPortfolioGalleryImage[],
    sort: 0,
    isActive: true,
  })
  modal.value = true
}

function openEdit(item: TPortfolioItem) {
  editing.value = item
  Object.assign(form, {
    title: item.title,
    slug: item.slug,
    treatment: item.treatment || '',
    patientAlias: item.patientAlias || '',
    description: item.description,
    coverImage: item.coverImage || '',
    beforeImage: item.beforeImage || '',
    afterImage: item.afterImage || '',
    gallery: (item.gallery ?? []).map((image) => ({
      url: image.url,
      caption: image.caption || '',
    })),
    sort: item.sort,
    isActive: item.isActive,
  })
  modal.value = true
}

function payload() {
  return {
    title: form.title,
    slug: form.slug,
    treatment: form.treatment,
    patientAlias: form.patientAlias || null,
    description: form.description,
    coverImage: form.coverImage || form.afterImage || null,
    beforeImage: form.beforeImage || null,
    afterImage: form.afterImage || null,
    gallery: form.gallery.filter((image) => image.url),
    sort: Number(form.sort) || 0,
    isActive: form.isActive,
  }
}

async function save() {
  saving.value = true
  error.value = ''
  try {
    const body = payload()
    if (!body.beforeImage || !body.afterImage) {
      error.value = 'عکس قبل و بعد درمان الزامی است'
      saving.value = false
      return
    }
    if (!body.gallery.length) {
      body.gallery = [
        { url: body.beforeImage, caption: 'قبل از درمان' },
        { url: body.afterImage, caption: 'بعد از درمان' },
      ]
    }
    const response = editing.value
      ? await adminModule.service.updateItem(`/portfolio/${editing.value.id}`, body)
      : await adminModule.service.createItem('/portfolio', body)
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

async function remove(item: TPortfolioItem) {
  if (!(await confirmDelete(`کیس «${item.title}» حذف شود؟`))) return
  const response = await adminModule.service.deleteItem(`/portfolio/${item.id}`)
  if (!response.success) {
    error.value = response.message
    return
  }
  await load()
}
</script>

<template>
  <div>
    <AdminHeader title="نمونه کارها (کیس بیماران)" action-label="کیس جدید" :show-action="can('create')" @action="openCreate" />
    <p class="mb-3 text-sm text-ink-muted">
      عکس واقعی دندان/لبخند بیماران + توضیح درمان. نام کامل بیمار را وارد نکنید؛ از نام مستعار استفاده کنید.
    </p>
    <p v-if="error" class="mb-3 text-sm text-red-600">{{ error }}</p>
    <div class="overflow-x-auto rounded-2xl border border-mist bg-white">
      <table class="w-full min-w-[720px] text-right text-sm">
        <thead class="bg-mist/60 text-ink-muted">
          <tr>
            <th class="p-3 font-medium">بعد</th>
            <th class="p-3 font-medium">عنوان</th>
            <th class="p-3 font-medium">خدمت</th>
            <th class="p-3 font-medium">بیمار</th>
            <th class="p-3 font-medium">وضعیت</th>
            <th class="p-3 font-medium">تاریخ</th>
            <th class="p-3 font-medium">عملیات</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in items" :key="item.id" class="border-t border-mist">
            <td class="p-3">
              <AdminThumb :src="item.afterImage || item.coverImage || item.gallery?.[0]?.url" :alt="item.title" />
            </td>
            <td class="p-3">{{ item.title }}</td>
            <td class="p-3">{{ item.treatment }}</td>
            <td class="p-3">{{ item.patientAlias || '—' }}</td>
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
    <AdminModal :open="modal" :title="editing ? 'ویرایش کیس' : 'کیس جدید بیمار'" @close="modal = false">
      <form class="grid gap-3" @submit.prevent="save">
        <label class="text-sm">عنوان کیس<input v-model="form.title" required class="mt-1 w-full rounded-xl border border-mist px-3 py-2" placeholder="مثلاً لبخند یکدست با لمینت"></label>
        <label class="text-sm">اسلاگ<input v-model="form.slug" required class="mt-1 w-full rounded-xl border border-mist px-3 py-2"></label>
        <label class="text-sm">نوع خدمت<input v-model="form.treatment" required class="mt-1 w-full rounded-xl border border-mist px-3 py-2" placeholder="لمینت، ایمپلنت، ارتودنسی، ..."></label>
        <label class="text-sm">نام مستعار بیمار<input v-model="form.patientAlias" class="mt-1 w-full rounded-xl border border-mist px-3 py-2" placeholder="خانم م. / آقای ر."></label>
        <label class="text-sm">توضیح درمان<textarea v-model="form.description" rows="4" required class="mt-1 w-full rounded-xl border border-mist px-3 py-2" placeholder="شکایت بیمار، مسیر درمان، نتیجه..." /></label>
        <AdminMediaField v-model="form.beforeImage" label="عکس قبل از درمان" required />
        <AdminMediaField v-model="form.afterImage" label="عکس بعد از درمان" required />
        <AdminMediaField v-model="form.coverImage" label="کاور (اختیاری — پیش‌فرض: بعد)" />
        <label class="text-sm">ترتیب<input v-model.number="form.sort" type="number" class="mt-1 w-full rounded-xl border border-mist px-3 py-2"></label>
        <div class="rounded-2xl border border-mist p-3">
          <div class="mb-3 flex items-center justify-between">
            <p class="text-sm font-medium">گالری جزئیات (اختیاری)</p>
            <button
              class="inline-flex items-center gap-1 rounded-lg bg-green-soft px-3 py-1.5 text-xs font-semibold text-green-deep"
              type="button"
              @click="form.gallery.push({ url: '', caption: '' })"
            >
              <AdminIcon src="/icons/admin-plus.svg" size="size-4" />
              افزودن تصویر
            </button>
          </div>
          <div v-if="!form.gallery.length" class="text-xs text-ink-muted">اگر خالی باشد، قبل/بعد به‌عنوان گالری ذخیره می‌شود</div>
          <div v-for="(image, index) in form.gallery" :key="index" class="mb-3 grid gap-2 rounded-xl bg-[#f7faf8] p-3 last:mb-0">
            <AdminMediaField v-model="image.url" label="تصویر" />
            <label class="text-sm">عنوان<input v-model="image.caption" class="mt-1 w-full rounded-xl border border-mist px-3 py-2"></label>
            <button class="justify-self-start text-xs text-red-600" type="button" @click="form.gallery.splice(index, 1)">حذف</button>
          </div>
        </div>
        <AdminCheckbox v-model="form.isActive" label="فعال" />
        <button class="rounded-xl bg-green-deep py-2 text-ink" :disabled="saving">ذخیره</button>
      </form>
    </AdminModal>
  </div>
</template>
