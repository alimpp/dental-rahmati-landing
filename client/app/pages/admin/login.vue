<script setup lang="ts">
import { adminModule } from '~/modules'

definePageMeta({
  layout: 'auth',
  robots: false,
})

const username = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)
const showPassword = ref(false)

const points = [
  'مدیریت بنر، خدمات، مقالات و نمونه کارها',
  'سطح دسترسی دیدن، ایجاد، ویرایش و حذف',
  'ثبت تاریخچه هر تغییر در پنل',
]

async function submit() {
  error.value = ''
  loading.value = true
  const response = await adminModule.controller.login({
    username: username.value.trim(),
    password: password.value,
  })
  loading.value = false
  if (!response.success) {
    error.value = response.message || 'ورود ناموفق بود'
    return
  }
  await navigateTo('/admin')
}
</script>

<template>
  <div class="login-shell grid w-full grid-cols-1 md:grid-cols-2">
    <section class="flex items-center bg-surface px-6 py-10 sm:px-10 lg:px-16">
      <div class="mx-auto w-full max-w-md">
        <p class="text-[11px] font-medium tracking-[0.2em] text-gold">ورود ادمین</p>
        <h1 class="mt-2 text-2xl font-semibold text-ink sm:text-3xl">ورود به پنل</h1>
        <p class="mt-2 text-sm leading-7 text-ink-muted">
          نام کاربری و رمز عبور خود را وارد کنید.
        </p>

        <form class="mt-8 space-y-4" @submit.prevent="submit">
          <label class="block">
            <span class="mb-1.5 block text-[11px] font-medium text-ink-muted">نام کاربری</span>
            <input
              v-model="username"
              class="w-full rounded-xl border-0 bg-mist/70 px-3.5 py-3 text-sm text-ink ring-1 ring-mist-deep outline-none transition focus:bg-white focus:ring-gold/50"
              autocomplete="username"
            >
          </label>

          <label class="block">
            <span class="mb-1.5 block text-[11px] font-medium text-ink-muted">رمز عبور</span>
            <div class="relative">
              <input
                v-model="password"
                class="w-full rounded-xl border-0 bg-mist/70 px-3.5 py-3 pl-12 text-sm text-ink ring-1 ring-mist-deep outline-none transition focus:bg-white focus:ring-gold/50"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="current-password"
              >
              <button
                class="absolute left-2 top-1/2 inline-flex size-9 -translate-y-1/2 items-center justify-center rounded-lg text-ink-muted transition hover:bg-mist hover:text-green-deep"
                type="button"
                :aria-label="showPassword ? 'پنهان کردن رمز' : 'نمایش رمز'"
                @click="showPassword = !showPassword"
              >
                <span
                  class="inline-block size-5 bg-current"
                  :style="{
                    maskImage: `url(${showPassword ? '/icons/eye-off.svg' : '/icons/eye.svg'})`,
                    WebkitMaskImage: `url(${showPassword ? '/icons/eye-off.svg' : '/icons/eye.svg'})`,
                    maskRepeat: 'no-repeat',
                    WebkitMaskRepeat: 'no-repeat',
                    maskPosition: 'center',
                    WebkitMaskPosition: 'center',
                    maskSize: 'contain',
                    WebkitMaskSize: 'contain',
                  }"
                  aria-hidden="true"
                />
              </button>
            </div>
          </label>

          <p v-if="error" class="text-sm text-red-600">{{ error }}</p>

          <button
            class="w-full rounded-xl bg-green-deep py-3 text-sm font-medium text-ink transition hover:brightness-105 disabled:opacity-60"
            :disabled="loading"
            type="submit"
          >
            {{ loading ? 'در حال ورود…' : 'ورود' }}
          </button>
        </form>

        <NuxtLink to="/" class="mt-8 inline-block text-xs text-ink-muted hover:text-green-deep">
          بازگشت به وب‌سایت
        </NuxtLink>
      </div>
    </section>

    <section class="relative flex items-center overflow-hidden bg-ink px-6 py-12 text-white sm:px-10 lg:px-16">
      <div class="pointer-events-none absolute -left-10 top-16 size-56 rounded-full bg-green-deep/30 blur-3xl" />
      <div class="pointer-events-none absolute -right-8 bottom-8 size-48 rounded-full bg-gold/25 blur-3xl" />
      <div class="pointer-events-none absolute inset-x-0 top-0 h-px bg-gold" />

      <div class="relative mx-auto w-full max-w-md">
        <div class="flex items-center gap-3">
          <img
            src="/images/logo.svg"
            alt="لوگوی کلینیک امیر رحمتی"
            class="size-14 rounded-2xl ring-1 ring-gold/35"
            width="56"
            height="56"
          >
          <div>
            <p class="text-lg font-semibold">امیر رحمتی</p>
            <p class="text-xs text-gold">کلینیک دندان‌پزشکی</p>
          </div>
        </div>

        <h2 class="mt-10 text-3xl font-semibold leading-tight sm:text-4xl">
          پنل مدیریت محتوا
        </h2>
        <p class="mt-4 text-sm leading-7 text-white/80">
          از این فضا بنرها، خدمات، مقالات و درخواست‌های نوبت را مدیریت می‌کنید.
        </p>

        <ul class="mt-8 space-y-3">
          <li
            v-for="item in points"
            :key="item"
            class="flex items-start gap-3 rounded-2xl bg-white/10 px-4 py-3 text-sm leading-6 ring-1 ring-white/10"
          >
            <span class="mt-2 size-1.5 shrink-0 rounded-full bg-gold" />
            <span>{{ item }}</span>
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* Keep a real CSS block so Tailwind/Vite do not reuse a stale script-as-style module. */
.login-shell {
  min-height: 100dvh;
}
</style>
