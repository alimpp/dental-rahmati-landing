<script setup lang="ts">
const props = defineProps<{
  title: string
  actionLabel?: string
  showAction?: boolean
  disabled?: boolean
}>()

const emit = defineEmits<{ action: [] }>()
const { setAction, clearAction } = useAdminPageHeader()

watch(
  () => [props.actionLabel, props.showAction, props.disabled] as const,
  () => {
    setAction({
      actionLabel: props.actionLabel || '',
      showAction: Boolean(props.showAction),
      disabled: Boolean(props.disabled),
      onAction: () => emit('action'),
    })
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  clearAction()
})
</script>

<template>
  <!-- Page chrome lives in admin layout sticky header; this keeps page actions wired. -->
  <div class="sr-only" aria-hidden="true">{{ title }}</div>
</template>
