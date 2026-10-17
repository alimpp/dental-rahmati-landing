<script setup lang="ts">
import {
  ACTION_ICONS,
  ACTION_LABELS,
  ADMIN_MODULES,
  MODULE_ICONS,
  MODULE_LABELS,
  PERMISSION_ACTIONS,
  type AdminModuleKey,
  type PermissionAction,
  type TAdminUser,
} from '~/modules/admin/types/index.type'

const props = defineProps<{
  open: boolean
  user: TAdminUser | null
}>()

const emit = defineEmits<{
  close: []
  logout: []
}>()

const initials = computed(() => {
  const source = props.user?.displayName || props.user?.username || 'اد'
  const parts = source.trim().split(/\s+/).filter(Boolean)
  if (parts.length >= 2) {
    return `${parts[0]!.slice(0, 1)}${parts[1]!.slice(0, 1)}`
  }
  return source.slice(0, 2)
})

const roleLabel = computed(() => {
  if (!props.user) return ''
  if (props.user.isSuperAdmin) return 'سوپر ادمین'
  return 'ادمین'
})

function moduleActions(module: AdminModuleKey): PermissionAction[] {
  if (!props.user) return []
  if (props.user.isSuperAdmin) return [...PERMISSION_ACTIONS]
  return props.user.permissions?.[module] ?? []
}

const permissionRows = computed(() => {
  if (!props.user) return []
  return ADMIN_MODULES
    .map((module) => ({
      module,
      label: MODULE_LABELS[module],
      icon: MODULE_ICONS[module],
      actions: moduleActions(module),
    }))
    .filter((row) => props.user!.isSuperAdmin || row.actions.length > 0)
})

function onKey(event: KeyboardEvent) {
  if (!props.open) return
  if (event.key === 'Escape') emit('close')
}

onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <Teleport to="body">
    <Transition name="admin-profile">
      <div
        v-if="open && user"
        class="fixed inset-0 z-[60] flex items-end justify-center bg-ink/45 p-3 backdrop-blur-[2px] sm:items-center"
        role="dialog"
        aria-modal="true"
        aria-label="پروفایل ادمین"
        @click.self="emit('close')"
      >
        <div class="admin-scroll max-h-[90vh] w-full max-w-lg overflow-hidden rounded-[1.5rem] bg-white shadow-[0_24px_60px_rgba(43,48,54,0.18)] ring-1 ring-mist-deep">
          <div class="relative overflow-hidden bg-gradient-to-bl from-ink via-[#0a4a4b] to-[#042526] px-5 pb-5 pt-4 text-white">
            <div
              class="pointer-events-none absolute inset-0 opacity-20"
              style="background-image: radial-gradient(circle at 1px 1px, #fff 1px, transparent 0); background-size: 18px 18px;"
              aria-hidden="true"
            />
            <div class="relative flex items-start justify-between gap-3">
              <div class="flex min-w-0 items-center gap-3">
                <span
                  class="inline-flex size-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-lg font-bold ring-1 ring-white/25"
                  aria-hidden="true"
                >
                  {{ initials }}
                </span>
                <div class="min-w-0">
                  <p class="truncate text-lg font-semibold">
                    {{ user.displayName || user.username }}
                  </p>
                  <p class="mt-0.5 truncate text-sm text-white/70">
                    @{{ user.username }}
                  </p>
                  <span class="mt-2 inline-flex items-center gap-1.5 rounded-full bg-gold/20 px-2.5 py-1 text-[11px] font-medium text-gold ring-1 ring-gold/30">
                    <AdminIcon src="/icons/admin-shield.svg" size="size-3.5" />
                    {{ roleLabel }}
                  </span>
                </div>
              </div>
              <button
                type="button"
                class="inline-flex size-9 items-center justify-center rounded-xl bg-white/10 text-white/80 ring-1 ring-white/15 transition hover:bg-white/20"
                aria-label="بستن"
                @click="emit('close')"
              >
                <span class="text-lg leading-none">×</span>
              </button>
            </div>
          </div>

          <div class="admin-scroll max-h-[min(52vh,420px)] overflow-y-auto px-5 py-4">
            <div class="mb-3 flex items-center gap-2">
              <span class="inline-flex size-8 items-center justify-center rounded-xl bg-green-soft text-green-deep">
                <AdminIcon src="/icons/admin-shield.svg" size="size-4" />
              </span>
              <div>
                <p class="text-sm font-semibold text-ink">دسترسی‌ها</p>
                <p class="text-[11px] text-ink-muted">
                  {{ user.isSuperAdmin ? 'دسترسی کامل به همه بخش‌ها' : `${permissionRows.length} ماژول فعال` }}
                </p>
              </div>
            </div>

            <ul class="space-y-2">
              <li
                v-for="row in permissionRows"
                :key="row.module"
                class="rounded-2xl border border-mist bg-[#f7faf8] p-3"
              >
                <div class="flex items-center gap-2.5">
                  <span class="inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-white text-green-deep ring-1 ring-mist">
                    <AdminIcon :src="row.icon" size="size-4" />
                  </span>
                  <p class="min-w-0 flex-1 truncate text-sm font-medium text-ink">
                    {{ row.label }}
                  </p>
                </div>
                <div class="mt-2.5 flex flex-wrap gap-1.5">
                  <span
                    v-for="action in row.actions"
                    :key="action"
                    class="inline-flex items-center gap-1 rounded-full bg-white px-2 py-1 text-[11px] text-ink-muted ring-1 ring-mist"
                  >
                    <AdminIcon :src="ACTION_ICONS[action]" size="size-3" />
                    {{ ACTION_LABELS[action] }}
                  </span>
                </div>
              </li>
            </ul>

            <p
              v-if="!permissionRows.length"
              class="rounded-2xl border border-dashed border-mist px-4 py-6 text-center text-sm text-ink-muted"
            >
              دسترسی فعالی ثبت نشده است.
            </p>
          </div>

          <div class="border-t border-mist px-5 py-4">
            <button
              type="button"
              class="flex w-full items-center justify-center gap-2 rounded-xl bg-[#fdeeee] py-3 text-sm font-semibold text-[#b42318] ring-1 ring-[#f5c2c0] transition hover:bg-[#fbd5d5]"
              @click="emit('logout')"
            >
              <AdminIcon src="/icons/admin-logout.svg" size="size-4" />
              خروج از حساب
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.admin-profile-enter-active,
.admin-profile-leave-active {
  transition: opacity 0.22s ease;
}
.admin-profile-enter-active > div,
.admin-profile-leave-active > div {
  transition: transform 0.28s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.22s ease;
}
.admin-profile-enter-from,
.admin-profile-leave-to {
  opacity: 0;
}
.admin-profile-enter-from > div,
.admin-profile-leave-to > div {
  opacity: 0;
  transform: translateY(1rem) scale(0.98);
}
</style>
