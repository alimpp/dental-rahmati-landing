<script setup lang="ts">
import { guideModule } from '~/modules'
import { GuideModel } from '~/modules/guide/models/index.model'

const mediaSrc = useMediaSrc()
const guideDS = guideModule.store
const items = computed(() =>
  guideDS.getVisibleItems.map((item) => new GuideModel(item)),
)
const loading = computed(() => guideDS.getLoading && !items.value.length)
const categories = computed(() => {
  const set = new Set(items.value.map((item) => item.category).filter(Boolean) as string[])
  return ['همه', ...set]
})
const activeCategory = ref('همه')
const filtered = computed(() => {
  if (activeCategory.value === 'همه') return items.value
  return items.value.filter((item) => item.category === activeCategory.value)
})
const lead = computed(() => filtered.value[0] ?? null)
const rest = computed(() => filtered.value.slice(1))

await guideModule.controller.getList()

usePageSeo({
  title: 'راهنمای دندانپزشکی در کرج | قبل و بعد درمان',
  description:
    'راهنماهای کاربردی کلینیک امیر رحمتی در کرج جهانشهر: آماده‌سازی نوبت، بهداشت، مراقبت بعد ایمپلنت و لمینت.',
  keywords: 'راهنمای دندانپزشکی کرج, مراقبت بعد ایمپلنت, مراقبت بعد لمینت, نوبت دندانپزشکی جهانشهر',
  image: () => items.value[0]?.coverImage || '/banners/clinic-hero.jpg',
  path: '/guides',
})
</script>

<template>
  <div class="bg-white">
    <!-- Split hero -->
    <SiteReveal variant="fade">
      <section class="relative overflow-hidden bg-[#f4f6f5]">
        <div
          class="pointer-events-none absolute -left-24 top-0 size-[24rem] rounded-full bg-green-deep/15 blur-3xl"
          aria-hidden="true"
        />
        <div
          class="pointer-events-none absolute -right-16 bottom-0 size-[18rem] rounded-full bg-ink/8 blur-3xl"
          aria-hidden="true"
        />

        <div class="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-12 lg:px-8 lg:py-20">
          <div class="lg:col-span-6">
            <p class="text-[11px] font-semibold tracking-[0.24em] text-gold">
              کتابخانه مطالعه
            </p>
            <h1 class="mt-4 text-3xl font-bold tracking-tight text-ink sm:text-5xl sm:leading-[1.2]">
              راهنماهایی برای
              <span class="text-ink-muted">خواندن و آماده‌شدن</span>
            </h1>
            <p class="mt-5 max-w-lg text-[15px] leading-8 text-ink-muted">
              قبل از تماس یا جلسه، مسیر را با راهنماهای کاربردی مرور کنید. در پایین صفحه هم سوالات متداول را می‌بینید.
            </p>
            <div class="mt-8 flex flex-wrap gap-3">
              <span class="rounded-2xl bg-white px-4 py-2 text-sm font-medium text-ink ring-1 ring-mist-deep">
                {{ items.length }} راهنما
              </span>
              <span class="rounded-2xl bg-ink px-4 py-2 text-sm font-medium text-white">
                {{ Math.max(categories.length - 1, 0) }} موضوع
              </span>
              <NuxtLink
                to="/consultation"
                class="rounded-2xl bg-green-deep px-4 py-2 text-sm font-semibold text-ink transition hover:bg-ink hover:text-gold"
              >
                رزرو نوبت
              </NuxtLink>
            </div>
          </div>

          <div class="relative lg:col-span-6">
            <div class="absolute -inset-3 rounded-[2rem] bg-gradient-to-bl from-green-deep/20 to-ink/10 blur-2xl" aria-hidden="true" />
            <div class="relative overflow-hidden rounded-[1.75rem] bg-ink shadow-[0_30px_80px_rgba(6,54,55,0.22)]">
              <div class="relative aspect-[16/11]">
                <img
                  :src="mediaSrc(lead?.coverImage || items[0]?.coverImage || '/banners/clinic-hero.jpg')"
                  alt="راهنماهای مراقبت کلینیک امیر رحمتی"
                  class="size-full object-cover opacity-80"
                  width="960"
                  height="660"
                >
                <div class="absolute inset-0 bg-gradient-to-t from-ink via-ink/25 to-transparent" />
                <div class="absolute inset-x-0 top-0 p-5 sm:p-6">
                  <div class="inline-flex flex-col rounded-2xl bg-white px-4 py-3 shadow-[0_12px_30px_rgba(6,54,55,0.16)]">
                    <p class="text-[11px] font-medium text-ink-muted">مطالعه کوتاه</p>
                    <p class="mt-0.5 text-sm font-semibold text-ink">آماده‌سازی قبل از اقدام</p>
                  </div>
                </div>
                <div class="absolute inset-x-0 bottom-0 p-6 sm:p-7">
                  <p class="text-[11px] tracking-[0.18em] text-gold">امیر رحمتی</p>
                  <p class="mt-2 max-w-sm text-lg font-semibold text-white">
                    از بهداشت روزانه تا آماده‌سازی قبل از درمان
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </SiteReveal>

    <!-- Category filter -->
    <SiteReveal variant="up" delay="30ms">
      <section class="border-y border-mist-deep bg-white">
        <div class="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-4 sm:px-6 lg:flex-wrap lg:overflow-visible lg:px-8">
          <button
            v-for="category in categories"
            :key="category"
            type="button"
            class="shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition"
            :class="activeCategory === category
              ? 'bg-ink text-white'
              : 'bg-[#f4f6f5] text-ink hover:bg-mist'"
            @click="activeCategory = category"
          >
            {{ category }}
          </button>
        </div>
      </section>
    </SiteReveal>

    <SiteReveal variant="up" delay="40ms">
      <section class="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div v-if="loading" class="py-16 text-center text-sm text-ink-muted">
          در حال بارگذاری راهنماها...
        </div>

        <div
          v-else-if="!filtered.length"
          class="rounded-[1.5rem] bg-[#f4f6f5] px-6 py-16 text-center text-ink-muted"
        >
          راهنمایی در این دسته نیست.
        </div>

        <template v-else>
          <div class="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p class="text-[11px] font-semibold tracking-[0.2em] text-gold">فهرست راهنماها</p>
              <h2 class="mt-2 text-2xl font-bold text-ink sm:text-3xl">
                {{ activeCategory === 'همه' ? 'همه راهنماهای کاربردی' : `موضوع «${activeCategory}»` }}
              </h2>
            </div>
            <p class="text-sm text-ink-muted">{{ filtered.length }} مورد</p>
          </div>

          <!-- Featured lead -->
          <NuxtLink
            v-if="lead"
            :to="lead.href"
            class="group mb-6 grid overflow-hidden rounded-[1.75rem] bg-ink shadow-[0_24px_60px_rgba(6,54,55,0.16)] lg:grid-cols-12"
          >
            <div class="relative aspect-[16/11] overflow-hidden lg:col-span-5 lg:aspect-auto lg:min-h-[18rem]">
              <img
                :src="mediaSrc(lead.coverImage)"
                :alt="lead.title"
                class="home-media-shift size-full object-cover opacity-85"
                width="800"
                height="560"
              >
              <div class="absolute inset-0 bg-gradient-to-l from-ink/80 via-transparent to-transparent max-lg:hidden" />
              <div class="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent lg:hidden" />
            </div>
            <div class="flex flex-col justify-center p-7 sm:p-9 lg:col-span-7">
              <div class="flex flex-wrap items-center gap-2 text-[11px] text-white/65">
                <span
                  v-if="lead.category"
                  class="rounded-full bg-gold/15 px-2.5 py-1 font-medium text-gold"
                >
                  {{ lead.category }}
                </span>
                <span>{{ lead.readingMinutes }} دقیقه مطالعه</span>
              </div>
              <h2 class="mt-4 text-2xl font-bold text-white sm:text-3xl">
                {{ lead.title }}
              </h2>
              <p class="mt-4 max-w-xl text-sm leading-8 text-white/70">
                {{ lead.excerpt }}
              </p>
              <span class="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-green-deep">
                مطالعه کامل راهنما
                <span class="h-px w-8 bg-green-deep transition-all group-hover:w-12" aria-hidden="true" />
              </span>
            </div>
          </NuxtLink>

          <!-- Stacked rows -->
          <ul class="space-y-4">
            <li
              v-for="(item, index) in rest"
              :key="item.id"
              class="reveal-item reveal-item-left"
              :style="{ '--reveal-i': index }"
            >
              <NuxtLink
                :to="item.href"
                class="group grid overflow-hidden rounded-[1.5rem] bg-[#f4f6f5] ring-1 ring-mist-deep transition hover:bg-white hover:shadow-[0_22px_50px_rgba(6,54,55,0.1)] hover:ring-gold/35 md:grid-cols-12"
              >
                <div class="relative aspect-[16/10] overflow-hidden md:col-span-4 md:aspect-auto md:min-h-[11rem]">
                  <img
                    :src="mediaSrc(item.coverImage)"
                    :alt="item.title"
                    class="home-media-shift size-full object-cover"
                    width="480"
                    height="300"
                    loading="lazy"
                  >
                  <div class="absolute inset-x-0 bottom-0 flex gap-2 p-3">
                    <span
                      v-if="item.category"
                      class="rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-medium text-ink"
                    >
                      {{ item.category }}
                    </span>
                    <span class="rounded-full bg-ink/85 px-2.5 py-1 text-[11px] font-medium text-gold">
                      {{ item.readingMinutes }} دقیقه
                    </span>
                  </div>
                </div>

                <div class="flex flex-col justify-center gap-4 p-5 sm:flex-row sm:items-center sm:justify-between md:col-span-8 md:p-6">
                  <div class="min-w-0 flex-1">
                    <span class="font-mono text-[11px] font-semibold tracking-widest text-gold">
                      {{ String(index + 2).padStart(2, '0') }}
                    </span>
                    <h2 class="mt-1 text-lg font-bold text-ink transition group-hover:text-green-deep sm:text-xl">
                      {{ item.title }}
                    </h2>
                    <p class="mt-2 line-clamp-2 text-sm leading-7 text-ink-muted">
                      {{ item.excerpt }}
                    </p>
                  </div>
                  <span class="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-ink">
                    مطالعه
                    <span class="inline-flex size-10 items-center justify-center rounded-full bg-ink text-xl leading-none text-white transition group-hover:bg-green-deep group-hover:text-ink">
                      ←
                    </span>
                  </span>
                </div>
              </NuxtLink>
            </li>
          </ul>

          <!-- CTA -->
          <div class="mt-14 grid gap-6 overflow-hidden rounded-[1.75rem] bg-ink p-8 text-white sm:p-10 lg:grid-cols-12 lg:items-center">
            <div class="lg:col-span-8">
              <p class="text-[11px] font-semibold tracking-[0.2em] text-gold">بعد از مطالعه راهنما</p>
              <h2 class="mt-3 text-2xl font-bold sm:text-3xl">
                اگر هنوز سؤال دارید، معاینه مسیر را روشن می‌کند
              </h2>
              <p class="mt-4 max-w-xl text-sm leading-8 text-white/70">
                راهنماها نقطه شروع‌اند؛ برای معاینه می‌توانید نوبت بگیرید.
              </p>
            </div>
            <div class="flex flex-wrap gap-3 lg:col-span-4 lg:justify-end">
              <NuxtLink
                to="/consultation"
                class="inline-flex rounded-2xl bg-green-deep px-5 py-3 text-sm font-semibold text-ink transition hover:bg-white"
              >
                رزرو نوبت
              </NuxtLink>
              <NuxtLink
                to="/practice-areas"
                class="inline-flex rounded-2xl px-5 py-3 text-sm font-medium text-white ring-1 ring-white/25 transition hover:bg-white/10"
              >
                خدمات
              </NuxtLink>
            </div>
          </div>
        </template>
      </section>
    </SiteReveal>
  </div>
</template>
