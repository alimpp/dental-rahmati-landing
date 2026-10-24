<script setup lang="ts">
import { useSiteTheme } from '~/composables/useSiteTheme'

const { themes, activeTheme, pickerOpen, selectTheme, resetToDefault, closePicker, initSiteTheme, loading }
  = useSiteTheme()

watch(pickerOpen, async (open) => {
  if (open && !themes.value.length) {
    await initSiteTheme()
  }
})

async function onReset() {
  await resetToDefault()
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="pickerOpen"
      class="fixed inset-0 z-[80] flex items-end justify-center bg-band/50 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label="انتخاب تم سایت"
      @click.self="closePicker"
    >
      <div class="w-full max-w-lg overflow-hidden rounded-2xl border border-mist bg-surface shadow-2xl">
        <div class="flex items-center justify-between border-b border-mist px-5 py-4">
          <div>
            <p class="text-sm font-semibold text-ink">
              تم سایت
            </p>
            <p class="mt-0.5 text-xs text-ink-muted">
              رنگ‌بندی کل صفحه را یک‌جا عوض کنید
            </p>
          </div>
          <button
            type="button"
            class="rounded-lg px-2 py-1 text-sm text-ink-muted hover:bg-mist"
            @click="closePicker"
          >
            بستن
          </button>
        </div>

        <div class="max-h-[60vh] space-y-2 overflow-y-auto p-4">
          <p v-if="loading" class="py-8 text-center text-sm text-ink-muted">
            در حال بارگذاری…
          </p>
          <button
            v-for="item in themes"
            :key="item.id"
            type="button"
            class="flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-right transition"
            :class="activeTheme?.id === item.id
              ? 'border-green-deep bg-green-soft/40'
              : 'border-mist bg-panel hover:border-green-deep/40'"
            @click="selectTheme(item)"
          >
            <span class="flex shrink-0 gap-1">
              <span
                class="size-5 rounded-full border border-black/5"
                :style="{ background: item.colors.primary }"
              />
              <span
                class="size-5 rounded-full border border-black/5"
                :style="{ background: item.colors.accent }"
              />
              <span
                class="size-5 rounded-full border border-black/5"
                :style="{ background: item.colors.surface }"
              />
            </span>
            <span class="min-w-0 flex-1">
              <span class="block text-sm font-medium text-ink">{{ item.name }}</span>
              <span class="mt-0.5 block truncate text-xs text-ink-muted">{{ item.description }}</span>
            </span>
            <span
              v-if="item.isDefault"
              class="shrink-0 rounded-md bg-mist px-2 py-0.5 text-[10px] text-ink-muted"
            >پیش‌فرض</span>
          </button>
        </div>

        <div class="flex justify-between border-t border-mist px-4 py-3">
          <button
            type="button"
            class="text-xs text-ink-muted underline-offset-2 hover:text-ink hover:underline"
            @click="onReset"
          >
            بازگشت به پیش‌فرض
          </button>
          <button
            type="button"
            class="rounded-xl bg-green-deep px-4 py-2 text-sm font-medium text-on-primary"
            @click="closePicker"
          >
            تایید
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
