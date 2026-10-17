<script setup lang="ts">
import { catalogModule } from '~/modules'
import { CatalogItemModel } from '~/modules/catalog/models/index.model'

const catalogDS = catalogModule.store
const mediaSrc = useMediaSrc()
const items = computed(() =>
  catalogDS.getVisibleItems.map((item) => new CatalogItemModel(item)),
)
const loading = computed(() => catalogDS.getLoading && !items.value.length)
const lead = computed(() => items.value[0] ?? null)
const rest = computed(() => items.value.slice(1))

await catalogModule.controller.getCatalogList()

usePageSeo({
  title: 'کاتالوگ دندانپزشکی در کرج | دیجیتال، ایمپلنت، لمینت',
  description:
    'کاتالوگ خدمات کلینیک امیر رحمتی در کرج جهانشهر: دندان پزشکی دیجیتال، ایمپلنت، لمینت و زیبایی با متن کامل و گالری.',
  keywords:
    'کاتالوگ دندانپزشکی کرج, ایمپلنت در کرج, لمینت دندان کرج, دندان پزشکی دیجیتال در کرج',
  image: () => items.value[0]?.primaryImage || '/banners/clinic-hero.jpg',
  path: '/catalog',
})

useSchemaOrg([
  defineWebPage({
    '@type': 'CollectionPage',
    name: 'کاتالوگ دندانپزشکی در کرج | کلینیک امیر رحمتی',
    description:
      'کاتالوگ دندان پزشکی دیجیتال، ایمپلنت و لمینت در کرج جهانشهر — کلینیک امیر رحمتی.',
    url: '/catalog',
  }),
  defineBreadcrumb({
    itemListElement: [
      { name: 'خانه', item: '/' },
      { name: 'کاتالوگ دندانپزشکی کرج', item: '/catalog' },
    ],
  }),
])
</script>

<template>
  <div class="bg-white">
    <!-- Split hero -->
    <SiteReveal variant="fade">
      <section class="relative overflow-hidden bg-[#f4f6f5]">
        <div class="pointer-events-none absolute -right-20 top-10 size-[22rem] rounded-full bg-ink/8 blur-3xl" aria-hidden="true" />
        <div class="mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-12 lg:px-8 lg:py-20">
          <div class="lg:col-span-6">
            <SiteReveal variant="right" delay="40ms">
              <p class="text-[11px] font-semibold tracking-[0.24em] text-gold">قفسه کاتالوگ‌ها</p>
            </SiteReveal>
            <h1 class="mt-4 min-h-[4rem] text-3xl font-bold tracking-tight text-ink sm:min-h-[5rem] sm:text-5xl sm:leading-[1.2]">
              <SiteTypeText
                text="کاتالوگ‌هایی برای خواندن و تصمیم"
                :speed="28"
                :start-delay="120"
                as="span"
              />
            </h1>
            <SiteReveal variant="up" delay="160ms">
              <p class="mt-5 max-w-lg text-[15px] leading-8 text-ink-muted">
                متن کامل، گالری و PDF — هر کاتالوگ قبل از نوبت، تصویر روشنی از خدمت می‌دهد.
              </p>
            </SiteReveal>
            <SiteReveal variant="soft" delay="200ms">
              <div class="mt-8 flex flex-wrap gap-3">
                <span class="rounded-2xl bg-white px-4 py-2 text-sm font-medium text-ink ring-1 ring-mist-deep">
                  {{ items.length }} کاتالوگ
                </span>
                <span class="rounded-2xl bg-ink px-4 py-2 text-sm font-medium text-gold">
                  گالری + PDF
                </span>
                <NuxtLink
                  to="/consultation"
                  class="rounded-2xl bg-green-deep px-4 py-2 text-sm font-semibold text-ink transition hover:bg-ink hover:text-gold"
                >
                  رزرو نوبت
                </NuxtLink>
              </div>
            </SiteReveal>
          </div>

          <SiteReveal variant="left" delay="100ms" class="relative lg:col-span-6">
            <div class="absolute -inset-3 rounded-[2rem] bg-gradient-to-bl from-green-deep/20 to-ink/10 blur-2xl" aria-hidden="true" />
            <div class="absolute -left-2 -top-2 size-9 rounded-br-2xl bg-gold/80" aria-hidden="true" />
            <div
              v-if="lead"
              class="relative overflow-hidden rounded-[1.75rem] bg-ink shadow-[0_30px_80px_rgba(6,54,55,0.22)] ring-1 ring-gold/25"
            >
              <div class="relative aspect-[16/11]">
                <img
                  :src="mediaSrc(lead.coverImage)"
                  :alt="lead.title"
                  class="home-media-shift size-full object-cover opacity-85"
                  width="900"
                  height="620"
                >
                <div class="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
                <div class="absolute inset-x-0 bottom-0 p-6 sm:p-7">
                  <p class="text-[11px] tracking-[0.16em] text-gold">جلد ویژه</p>
                  <p class="mt-2 text-xl font-bold text-white">{{ lead.title }}</p>
                  <NuxtLink
                    :to="lead.href"
                    class="mt-4 inline-flex text-sm font-semibold text-green-deep transition hover:text-gold"
                  >
                    باز کردن این کاتالوگ ←
                  </NuxtLink>
                </div>
              </div>
            </div>
          </SiteReveal>
        </div>
      </section>
    </SiteReveal>

    <SiteReveal variant="up" delay="40ms">
      <section class="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div v-if="loading" class="py-16 text-center text-sm text-ink-muted">
          در حال بارگذاری کاتالوگ...
        </div>

        <template v-else>
          <div class="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p class="text-[11px] font-semibold tracking-[0.2em] text-gold">فهرست کاتالوگ‌ها</p>
              <h2 class="mt-2 text-2xl font-bold text-ink sm:text-3xl">انتخاب مسیر مطالعه</h2>
            </div>
            <p class="text-sm text-ink-muted">{{ items.length }} مورد فعال</p>
          </div>

          <!-- Shelf list: alternating direction per row -->
          <ul class="space-y-5">
            <li
              v-for="(item, index) in (lead ? [lead, ...rest] : rest)"
              :key="item.id"
              class="reveal-item"
              :class="index % 2 === 0 ? 'reveal-item-left' : 'reveal-item-right'"
              :style="{ '--reveal-i': index }"
            >
              <article class="group grid overflow-hidden rounded-[1.6rem] bg-[#f4f6f5] ring-1 ring-mist-deep transition hover:bg-white hover:shadow-[0_24px_55px_rgba(6,54,55,0.1)] hover:ring-gold/35 lg:grid-cols-12">
                <NuxtLink
                  :to="item.href"
                  class="relative overflow-hidden bg-mist lg:col-span-5"
                  :class="index % 2 === 1 ? 'lg:order-2' : ''"
                >
                  <div class="aspect-[16/11] lg:aspect-auto lg:min-h-[15rem]">
                    <img
                      :src="mediaSrc(item.coverImage)"
                      :alt="item.title"
                      class="home-media-shift size-full object-cover"
                      width="800"
                      height="560"
                      loading="lazy"
                    >
                  </div>
                  <div class="absolute inset-x-0 bottom-0 flex flex-wrap gap-2 p-3">
                    <span
                      v-if="item.galleryCount"
                      class="rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-medium text-ink"
                    >
                      {{ item.galleryCount }} تصویر
                    </span>
                    <span class="rounded-full bg-ink/85 px-2.5 py-1 text-[11px] font-medium text-gold">
                      {{ item.readingMinutes }} دقیقه
                    </span>
                  </div>
                </NuxtLink>

                <div
                  class="flex flex-col p-6 sm:p-7 lg:col-span-7 lg:flex-row lg:items-center lg:gap-8"
                  :class="index % 2 === 1 ? 'lg:order-1' : ''"
                >
                  <div class="min-w-0 flex-1">
                    <span class="font-mono text-[11px] font-semibold tracking-widest text-gold">
                      {{ String(index + 1).padStart(2, '0') }}
                    </span>
                    <h2 class="mt-2 text-xl font-bold leading-8 text-ink transition group-hover:text-green-deep sm:text-2xl">
                      <NuxtLink :to="item.href">{{ item.title }}</NuxtLink>
                    </h2>
                    <p class="mt-3 line-clamp-3 text-sm leading-7 text-ink-muted">
                      {{ item.excerpt }}
                    </p>
                    <ul
                      v-if="item.highlights.length"
                      class="mt-4 flex flex-wrap gap-2"
                    >
                      <li
                        v-for="point in item.highlights.slice(0, 3)"
                        :key="point"
                        class="rounded-full bg-white px-3 py-1 text-[11px] text-ink-muted ring-1 ring-mist-deep"
                      >
                        {{ point }}
                      </li>
                    </ul>
                  </div>

                  <div class="mt-5 flex shrink-0 flex-wrap gap-2 lg:mt-0 lg:flex-col">
                    <NuxtLink
                      :to="item.href"
                      class="inline-flex items-center justify-center rounded-2xl bg-ink px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-deep hover:text-ink"
                    >
                      مطالعه کامل
                    </NuxtLink>
                    <a
                      v-for="file in item.pdfs.slice(0, 1)"
                      :key="file.url"
                      :href="mediaSrc(file.url)"
                      target="_blank"
                      rel="noopener"
                      class="inline-flex items-center justify-center rounded-2xl px-5 py-2.5 text-sm font-medium text-ink ring-1 ring-mist-deep transition hover:bg-[#f4f6f5]"
                    >
                      دانلود PDF
                    </a>
                  </div>
                </div>
              </article>
            </li>
          </ul>

          <div class="mt-14 grid gap-6 overflow-hidden rounded-[1.75rem] bg-ink p-8 text-white sm:p-10 lg:grid-cols-12 lg:items-center">
            <div class="lg:col-span-8">
              <p class="text-[11px] font-semibold tracking-[0.2em] text-gold">بعد از مطالعه</p>
              <h2 class="mt-3 text-2xl font-bold sm:text-3xl">
                نیاز درمانی‌تان را با نگاه تخصصی مرور کنیم
              </h2>
              <p class="mt-4 max-w-xl text-sm leading-8 text-white/70">
                اگر کاتالوگ‌ها را خواندید و هنوز سؤال دارید، معاینه اولیه مسیر را روشن می‌کند.
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
