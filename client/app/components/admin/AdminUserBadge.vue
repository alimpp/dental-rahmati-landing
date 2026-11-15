<script setup lang="ts">
import type { TAdminUser } from '~/modules/admin/types/index.type'

const props = withDefaults(
  defineProps<{
    user: TAdminUser | null
    compact?: boolean
  }>(),
  { compact: false },
)

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
    class="group flex min-w-0 items-center text-right transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40"
    :class="compact
      ? 'gap-0 rounded-xl border border-mist bg-white p-0.5 hover:border-gold/40 sm:gap-2 sm:px-2 sm:py-1'
      : 'gap-2.5 rounded-2xl border border-mist bg-white px-2 py-1.5 hover:border-gold/40 hover:bg-[#f7faf8]'"
    @click="emit('click')"
  >
    <span
      class="inline-flex shrink-0 items-center justify-center bg-gradient-to-bl from-gold to-green-deep font-bold text-white shadow-sm"
      :class="compact ? 'size-8 rounded-lg text-xs sm:size-9 sm:rounded-xl sm:text-sm' : 'size-10 rounded-2xl text-sm'"
      aria-hidden="true"
    >
      {{ initials }}
    </span>
    <span
      class="min-w-0 leading-tight"
      :class="compact ? 'hidden sm:block' : ''"
    >
      <span class="block truncate text-sm font-semibold text-ink">
        {{ user.displayName || user.username }}
      </span>
      <span class="block truncate text-[11px] text-ink-muted">
        {{ roleLabel }}
      </span>
    </span>
    <AdminIcon
      v-if="!compact"
      src="/icons/admin-chevron.svg"
      size="size-3.5"
      class="ms-0.5 shrink-0 text-ink-muted transition group-hover:text-gold"
    />
  </button>
</template>
