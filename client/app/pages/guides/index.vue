<script setup lang="ts">
import { guideModule } from '~/modules'
import { GuideModel } from '~/modules/guide/models/index.model'

const mediaSrc = useMediaSrc()
const guideDS = guideModule.store
const items = computed(() =>
  guideDS.getVisibleItems.map(item => new GuideModel(item)),
)
const loading = computed(() => guideDS.getLoading && !items.value.length)
const categories = computed(() => {
  const set = new Set(items.value.map(item => item.category).filter(Boolean) as string[])
  return ['همه', ...set]
})
const activeCategory = ref('همه')
const filtered = computed(() => {
  if (activeCategory.value === 'همه') return items.value
  return items.value.filter(item => item.category === activeCategory.value)
})

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
  <div class="bg-surface">
    <SiteReveal variant="fade">
      <section class="relative overflow-hidden border-b border-mist-deep">
        <div
          class="pointer-events-none absolute inset-0 bg-gradient-to-bl from-green-soft/50 via-surface to-mist/80"
          aria-hidden="true"
        />
        <div
          class="pointer-events-none absolute -left-20 top-0 size-[22rem] rounded-full bg-green-deep/10 blur-3xl"
          aria-hidden="true"
        />

        <div class="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          <p class="text-[11px] font-semibold tracking-[0.22em] text-gold">
            راهنماها
          </p>
          <h1 class="mt-4 max-w-2xl text-3xl font-bold tracking-tight text-ink sm:text-5xl sm:leading-[1.15]">
            کلینیک امیر رحمتی
            <span class="mt-1 block text-ink-muted sm:mt-2">قبل از درمان، کوتاه و کاربردی بخوانید</span>
          </h1>
          <p class="mt-5 max-w-xl text-[15px] leading-8 text-ink-muted">
            آماده‌سازی نوبت، بهداشت روزانه و مراقبت بعد از درمان — بدون شعار اضافه.
          </p>
          <div class="mt-8 flex flex-wrap items-center gap-3">
            <NuxtLink
              to="/consultation"
              class="inline-flex rounded-xl bg-green-deep px-5 py-2.5 text-sm font-bold tracking-wide text-on-primary shadow-[0_8px_22px_rgba(15,118,110,0.3)] ring-1 ring-white/20 transition hover:brightness-110"
            >
              رزرو نوبت
            </NuxtLink>
            <a
              href="#guides-list"
              class="inline-flex rounded-xl px-5 py-2.5 text-sm font-medium text-ink ring-1 ring-mist-deep transition hover:bg-mist"
            >
              مشاهده فهرست
            </a>
            <p class="text-sm text-ink-muted">
              {{ items.length }} راهنما
            </p>
          </div>
        </div>
      </section>
    </SiteReveal>

    <SiteReveal variant="up" delay="20ms">
      <section
        id="guides-list"
        class="scroll-mt-24 mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8"
      >
        <div
          v-if="categories.length > 1"
          class="mb-8 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <button
            v-for="category in categories"
            :key="category"
            type="button"
            class="shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition"
            :class="activeCategory === category
              ? 'bg-green-deep text-on-primary'
              : 'bg-mist text-ink hover:bg-panel ring-1 ring-mist-deep'"
            @click="activeCategory = category"
          >
            {{ category }}
          </button>
        </div>

        <div
          v-if="loading"
          class="py-16 text-center text-sm text-ink-muted"
        >
          در حال بارگذاری راهنماها...
        </div>

        <div
          v-else-if="!filtered.length"
          class="rounded-2xl bg-mist px-6 py-14 text-center text-ink-muted ring-1 ring-mist-deep"
        >
          راهنمایی در این دسته نیست.
        </div>

        <ul
          v-else
          class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          <li
            v-for="(item, index) in filtered"
            :key="item.id"
          >
            <NuxtLink
              :to="item.href"
              class="group flex h-full flex-col overflow-hidden rounded-2xl bg-panel ring-1 ring-mist-deep transition hover:-translate-y-0.5 hover:ring-gold/40"
            >
              <div class="relative aspect-[16/10] overflow-hidden bg-mist">
                <img
                  :src="mediaSrc(item.coverImage)"
                  :alt="item.title"
                  class="size-full object-cover transition duration-500 group-hover:scale-[1.03]"
                  width="640"
                  height="400"
                  :loading="index < 3 ? 'eager' : 'lazy'"
                >
                <div class="absolute inset-0 bg-gradient-to-t from-band/50 via-transparent to-transparent" />
                <div class="absolute inset-x-0 bottom-0 flex flex-wrap gap-1.5 p-3">
                  <span
                    v-if="item.category"
                    class="rounded-md bg-panel/95 px-2.5 py-1 text-[11px] font-medium text-ink"
                  >
                    {{ item.category }}
                  </span>
                  <span class="rounded-md bg-band/85 px-2.5 py-1 text-[11px] font-medium text-on-band">
                    {{ item.readingMinutes }} دقیقه
                  </span>
                </div>
              </div>

              <div class="flex flex-1 flex-col p-5">
                <h2 class="line-clamp-2 text-lg font-bold leading-8 text-ink transition group-hover:text-green-deep">
                  {{ item.title }}
                </h2>
                <p class="mt-2 line-clamp-3 flex-1 text-sm leading-7 text-ink-muted">
                  {{ item.excerpt }}
                </p>
                <span class="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-green-deep">
                  مطالعه
                  <span
                    class="h-px w-8 bg-gold transition-all group-hover:w-12"
                    aria-hidden="true"
                  />
                </span>
              </div>
            </NuxtLink>
          </li>
        </ul>

        <div class="mt-14 overflow-hidden rounded-2xl bg-band px-6 py-8 text-on-band sm:px-8 sm:py-10 lg:flex lg:items-center lg:justify-between lg:gap-8">
          <div class="max-w-xl">
            <p class="text-[11px] font-semibold tracking-[0.18em] text-gold">
              قدم بعدی
            </p>
            <h2 class="mt-2 text-xl font-bold sm:text-2xl">
              اگر سؤال باقی ماند، معاینه مسیر را مشخص می‌کند
            </h2>
          </div>
          <div class="mt-6 flex flex-wrap gap-3 lg:mt-0 lg:shrink-0">
            <NuxtLink
              to="/consultation"
              class="inline-flex rounded-xl bg-green-deep px-5 py-2.5 text-sm font-bold tracking-wide text-on-primary transition hover:brightness-110"
            >
              رزرو نوبت
            </NuxtLink>
            <NuxtLink
              to="/practice-areas"
              class="inline-flex rounded-xl px-5 py-2.5 text-sm font-medium text-on-band ring-1 ring-on-band/25 transition hover:bg-on-band/10"
            >
              خدمات
            </NuxtLink>
          </div>
        </div>
      </section>
    </SiteReveal>
  </div>
</template>
