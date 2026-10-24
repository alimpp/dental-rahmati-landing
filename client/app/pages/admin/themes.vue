<script setup lang="ts">
import { adminModule } from '~/modules'
import { unwrapList } from '~/modules/admin/utils'
import {
  EMPTY_THEME_COLORS,
  THEME_COLOR_KEYS,
  THEME_COLOR_LABELS,
  type TTheme,
  type TThemeColors,
} from '~/modules/theme/types/index.type'
import { applyThemeCss } from '~/modules/theme/utils/apply-theme'
import { useSiteTheme } from '~/composables/useSiteTheme'

definePageMeta({ layout: 'admin', robots: false })

const can = (action: 'view' | 'create' | 'edit' | 'delete') =>
  adminModule.controller.can('themes', action)
const { confirm: confirmDelete } = useAdminConfirm()
const { selectTheme } = useSiteTheme()

const items = ref<TTheme[]>([])
const error = ref('')
const saving = ref(false)
const modal = ref(false)
const editing = ref<TTheme | null>(null)
const form = reactive({
  name: '',
  slug: '',
  description: '',
  sort: 0,
  isActive: true,
  isDefault: false,
  colors: { ...EMPTY_THEME_COLORS } as TThemeColors,
})

onMounted(async () => {
  if (!can('view')) {
    await navigateTo('/admin')
    return
  }
  await load()
})

async function load() {
  const response = await adminModule.service.getAll<TTheme[]>('/themes', { all: 'true' })
  if (!response.success) {
    error.value = response.message
    return
  }
  items.value = unwrapList<TTheme>(response.data)
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-_]/g, '')
}

function openCreate() {
  editing.value = null
  Object.assign(form, {
    name: '',
    slug: '',
    description: '',
    sort: items.value.length ? Math.max(...items.value.map(i => i.sort)) + 1 : 0,
    isActive: true,
    isDefault: false,
    colors: { ...EMPTY_THEME_COLORS },
  })
  modal.value = true
}

function openEdit(item: TTheme) {
  editing.value = item
  Object.assign(form, {
    name: item.name,
    slug: item.slug,
    description: item.description ?? '',
    sort: item.sort,
    isActive: item.isActive,
    isDefault: item.isDefault,
    colors: { ...item.colors },
  })
  modal.value = true
}

watch(
  () => form.name,
  (name) => {
    if (!editing.value && name) form.slug = slugify(name) || form.slug
  },
)

function payload() {
  return {
    name: form.name.trim(),
    slug: form.slug.trim(),
    description: form.description.trim() || null,
    sort: Number(form.sort) || 0,
    isActive: form.isActive,
    isDefault: form.isDefault,
    colors: { ...form.colors },
  }
}

async function save() {
  saving.value = true
  error.value = ''
  try {
    const body = payload()
    const response = editing.value
      ? await adminModule.service.updateItem(`/themes/${editing.value.id}`, body)
      : await adminModule.service.createItem('/themes', body)
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

async function remove(item: TTheme) {
  if (item.isDefault) {
    error.value = 'تم پیش‌فرض قابل حذف نیست'
    return
  }
  if (!(await confirmDelete(`تم «${item.name}» حذف شود؟`))) return
  const response = await adminModule.service.deleteItem(`/themes/${item.id}`)
  if (!response.success) {
    error.value = response.message
    return
  }
  await load()
}

function preview(item: TTheme) {
  selectTheme(item)
  applyThemeCss(item)
}
</script>

<template>
  <div>
    <AdminHeader title="تم‌ها" action-label="تم جدید" :show-action="can('create')" @action="openCreate" />
    <p v-if="error" class="mb-3 text-sm text-red-600">
      {{ error }}
    </p>
    <div class="overflow-x-auto rounded-2xl border border-mist bg-white">
      <table class="w-full min-w-[720px] text-right text-sm">
        <thead class="bg-mist/60 text-ink-muted">
          <tr>
            <th class="p-3 font-medium">
              پیش‌نمایش
            </th>
            <th class="p-3 font-medium">
              نام
            </th>
            <th class="p-3 font-medium">
              اسلاگ
            </th>
            <th class="p-3 font-medium">
              ترتیب
            </th>
            <th class="p-3 font-medium">
              وضعیت
            </th>
            <th class="p-3 font-medium">
              عملیات
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in items" :key="item.id" class="border-t border-mist">
            <td class="p-3">
              <span class="inline-flex gap-1">
                <span class="size-5 rounded-full border" :style="{ background: item.colors.primary }" />
                <span class="size-5 rounded-full border" :style="{ background: item.colors.accent }" />
                <span class="size-5 rounded-full border" :style="{ background: item.colors.surface }" />
              </span>
            </td>
            <td class="p-3 font-medium">
              {{ item.name }}
              <span v-if="item.isDefault" class="ms-2 text-[10px] text-gold">پیش‌فرض</span>
            </td>
            <td class="p-3 font-mono text-xs text-ink-muted">
              {{ item.slug }}
            </td>
            <td class="p-3">
              {{ item.sort }}
            </td>
            <td class="p-3">
              <AdminStatus :active="item.isActive" />
            </td>
            <td class="p-3">
              <div class="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  class="rounded-lg border border-mist px-2 py-1 text-xs hover:border-green-deep"
                  @click="preview(item)"
                >
                  اعمال
                </button>
                <AdminRowActions
                  :can-edit="can('edit')"
                  :can-delete="can('delete') && !item.isDefault"
                  @edit="openEdit(item)"
                  @delete="remove(item)"
                />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-if="!items.length" class="p-6 text-center text-ink-muted">
        موردی نیست
      </p>
    </div>

    <AdminModal :open="modal" :title="editing ? 'ویرایش تم' : 'تم جدید'" @close="modal = false">
      <form class="grid gap-3" @submit.prevent="save">
        <label class="text-sm">نام<input v-model="form.name" required class="mt-1 w-full rounded-xl border border-mist px-3 py-2"></label>
        <label class="text-sm">اسلاگ<input v-model="form.slug" required class="mt-1 w-full rounded-xl border border-mist px-3 py-2 font-mono text-xs"></label>
        <label class="text-sm">توضیح<textarea v-model="form.description" rows="2" class="mt-1 w-full rounded-xl border border-mist px-3 py-2" /></label>
        <label class="text-sm">ترتیب<input v-model.number="form.sort" type="number" class="mt-1 w-full rounded-xl border border-mist px-3 py-2"></label>
        <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <label v-for="key in THEME_COLOR_KEYS" :key="key" class="text-xs">
            {{ THEME_COLOR_LABELS[key] }}
            <input
              v-model="form.colors[key]"
              type="color"
              class="mt-1 h-10 w-full cursor-pointer rounded-lg border border-mist bg-white p-1"
            >
          </label>
        </div>
        <AdminCheckbox v-model="form.isActive" label="فعال" />
        <AdminCheckbox v-model="form.isDefault" label="پیش‌فرض سایت" />
        <button class="rounded-xl bg-green-deep py-2 text-white" :disabled="saving">
          ذخیره
        </button>
      </form>
    </AdminModal>
  </div>
</template>
