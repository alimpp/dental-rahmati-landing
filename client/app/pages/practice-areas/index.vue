<script setup lang="ts">
import { serviceModule } from '~/modules'
import { SEO_PAGES } from '~/data/seo'

const serviceDS = serviceModule.store
const serviceController = serviceModule.controller
const items = computed(() => serviceDS.getVisibleItems)
const mediaSrc = useMediaSrc()
const loading = computed(() => serviceDS.getLoading)
const lead = computed(() => items.value[0] ?? null)
const rest = computed(() => items.value.slice(1))

await serviceController.getServiceList()

usePageSeo({
  title: SEO_PAGES.services.title,
  description: SEO_PAGES.services.description,
  keywords: SEO_PAGES.services.keywords,
  path: '/practice-areas',
  image: '/services/covers/svc-cosmetic.jpg',
})

useSchemaOrg([
  defineBreadcrumb({
    itemListElement: [
      { name: 'خانه', item: '/' },
      { name: 'خدمات دندان پزشکی دیجیتال', item: '/practice-areas' },
    ],
  }),
])
</script>

<template>
  <div class="max-w-full bg-surface">
    <!-- Split hero -->
    <SiteReveal variant="fade">
      <section class="relative overflow-hidden bg-mist">
        <div
          class="pointer-events-none absolute -left-24 top-0 size-[24rem] rounded-full bg-green-deep/15 blur-3xl"
          aria-hidden="true"
        />
        <div
          class="pointer-events-none absolute -right-16 bottom-0 size-[18rem] rounded-full bg-band/8 blur-3xl"
          aria-hidden="true"
        />

        <div class="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-12 lg:px-8 lg:py-20">
          <div class="lg:col-span-6">
            <p class="text-[11px] font-semibold tracking-[0.24em] text-gold">
              خدمات کلینیک
            </p>
            <h1 class="mt-4 text-3xl font-bold tracking-tight text-ink sm:text-5xl sm:leading-[1.2]">
              {{ SEO_PAGES.services.h1 }}
            </h1>
            <p class="mt-5 max-w-lg text-[15px] leading-8 text-ink-muted">
              ایمپلنت دیجیتال، لمینت، کامپوزیت و طراحی لبخند با دکتر امیر رحمتی — درمان دقیق و قابل پیش‌بینی.
            </p>
            <div class="mt-8 flex flex-wrap gap-3">
              <span class="rounded-2xl bg-panel px-4 py-2 text-sm font-medium text-ink ring-1 ring-mist-deep">
                {{ items.length }} خدمت فعال
              </span>
              <NuxtLink
                to="/consultation"
                class="rounded-2xl bg-band px-4 py-2 text-sm font-semibold text-on-band transition hover:bg-green-deep hover:text-on-primary"
              >
                رزرو نوبت
              </NuxtLink>
              <NuxtLink
                to="/articles"
                class="rounded-2xl px-4 py-2 text-sm font-medium text-ink ring-1 ring-mist-deep transition hover:bg-panel"
              >
                مقالات
              </NuxtLink>
            </div>
          </div>

          <div class="relative lg:col-span-6">
            <div class="absolute -inset-3 rounded-[2rem] bg-gradient-to-bl from-green-deep/20 to-band/10 blur-2xl" aria-hidden="true" />
            <div class="relative overflow-hidden rounded-[1.75rem] bg-band shadow-[0_30px_80px_rgba(6,54,55,0.22)]">
              <div class="relative aspect-[16/11]">
                <img
                  src="/services/hero.jpg"
                  alt="خدمات دندان پزشکی دیجیتال، ایمپلنت و لمینت در کلینیک دکتر امیر رحمتی کرج"
                  class="size-full object-cover opacity-80"
                  width="960"
                  height="660"
                >
                <div class="absolute inset-0 bg-gradient-to-t from-band via-band/25 to-transparent" />
                <div class="absolute inset-x-0 top-0 p-5 sm:p-6">
                  <div class="inline-flex flex-col rounded-2xl bg-panel px-4 py-3 shadow-[0_12px_30px_rgba(6,54,55,0.16)]">
                    <p class="text-[11px] font-medium text-ink-muted">تخصص واقعی</p>
                    <p class="mt-0.5 text-sm font-semibold text-ink">هر خدمت، با برنامه درمانی شفاف</p>
                  </div>
                </div>
                <div class="absolute inset-x-0 bottom-0 p-6 sm:p-7">
                  <p class="text-[11px] tracking-[0.18em] text-gold">دکتر امیر رحمتی</p>
                  <p class="mt-2 max-w-sm text-lg font-semibold text-on-band">
                    دندان پزشکی دیجیتال، ایمپلنت دیجیتال، لمینت و کامپوزیت
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </SiteReveal>

    <SiteReveal variant="up" delay="40ms">
      <section class="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div v-if="loading && !items.length" class="py-20 text-center text-ink-muted">
          در حال بارگذاری...
        </div>

        <div
          v-else-if="!items.length"
          class="rounded-[1.5rem] bg-mist px-6 py-16 text-center text-ink-muted"
        >
          خدمتی برای نمایش وجود ندارد.
        </div>

        <template v-else>
          <div class="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p class="text-[11px] font-semibold tracking-[0.2em] text-gold">فهرست خدمات</p>
              <h2 class="mt-2 text-2xl font-bold text-ink sm:text-3xl">
                خدمت مورد نیاز خود را انتخاب کنید
              </h2>
            </div>
            <p class="text-sm text-ink-muted">{{ items.length }} مورد</p>
          </div>

          <!-- Featured lead: full-bleed photo + text overlay -->
          <NuxtLink
            v-if="lead"
            :to="lead.href"
            class="group relative mb-6 flex min-h-[18rem] overflow-hidden rounded-[1.75rem] bg-band shadow-[0_24px_60px_rgba(6,54,55,0.16)] sm:min-h-[20rem] lg:min-h-[22rem]"
          >
            <img
              :src="mediaSrc(lead.coverSrc)"
              :alt="lead.title"
              class="absolute inset-0 size-full object-cover object-center transition duration-700 group-hover:scale-[1.04]"
              width="1200"
              height="700"
            >
            <div class="absolute inset-0 bg-gradient-to-t from-band via-band/50 to-band/15" />
            <div class="relative z-10 mt-auto flex w-full flex-col p-7 sm:p-9 lg:max-w-3xl">
              <p class="text-[11px] font-medium tracking-[0.16em] text-gold">خدمت ویژه</p>
              <h2 class="mt-2 text-2xl font-bold text-on-band sm:text-3xl">
                {{ lead.title }}
              </h2>
              <p class="mt-4 max-w-xl text-sm leading-8 text-on-band/80">
                {{ lead.description }}
              </p>
              <span class="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-gold">
                جزئیات این خدمت
                <span class="h-px w-8 bg-gold transition-all group-hover:w-12" aria-hidden="true" />
              </span>
            </div>
          </NuxtLink>

          <!-- Photo cards with text overlay -->
          <ul class="grid gap-4 sm:grid-cols-2">
            <li
              v-for="(item, index) in rest"
              :key="item.id"
              class="reveal-item reveal-item-left"
              :style="{ '--reveal-i': index }"
            >
              <NuxtLink
                :to="item.href"
                class="group relative flex min-h-[16rem] overflow-hidden rounded-[1.5rem] bg-band sm:min-h-[17.5rem]"
              >
                <img
                  :src="mediaSrc(item.coverSrc)"
                  :alt="item.title"
                  class="absolute inset-0 size-full object-cover object-center transition duration-700 group-hover:scale-[1.05]"
                  width="800"
                  height="560"
                  loading="lazy"
                >
                <div class="absolute inset-0 bg-gradient-to-t from-band via-band/55 to-band/10" />
                <div class="relative z-10 mt-auto flex w-full flex-col p-5 sm:p-6">
                  <span class="font-mono text-[11px] font-semibold tracking-widest text-gold">
                    {{ String(index + 2).padStart(2, '0') }}
                  </span>
                  <h2 class="mt-1 text-lg font-bold text-on-band sm:text-xl">
                    {{ item.title }}
                  </h2>
                  <p class="mt-2 line-clamp-2 max-w-xl text-sm leading-7 text-on-band/80">
                    {{ item.description }}
                  </p>
                  <span class="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-gold">
                    مشاهده
                    <span
                      class="inline-flex size-9 items-center justify-center rounded-full bg-white/15 text-lg leading-none text-on-band transition group-hover:bg-green-deep group-hover:text-on-primary"
                    >
                      ←
                    </span>
                  </span>
                </div>
              </NuxtLink>
            </li>
          </ul>

          <!-- CTA band -->
          <div class="mt-14 grid gap-6 overflow-hidden rounded-[1.75rem] bg-band p-8 text-on-band sm:p-10 lg:grid-cols-12 lg:items-center">
            <div class="lg:col-span-8">
              <p class="text-[11px] font-semibold tracking-[0.2em] text-gold">مطمئن نیستید کدام خدمت؟</p>
              <h2 class="mt-3 text-2xl font-bold sm:text-3xl">
                در ویزیت اول، مسیر درست را مشخص می‌کنیم
              </h2>
              <p class="mt-4 max-w-xl text-sm leading-8 text-on-band/70">
                اگر بین چند گزینه مردد هستید، کافی است علائم را کوتاه بگویید تا خدمت و گام بعدی روشن شود.
              </p>
            </div>
            <div class="flex flex-wrap gap-3 lg:col-span-4 lg:justify-end">
              <NuxtLink
                to="/consultation"
                class="inline-flex rounded-2xl bg-green-deep px-5 py-3 text-sm font-semibold text-on-primary transition hover:bg-panel hover:text-ink"
              >
                رزرو نوبت
              </NuxtLink>
              <NuxtLink
                to="/guides"
                class="inline-flex rounded-2xl px-5 py-3 text-sm font-medium text-on-band ring-1 ring-white/25 transition hover:bg-white/10"
              >
                راهنماها
              </NuxtLink>
            </div>
          </div>
        </template>
      </section>
    </SiteReveal>
  </div>
</template>
