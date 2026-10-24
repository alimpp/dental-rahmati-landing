<script setup lang="ts">
const error = useError()
const is404 = computed(() => Number(error.value?.statusCode) === 404)
const title = computed(() =>
  is404.value ? 'صفحه پیدا نشد | امیر رحمتی' : 'خطا | امیر رحمتی',
)
const description = computed(() =>
  is404.value
    ? 'صفحه مورد نظر در سایت کلینیک دندان‌پزشکی امیر رحمتی پیدا نشد.'
    : 'در بارگذاری این صفحه خطایی رخ داد.',
)

usePageSeo({
  title,
  description,
  noindex: true,
})

function goHome() {
  clearError({ redirect: '/' })
}
</script>

<template>
  <div class="min-h-screen bg-surface px-4 py-24 text-center text-ink" dir="rtl" lang="fa">
    <p class="text-sm font-medium tracking-wide text-gold">
      {{ error?.statusCode || 500 }}
    </p>
    <h1 class="mt-3 text-3xl font-semibold">
      {{ is404 ? 'صفحه پیدا نشد' : 'خطایی رخ داد' }}
    </h1>
    <p class="mx-auto mt-3 max-w-md text-ink-muted">
      {{ error?.statusMessage || description }}
    </p>
    <button
      class="mt-8 inline-flex rounded-xl bg-green-deep px-5 py-3 text-sm font-semibold text-on-primary"
      type="button"
      @click="goHome"
    >
      بازگشت به خانه
    </button>
  </div>
</template>
