<script setup lang="ts">
withDefaults(
  defineProps<{
    canEdit?: boolean
    canDelete?: boolean
  }>(),
  { canEdit: false, canDelete: false },
)

defineEmits<{
  edit: []
  delete: []
}>()
</script>

<template>
  <div class="inline-flex items-center gap-2">
    <button
      v-if="canEdit"
      class="inline-flex items-center gap-1.5 rounded-xl bg-gold/15 px-3 py-2 text-gold shadow-sm transition hover:bg-gold hover:text-white"
      type="button"
      title="ویرایش"
      @click="$emit('edit')"
    >
      <AdminIcon src="/icons/admin-edit.svg" size="size-4" />
      <span class="text-xs font-semibold">ویرایش</span>
    </button>
    <button
      v-if="canDelete"
      class="inline-flex items-center gap-1.5 rounded-xl bg-red-50 px-3 py-2 text-red-600 shadow-sm transition hover:bg-red-600 hover:text-white"
      type="button"
      title="حذف"
      @click="$emit('delete')"
    >
      <AdminIcon src="/icons/admin-delete.svg" size="size-4" />
      <span class="text-xs font-semibold">حذف</span>
    </button>
  </div>
</template>
