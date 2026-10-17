<script setup lang="ts">
const { state, accept, cancel } = useAdminConfirm()

function onKey(event: KeyboardEvent) {
  if (!state.value.open) return
  if (event.key === 'Escape') {
    event.preventDefault()
    cancel()
  }
}

onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <Teleport to="body">
    <Transition name="admin-confirm">
      <div
        v-if="state.open"
        class="fixed inset-0 z-[80] flex items-end justify-center p-4 sm:items-center"
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-confirm-title"
      >
        <button
          class="absolute inset-0 bg-ink/50 backdrop-blur-[6px]"
          type="button"
          aria-label="بستن"
          @click="cancel"
        />
        <div class="admin-confirm-panel relative w-full max-w-md overflow-hidden rounded-[1.75rem] bg-white shadow-[0_28px_80px_rgba(43,48,54,0.28)]">
          <div class="h-1.5 w-full bg-gradient-to-l from-red-500 via-gold to-green-deep" />
          <div class="p-6 sm:p-7">
            <div class="mb-5 flex items-start gap-4">
              <span class="inline-flex size-14 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-600 ring-1 ring-red-100">
                <AdminIcon src="/icons/admin-delete.svg" size="size-7" />
              </span>
              <div class="min-w-0 pt-0.5">
                <h2 id="admin-confirm-title" class="text-lg font-bold text-ink">
                  {{ state.title }}
                </h2>
                <p class="mt-2 text-sm leading-7 text-ink-muted">
                  {{ state.message }}
                </p>
              </div>
            </div>
            <p class="mb-6 rounded-2xl bg-red-50/80 px-4 py-3 text-xs font-medium text-red-700">
              {{ state.warning }}
            </p>
            <div class="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                class="rounded-2xl border border-mist px-5 py-2.5 text-sm font-semibold text-ink transition hover:bg-mist"
                type="button"
                @click="cancel"
              >
                {{ state.cancelLabel }}
              </button>
              <button
                class="rounded-2xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700"
                type="button"
                @click="accept"
              >
                {{ state.confirmLabel }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
