<script setup lang="ts">
import { testimonialModule } from '~/modules'
import type { TestimonialModel } from '../models/index.model'
import StarRating from './StarRating.vue'

const testimonialDS = testimonialModule.store
const mediaSrc = useMediaSrc()

const items = computed(() => {
  const visible = testimonialDS.getVisibleItems
  const featured = visible.filter((item) => item.featured)
  return featured.length ? featured : visible
})

await testimonialModule.controller.getList()

const track = ref<HTMLElement | null>(null)
const paused = ref(false)
const reducedMotion = ref(false)
const userLockedUntil = ref(0)
let raf = 0

const detailOpen = ref(false)
const detailItem = ref<TestimonialModel | null>(null)
const successOpen = ref(false)

const form = reactive({
  firstName: '',
  lastName: '',
  quote: '',
  rating: 0,
})
const formError = ref('')
const submitting = ref(false)

function openDetail(item: TestimonialModel) {
  detailItem.value = item
  detailOpen.value = true
  paused.value = true
}

function closeDetail() {
  detailOpen.value = false
  detailItem.value = null
  paused.value = false
}

function lockAutoScroll(ms = 4500) {
  userLockedUntil.value = Date.now() + ms
}

function scrollByCard(dir: 1 | -1) {
  const el = track.value
  if (!el) return
  const card = el.querySelector<HTMLElement>('[data-testimonial-card]')
  const amount = (card?.offsetWidth ?? 280) + 16
  el.scrollBy({ left: dir * amount, behavior: 'smooth' })
  lockAutoScroll()
}

function onTrackWheel() {
  lockAutoScroll(3000)
}

function onTrackPointerDown() {
  paused.value = true
  lockAutoScroll(5000)
}

function onTrackPointerUp() {
  paused.value = false
}

function tick() {
  const el = track.value
  if (
    el
    && !paused.value
    && !reducedMotion.value
    && !detailOpen.value
    && Date.now() > userLockedUntil.value
    && items.value.length > 1
  ) {
    const max = el.scrollWidth - el.clientWidth
    if (max > 4) {
      // LTR track: scroll left→right visually; when end, loop
      if (el.scrollLeft >= max - 2) el.scrollLeft = 0
      else el.scrollLeft += 0.45
    }
  }
  raf = requestAnimationFrame(tick)
}

onMounted(() => {
  if (import.meta.client) {
    reducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }
  raf = requestAnimationFrame(tick)
})

onBeforeUnmount(() => {
  if (raf) cancelAnimationFrame(raf)
})

async function submitReview() {
  formError.value = ''
  if (!form.firstName.trim() || !form.lastName.trim()) {
    formError.value = 'نام و نام خانوادگی الزامی است.'
    return
  }
  if (!form.rating || form.rating < 1 || form.rating > 5) {
    formError.value = 'لطفاً امتیاز خود را انتخاب کنید.'
    return
  }
  if (form.quote.trim().length < 20) {
    formError.value = 'متن نظر باید حداقل ۲۰ کاراکتر باشد.'
    return
  }

  submitting.value = true
  try {
    const response = await testimonialModule.controller.submitPublic({
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      quote: form.quote.trim(),
      rating: form.rating,
    })
    if (!response.success) {
      formError.value = response.message || 'ثبت نظر ناموفق بود.'
      return
    }
    Object.assign(form, { firstName: '', lastName: '', quote: '', rating: 0 })
    successOpen.value = true
  }
  catch (err) {
    formError.value = err instanceof Error ? err.message : 'خطا در ثبت نظر'
  }
  finally {
    submitting.value = false
  }
}

function closeSuccess() {
  successOpen.value = false
}
</script>

<template>
  <section class="relative overflow-hidden bg-mist py-16 sm:py-20 lg:py-24">
    <div
      class="pointer-events-none absolute -left-24 top-10 size-[22rem] rounded-full bg-green-deep/10 blur-3xl"
      aria-hidden="true"
    />
    <div
      class="pointer-events-none absolute -right-16 bottom-0 size-[18rem] rounded-full bg-gold/10 blur-3xl"
      aria-hidden="true"
    />

    <div class="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div class="max-w-2xl">
          <p class="reveal-item reveal-item-fade text-[11px] font-semibold tracking-[0.2em] text-gold" style="--reveal-i: 0">
            نظرات بیماران
          </p>
          <h2 class="reveal-item mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl" style="--reveal-i: 1">
            اعتماد، از زبان کسانی که همراهشان بودیم
          </h2>
          <p class="reveal-item mt-3 max-w-xl text-sm leading-7 text-ink-muted sm:text-[15px]" style="--reveal-i: 2">
            امتیاز و نظر واقعی بیماران پس از تایید در اینجا نمایش داده می‌شود.
          </p>
        </div>

        <div
          v-if="items.length > 1"
          class="reveal-item flex items-center gap-2" style="--reveal-i: 2"
        >
          <button
            type="button"
            class="inline-flex size-10 items-center justify-center rounded-full bg-panel text-lg text-ink ring-1 ring-mist-deep transition hover:bg-green-deep hover:text-on-primary"
            aria-label="اسکرول به قبل"
            @click="scrollByCard(-1)"
          >
            ‹
          </button>
          <button
            type="button"
            class="inline-flex size-10 items-center justify-center rounded-full bg-panel text-lg text-ink ring-1 ring-mist-deep transition hover:bg-green-deep hover:text-on-primary"
            aria-label="اسکرول به بعد"
            @click="scrollByCard(1)"
          >
            ›
          </button>
        </div>
      </div>

      <!-- Equal-height horizontal cards -->
      <div
        v-if="items.length"
        class="reveal-item mt-10" style="--reveal-i: 3"
      >
        <div
          ref="track"
          class="testimonial-track flex gap-4 overflow-x-auto pb-3"
          dir="ltr"
          @wheel="onTrackWheel"
          @pointerdown="onTrackPointerDown"
          @pointerup="onTrackPointerUp"
          @pointercancel="onTrackPointerUp"
          @mouseenter="paused = true"
          @mouseleave="paused = false"
        >
          <article
            v-for="item in items"
            :key="item.id"
            data-testimonial-card
            dir="rtl"
            class="testimonial-card group relative flex h-[23.5rem] w-[min(86vw,21rem)] shrink-0 flex-col overflow-hidden rounded-[1.6rem] bg-panel p-6 shadow-[0_12px_40px_color-mix(in_srgb,var(--color-ink)_7%,transparent)] ring-1 ring-mist-deep/80 transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_48px_color-mix(in_srgb,var(--color-ink)_12%,transparent)] sm:w-[22.5rem] sm:p-7"
          >
            <div
              class="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-l from-[#F5C518] via-[#FFE08A] to-green-deep/40"
              aria-hidden="true"
            />
            <div
              class="pointer-events-none absolute -left-10 -top-10 size-28 rounded-full bg-[#F5C518]/10 blur-2xl transition group-hover:bg-[#F5C518]/18"
              aria-hidden="true"
            />

            <div class="relative flex items-start justify-between gap-3">
              <span class="testimonial-quote !bg-[#EAB308]" aria-hidden="true" />
              <div
                v-if="item.rating"
                class="inline-flex items-center gap-1.5 rounded-full bg-[#F5C518]/12 px-2.5 py-1 ring-1 ring-[#EAB308]/25"
              >
                <StarRating
                  :value="item.rating"
                  size="sm"
                  :label="`امتیاز ${item.clientName}`"
                />
                <span class="text-[11px] font-bold tabular-nums text-[#B45309]">
                  {{ item.rating.toFixed(1) }}
                </span>
              </div>
            </div>

            <p class="relative mt-5 flex-1 text-[15px] leading-8 text-ink">
              {{ item.truncatedQuote }}
            </p>

            <div class="relative mt-2 min-h-5">
              <button
                v-if="item.isQuoteLong"
                type="button"
                class="self-start text-sm font-semibold text-green-deep transition hover:text-ink"
                @click="openDetail(item)"
              >
                مشاهده بیشتر
              </button>
            </div>

            <div class="relative mt-auto flex items-center gap-3 border-t border-mist/90 pt-4">
              <img
                v-if="item.avatarUrl"
                :src="mediaSrc(item.avatarUrl)"
                :alt="item.clientName"
                class="size-12 rounded-full object-cover ring-2 ring-[#F5C518]/55"
                width="48"
                height="48"
                loading="lazy"
              >
              <span
                v-else
                class="inline-flex size-12 items-center justify-center rounded-full bg-gradient-to-br from-[#FFE08A]/50 to-green-soft text-xs font-bold text-green-deep ring-2 ring-[#F5C518]/40"
              >
                {{ item.initials }}
              </span>
              <div class="min-w-0">
                <p class="truncate text-sm font-bold text-ink">
                  {{ item.clientName }}
                </p>
                <p v-if="item.roleOrCompany" class="truncate text-[12px] text-ink-muted">
                  {{ item.roleOrCompany }}
                </p>
                <p v-else class="text-[11px] text-[#B45309]/80">
                  بیمار کلینیک
                </p>
              </div>
            </div>
          </article>
        </div>
      </div>

      <p
        v-else
        class="mt-10 rounded-2xl bg-panel/70 px-5 py-8 text-center text-sm text-ink-muted ring-1 ring-mist"
      >
        هنوز نظری منتشر نشده است. اولین نفر باشید.
      </p>

      <!-- Submit form -->
      <div class="reveal-item mt-14 grid gap-8 rounded-[1.75rem] bg-panel p-6 ring-1 ring-mist-deep sm:p-8 lg:grid-cols-12 lg:gap-10" style="--reveal-i: 4">
        <div class="lg:col-span-4">
          <p class="text-[11px] font-semibold tracking-[0.18em] text-gold">
            ثبت نظر شما
          </p>
          <h3 class="mt-3 text-2xl font-bold tracking-tight text-ink">
            تجربه درمانتان را بنویسید
          </h3>
          <p class="mt-3 text-sm leading-7 text-ink-muted">
            نام و نام خانوادگی الزامی است. نظر پس از تایید ادمین در سایت نمایش داده می‌شود.
          </p>
        </div>

        <form class="grid gap-4 lg:col-span-8" @submit.prevent="submitReview">
          <div class="grid gap-4 sm:grid-cols-2">
            <label class="text-sm font-medium text-ink">
              نام
              <input
                v-model="form.firstName"
                type="text"
                required
                maxlength="60"
                autocomplete="given-name"
                class="mt-1.5 w-full rounded-2xl border border-mist bg-surface px-4 py-3 text-sm text-ink outline-none ring-green-deep/0 transition focus:border-green-deep/40 focus:ring-4 focus:ring-green-deep/10"
                placeholder="مثلاً سارا"
              >
            </label>
            <label class="text-sm font-medium text-ink">
              نام خانوادگی
              <input
                v-model="form.lastName"
                type="text"
                required
                maxlength="60"
                autocomplete="family-name"
                class="mt-1.5 w-full rounded-2xl border border-mist bg-surface px-4 py-3 text-sm text-ink outline-none ring-green-deep/0 transition focus:border-green-deep/40 focus:ring-4 focus:ring-green-deep/10"
                placeholder="مثلاً محمدی"
              >
            </label>
          </div>

          <div>
            <p class="text-sm font-medium text-ink">
              امتیاز شما
            </p>
            <div class="mt-2">
              <StarRating
                v-model="form.rating"
                interactive
                size="lg"
                label="انتخاب امتیاز"
              />
            </div>
          </div>

          <label class="text-sm font-medium text-ink">
            متن نظر
            <textarea
              v-model="form.quote"
              required
              rows="4"
              maxlength="1200"
              class="mt-1.5 w-full resize-y rounded-2xl border border-mist bg-surface px-4 py-3 text-sm leading-7 text-ink outline-none ring-green-deep/0 transition focus:border-green-deep/40 focus:ring-4 focus:ring-green-deep/10"
              placeholder="تجربه ویزیت، درمان و نتیجه را بنویسید…"
            />
          </label>

          <p v-if="formError" class="text-sm text-red-600">
            {{ formError }}
          </p>

          <div class="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              class="inline-flex min-h-11 items-center justify-center rounded-full bg-green-deep px-6 py-3 text-sm font-bold text-on-primary shadow-[0_12px_28px_color-mix(in_srgb,var(--color-green-deep)_35%,transparent)] transition hover:-translate-y-0.5 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
              :disabled="submitting"
            >
              {{ submitting ? 'در حال ثبت…' : 'ثبت نظر' }}
            </button>
            <p class="text-xs text-ink-muted">
              انتشار پس از تایید ادمین
            </p>
          </div>
        </form>
      </div>
    </div>

    <!-- Full review modal -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="detailOpen && detailItem"
          class="fixed inset-0 z-[90] flex items-end justify-center bg-band/55 p-4 backdrop-blur-[2px] sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-label="متن کامل نظر"
          @click.self="closeDetail"
        >
          <div class="w-full max-w-lg rounded-[1.5rem] bg-panel p-6 shadow-2xl ring-1 ring-mist sm:p-8">
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0">
                <p class="font-bold text-ink">
                  {{ detailItem.clientName }}
                </p>
                <div v-if="detailItem.rating" class="mt-2 inline-flex items-center gap-2 rounded-full bg-[#F5C518]/12 px-2.5 py-1 ring-1 ring-[#EAB308]/25">
                  <StarRating
                    :value="detailItem.rating"
                    size="sm"
                  />
                  <span class="text-xs font-bold text-[#B45309]">{{ detailItem.rating }} از ۵</span>
                </div>
              </div>
              <button
                type="button"
                class="inline-flex size-10 items-center justify-center rounded-full text-ink hover:bg-mist"
                aria-label="بستن"
                @click="closeDetail"
              >
                ✕
              </button>
            </div>
            <p class="mt-5 text-[15px] leading-8 text-ink">
              {{ detailItem.quote }}
            </p>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Success modal -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="successOpen"
          class="fixed inset-0 z-[90] flex items-end justify-center bg-band/55 p-4 backdrop-blur-[2px] sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-label="ثبت موفق نظر"
          @click.self="closeSuccess"
        >
          <div class="w-full max-w-md rounded-[1.5rem] bg-panel p-7 text-center shadow-2xl ring-1 ring-mist sm:p-8">
            <div class="mx-auto flex size-14 items-center justify-center rounded-full bg-green-soft text-2xl text-green-deep">
              ✓
            </div>
            <h3 class="mt-4 text-xl font-bold text-ink">
              نظر شما ثبت شد
            </h3>
            <p class="mt-3 text-sm leading-7 text-ink-muted">
              پس از تایید ادمین، نظر و امتیازتان در سایت قابل بازدید خواهد بود.
            </p>
            <button
              type="button"
              class="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-green-deep px-6 py-2.5 text-sm font-bold text-on-primary transition hover:brightness-110"
              @click="closeSuccess"
            >
              متوجه شدم
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>
  </section>
</template>
