<script setup lang="ts">
import { adminModule } from '~/modules'
import {
  ACTION_ICONS,
  ACTION_LABELS,
  ADMIN_MODULES,
  emptyPermissions,
  MODULE_ICONS,
  MODULE_LABELS,
  PERMISSION_ACTIONS,
  type AdminModuleKey,
  type AdminPermissions,
  type PermissionAction,
  type TAdminUser,
} from '~/modules/admin/types/index.type'
import { unwrapList } from '~/modules/admin/utils'

definePageMeta({ layout: 'admin', robots: false })

const can = (action: 'view' | 'create' | 'edit' | 'delete') =>
  adminModule.controller.can('admins', action)
const { confirm: confirmDelete } = useAdminConfirm()

const items = ref<TAdminUser[]>([])
const error = ref('')
const saving = ref(false)
const modal = ref(false)
const editing = ref<TAdminUser | null>(null)
const form = reactive({
  username: '',
  displayName: '',
  password: '',
  isActive: true,
  permissions: emptyPermissions() as AdminPermissions,
})

onMounted(async () => {
  if (!can('view')) {
    await navigateTo('/admin')
    return
  }
  await load()
})

async function load() {
  const response = await adminModule.controller.getAdmins()
  if (!response.success) {
    error.value = response.message
    return
  }
  items.value = unwrapList<TAdminUser>(response.data)
}

function hasAction(module: AdminModuleKey, action: PermissionAction) {
  return Boolean(form.permissions[module]?.includes(action))
}

function setPerm(module: AdminModuleKey, action: PermissionAction, on: boolean) {
  const current = form.permissions[module] ?? []
  const has = current.includes(action)
  if (on === has) return
  form.permissions = {
    ...form.permissions,
    [module]: on ? [...current, action] : current.filter((item) => item !== action),
  }
}

function toggleAll(module: AdminModuleKey) {
  const full = hasAction(module, 'view')
    && hasAction(module, 'create')
    && hasAction(module, 'edit')
    && hasAction(module, 'delete')
  form.permissions = {
    ...form.permissions,
    [module]: full ? [] : [...PERMISSION_ACTIONS],
  }
}

function openCreate() {
  editing.value = null
  form.username = ''
  form.displayName = ''
  form.password = ''
  form.isActive = true
  form.permissions = emptyPermissions()
  modal.value = true
}

function openEdit(item: TAdminUser) {
  editing.value = item
  form.username = item.username
  form.displayName = item.displayName
  form.password = ''
  form.isActive = item.isActive
  form.permissions = { ...emptyPermissions(), ...(item.permissions ?? {}) }
  modal.value = true
}

async function save() {
  saving.value = true
  error.value = ''
  const response = editing.value
    ? await adminModule.controller.updateAdmin(editing.value.id, {
        displayName: form.displayName,
        password: form.password || undefined,
        isActive: form.isActive,
        permissions: form.permissions,
      })
    : await adminModule.controller.createAdmin({
        username: form.username,
        displayName: form.displayName,
        password: form.password,
        isActive: form.isActive,
        permissions: form.permissions,
      })
  saving.value = false
  if (!response.success) {
    error.value = response.message
    return
  }
  modal.value = false
  await load()
}

async function remove(item: TAdminUser) {
  if (!(await confirmDelete(`ادمین «${item.username}» حذف شود؟`))) return
  const response = await adminModule.controller.deleteAdmin(item.id)
  if (!response.success) {
    error.value = response.message
    return
  }
  await load()
}
</script>

<template>
  <div>
    <AdminHeader title="ادمین‌ها" action-label="ادمین جدید" :show-action="can('create')" @action="openCreate" />
    <p v-if="error" class="mb-3 text-sm text-red-600">{{ error }}</p>
    <div class="overflow-x-auto rounded-2xl border border-mist bg-white">
      <table class="w-full min-w-[640px] text-right text-sm">
        <thead class="bg-mist/60 text-ink-muted">
          <tr>
            <th class="p-3 font-medium">نام</th>
            <th class="p-3 font-medium">نام کاربری</th>
            <th class="p-3 font-medium">نقش</th>
            <th class="p-3 font-medium">وضعیت</th>
            <th class="p-3 font-medium">عملیات</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in items" :key="item.id" class="border-t border-mist">
            <td class="p-3">{{ item.displayName }}</td>
            <td class="p-3">{{ item.username }}</td>
            <td class="p-3">
              <span
                class="rounded-full px-2.5 py-0.5 text-[11px]"
                :class="item.isSuperAdmin ? 'bg-gold/15 text-gold' : 'bg-green-soft text-green-deep'"
              >
                {{ item.isSuperAdmin ? 'سوپر ادمین' : 'ادمین' }}
              </span>
            </td>
            <td class="p-3"><AdminStatus :active="item.isActive" /></td>
            <td class="p-3">
              <AdminRowActions
                :can-edit="can('edit') && !item.isSuperAdmin"
                :can-delete="can('delete') && !item.isSuperAdmin"
                @edit="openEdit(item)"
                @delete="remove(item)"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <AdminModal :open="modal" :title="editing ? 'ویرایش ادمین' : 'ادمین جدید'" @close="modal = false">
      <form class="grid gap-3" @submit.prevent="save">
        <label v-if="!editing" class="text-sm">نام کاربری<input v-model="form.username" required class="mt-1 w-full rounded-xl border border-mist px-3 py-2"></label>
        <label class="text-sm">نام نمایشی<input v-model="form.displayName" required class="mt-1 w-full rounded-xl border border-mist px-3 py-2"></label>
        <label class="text-sm">رمز عبور<input v-model="form.password" :required="!editing" type="password" class="mt-1 w-full rounded-xl border border-mist px-3 py-2"></label>
        <AdminCheckbox v-model="form.isActive" label="فعال" />

        <p class="flex items-center gap-2 pt-2 text-sm font-medium text-ink">
          <span class="inline-flex size-7 items-center justify-center rounded-lg bg-green-soft text-green-deep">
            <AdminIcon src="/icons/admin-shield.svg" size="size-3.5" />
          </span>
          دسترسی‌ها
        </p>
        <div class="grid gap-3">
          <article
            v-for="module in ADMIN_MODULES"
            :key="module"
            class="rounded-2xl border border-mist bg-[#f4f7f5] p-3"
          >
            <div class="mb-2 flex items-center justify-between gap-2">
              <div class="flex min-w-0 items-center gap-2">
                <span class="inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-white text-green-deep ring-1 ring-mist">
                  <AdminIcon :src="MODULE_ICONS[module]" size="size-4" />
                </span>
                <p class="truncate text-sm font-medium text-green-deep">{{ MODULE_LABELS[module] }}</p>
              </div>
              <button class="shrink-0 text-[11px] text-gold" type="button" @click="toggleAll(module)">
                همه / هیچ
              </button>
            </div>
            <div class="grid gap-3 sm:grid-cols-2">
              <div
                v-for="action in PERMISSION_ACTIONS"
                :key="action"
                class="flex items-center gap-2"
              >
                <span class="inline-flex size-7 shrink-0 items-center justify-center rounded-lg bg-white text-ink-muted ring-1 ring-mist">
                  <AdminIcon :src="ACTION_ICONS[action]" size="size-3.5" />
                </span>
                <AdminCheckbox
                  class="flex-1"
                  :model-value="hasAction(module, action)"
                  :label="ACTION_LABELS[action]"
                  @update:model-value="(on) => setPerm(module, action, Boolean(on))"
                />
              </div>
            </div>
          </article>
        </div>
        <button class="rounded-xl bg-green-deep py-2 text-ink" :disabled="saving">ذخیره</button>
      </form>
    </AdminModal>
  </div>
</template>
