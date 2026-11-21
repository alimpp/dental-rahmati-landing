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
const togglingId = ref<string | null>(null)
const modal = ref(false)
const editing = ref<TTestimonial | null>(null)
const form = reactive({
  firstName: '',
  lastName: '',
  roleOrCompany: '',
  quote: '',
  avatarUrl: '',
  rating: 5 as number | null,
  featured: true,
  sort: 0,
  isActive: true,
})

function splitClientName(full: string) {
  const parts = full.trim().split(/\s+/).filter(Boolean)
  return {
    firstName: parts[0] || '',
    lastName: parts.slice(1).join(' '),
  }
}

const pendingCount = computed(() => items.value.filter((item) => !item.isActive).length)

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
    firstName: '',
    lastName: '',
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
  const { firstName, lastName } = splitClientName(item.clientName ?? '')
  Object.assign(form, {
    firstName,
    lastName,
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
  const clientName = [form.firstName.trim(), form.lastName.trim()].filter(Boolean).join(' ')
  return {
    clientName,
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

async function approve(item: TTestimonial) {
  if (!can('edit')) return
  togglingId.value = item.id
  const response = await adminModule.service.updateItem(`/testimonials/${item.id}`, {
    isActive: true,
    featured: true,
  })
  togglingId.value = null
  if (!response.success) {
    error.value = response.message
    return
  }
  await load()
}

async function toggleActive(item: TTestimonial) {
  if (!can('edit')) return
  if (!item.isActive) {
    await approve(item)
    return
  }
  togglingId.value = item.id
  error.value = ''
  const response = await adminModule.service.updateItem(`/testimonials/${item.id}`, {
    isActive: false,
  })
  togglingId.value = null
  if (!response.success) {
    error.value = response.message
    return
  }
  await load()
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
  <div class="min-w-0">
    <AdminHeader title="نظرات بیماران" action-label="نظر جدید" :show-action="can('create')" @action="openCreate" />
    <p v-if="pendingCount" class="mb-3 rounded-xl bg-gold/15 px-3 py-2 text-sm text-ink">
      {{ pendingCount }} نظر در انتظار تایید — روی وضعیت یا دکمه «تایید» بزنید.
    </p>
    <p v-if="error" class="mb-3 text-sm text-red-600">{{ error }}</p>
    <AdminListPanel :count="items.length">
      <template #table>
        <table class="w-full text-right text-sm">
          <thead class="bg-mist/60 text-ink-muted">
            <tr>
              <th class="p-3 font-medium">نام</th>
              <th class="p-3 font-medium">امتیاز</th>
              <th class="p-3 font-medium">نظر</th>
              <th class="p-3 font-medium">ویژه</th>
              <th class="p-3 font-medium">وضعیت</th>
              <th class="p-3 font-medium">عملیات</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in items" :key="item.id" class="border-t border-mist">
              <td class="p-3">
                <p>{{ item.clientName ?? '—' }}</p>
                <p v-if="item.roleOrCompany" class="mt-0.5 text-xs text-ink-muted">
                  {{ item.roleOrCompany }}
                </p>
              </td>
              <td class="p-3 whitespace-nowrap">
                {{ item.rating ? `${item.rating} / ۵` : '—' }}
              </td>
              <td class="p-3 max-w-xs">
                <span class="line-clamp-2">{{ item.quote }}</span>
              </td>
              <td class="p-3">{{ item.featured ? 'بله' : 'خیر' }}</td>
              <td class="p-3">
                <AdminStatus
                  :active="item.isActive"
                  :clickable="can('edit')"
                  :busy="togglingId === item.id"
                  @toggle="toggleActive(item)"
                />
              </td>
              <td class="p-3">
                <div class="flex flex-wrap items-center gap-2">
                  <button
                    v-if="!item.isActive && can('edit')"
                    type="button"
                    class="rounded-lg bg-green-deep px-2.5 py-1.5 text-xs font-semibold text-on-primary"
                    @click="approve(item)"
                  >
                    تایید
                  </button>
                  <AdminRowActions
                    :can-edit="can('edit')"
                    :can-delete="can('delete')"
                    @edit="openEdit(item)"
                    @delete="remove(item)"
                  />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </template>
      <template #cards>
        <AdminMobileCard
          v-for="item in items"
          :key="item.id"
          :title="item.clientName || '—'"
          :subtitle="item.quote"
          :thumb="item.avatarUrl"
          :active="item.isActive"
          :can-toggle="can('edit')"
          :toggle-busy="togglingId === item.id"
          :can-edit="can('edit')"
          :can-delete="can('delete')"
          :meta="item.rating ? `${item.rating} از ۵` : ''"
          @toggle="toggleActive(item)"
          @edit="openEdit(item)"
          @delete="remove(item)"
        />
      </template>
    </AdminListPanel>
    <AdminModal :open="modal" :title="editing ? 'ویرایش نظر' : 'نظر جدید'" @close="modal = false">
      <form id="admin-testimonials-form" class="grid gap-3" @submit.prevent="save">
        <div class="grid gap-3 sm:grid-cols-2">
          <label class="text-sm">نام<input v-model="form.firstName" required class="mt-1 w-full rounded-xl border border-mist px-3 py-2"></label>
          <label class="text-sm">نام خانوادگی<input v-model="form.lastName" required class="mt-1 w-full rounded-xl border border-mist px-3 py-2"></label>
        </div>
        <label class="text-sm">سمت / شرکت<input v-model="form.roleOrCompany" class="mt-1 w-full rounded-xl border border-mist px-3 py-2"></label>
        <label class="text-sm">متن نظر<textarea v-model="form.quote" rows="4" required class="mt-1 w-full rounded-xl border border-mist px-3 py-2" /></label>
        <AdminMediaField v-model="form.avatarUrl" label="تصویر" />
        <label class="text-sm">امتیاز (۱ تا ۵)<input v-model.number="form.rating" type="number" min="1" max="5" class="mt-1 w-full rounded-xl border border-mist px-3 py-2"></label>
        <label class="text-sm">ترتیب<input v-model.number="form.sort" type="number" class="mt-1 w-full rounded-xl border border-mist px-3 py-2"></label>
        <AdminCheckbox v-model="form.featured" label="نمایش در صفحه اصلی" />
        <AdminCheckbox v-model="form.isActive" label="تایید شده / فعال" />

        </form>
      <template #footer>
          <button class="w-full rounded-xl bg-green-deep py-2.5 text-sm font-semibold text-on-primary shadow-sm transition hover:brightness-110 disabled:opacity-60" type="submit" form="admin-testimonials-form" :disabled="saving">ذخیره</button>
      </template>
    </AdminModal>
  </div>
</template>
