<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
  thumb?: string | null
  active?: boolean
  canToggle?: boolean
  toggleBusy?: boolean
  canEdit?: boolean
  canDelete?: boolean
  meta?: string
}>()

const emit = defineEmits<{
  toggle: []
  edit: []
  delete: []
}>()
</script>

<template>
  <article class="min-w-0 overflow-hidden rounded-2xl border border-mist bg-white p-3.5 shadow-[0_1px_0_rgba(43,48,54,0.04)]">
    <div class="flex gap-3">
      <AdminThumb
        v-if="thumb !== undefined"
        :src="thumb || ''"
        :alt="title"
        class="shrink-0"
      />
      <div class="min-w-0 flex-1">
        <div class="flex items-start justify-between gap-2">
          <div class="min-w-0">
            <h3 class="truncate text-sm font-semibold text-ink">{{ title }}</h3>
            <p v-if="subtitle" class="mt-0.5 line-clamp-2 text-xs leading-5 text-ink-muted">
              {{ subtitle }}
            </p>
          </div>
          <AdminStatus
            v-if="active !== undefined"
            :active="Boolean(active)"
            :clickable="canToggle"
            :busy="toggleBusy"
            class="shrink-0"
            @toggle="emit('toggle')"
          />
        </div>
        <p v-if="meta" class="mt-2 text-[11px] text-ink-muted">{{ meta }}</p>
        <div class="mt-3 flex items-center justify-end">
          <AdminRowActions
            :can-edit="canEdit"
            :can-delete="canDelete"
            @edit="emit('edit')"
            @delete="emit('delete')"
          />
        </div>
      </div>
    </div>
    <slot />
  </article>
</template>
