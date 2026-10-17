<script setup lang="ts">
import type { TAdminUser } from '~/modules/admin/types/index.type'

const props = defineProps<{
  user: TAdminUser | null
}>()

const emit = defineEmits<{ click: [] }>()

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
</script>

<template>
  <button
    v-if="user"
    type="button"
    class="group flex min-w-0 items-center gap-2.5 rounded-2xl border border-mist bg-white px-2 py-1.5 text-right transition hover:border-gold/40 hover:bg-[#f7faf8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40"
    @click="emit('click')"
  >
    <span
      class="inline-flex size-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-bl from-gold to-green-deep text-sm font-bold text-white shadow-sm"
      aria-hidden="true"
    >
      {{ initials }}
    </span>
    <span class="min-w-0 leading-tight">
      <span class="block truncate text-sm font-semibold text-ink">
        {{ user.displayName || user.username }}
      </span>
      <span class="block truncate text-[11px] text-ink-muted">
        {{ roleLabel }}
      </span>
    </span>
    <AdminIcon
      src="/icons/admin-chevron.svg"
      size="size-3.5"
      class="ms-0.5 shrink-0 text-ink-muted transition group-hover:text-gold"
    />
  </button>
</template>
