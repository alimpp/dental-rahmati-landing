<script setup lang="ts">
import { portfolioModule } from '~/modules'
import { PortfolioItemModel } from '~/modules/portfolio/models/index.model'
import PortfolioGallery from '~/modules/portfolio/components/PortfolioGallery.vue'
import PortfolioBeforeAfter from '~/modules/portfolio/components/PortfolioBeforeAfter.vue'

const route = useRoute()
const slug = computed(() => String(route.params.slug || ''))

const { data, error } = await useAsyncData(
  () => `portfolio-${slug.value}`,
  async () => {
    const res = await portfolioModule.controller.getPortfolioBySlug(slug.value)
    if (!res.success || !res.data) return null
    return res.data
  },
  { watch: [slug] },
)

if (error.value || !data.value) {
  throw createError({
    statusCode: 404,
    message: 'نمونه کار یافت نشد',
  })
}

const item = computed(() => new PortfolioItemModel(data.value!))
const mediaSrc = useMediaSrc()

const related = computed(() =>
  portfolioModule.store.getVisibleItems
    .filter((entry) => entry.slug !== item.value.slug)
    .slice(0, 3),
)

const siblings = computed(() => {
  const list = portfolioModule.store.getVisibleItems
  const index = list.findIndex((entry) => entry.slug === item.value.slug)
  if (index < 0) return { prev: null, next: null, index: 0, total: list.length }
  return {
    prev: list[index - 1] ?? null,
    next: list[index + 1] ?? null,
    index,
    total: list.length,
  }
})

await portfolioModule.controller.getPortfolioList()

usePageSeo({
  title: () => `${item.value.title} | نمونه کار ${item.value.treatment || 'دندانپزشکی'}`,
  description: () => item.value.description,
  keywords: () =>
    `نمونه کار ${item.value.treatment}, قبل و بعد ${item.value.treatment}, کلینیک امیر رحمتی`,
  image: () => item.value.cover,
  path: () => item.value.href,
  type: 'website',
})

useSchemaOrg([
  defineWebPage({
    '@type': 'MedicalWebPage',
    name: () => item.value.title,
    description: () => item.value.description,
    url: () => item.value.href,
  }),
  defineBreadcrumb({
    itemListElement: [
      { name: 'خانه', item: '/' },
      { name: 'نمونه کارها', item: '/portfolio' },
      { name: () => item.value.title, item: () => item.value.href },
    ],
  }),
])
</script>

<template>
  <article class="bg-surface">
    <SiteReveal variant="fade">
      <header class="border-b border-mist-deep bg-mist">
        <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          <NuxtLink
            to="/portfolio"
            class="inline-flex items-center gap-2 text-sm font-medium text-ink-muted transition hover:text-ink"
          >
            <span class="inline-flex size-9 items-center justify-center rounded-full bg-panel text-lg leading-none ring-1 ring-mist-deep">←</span>
            همه نمونه کارها
          </NuxtLink>

          <div class="mt-8 flex flex-wrap items-center gap-2">
            <span
              v-if="item.treatment"
              class="rounded-md bg-green-deep px-3 py-1 text-[11px] font-semibold text-on-primary"
            >
              {{ item.treatment }}
            </span>
            <span class="rounded-md bg-panel px-3 py-1 text-[11px] text-ink ring-1 ring-mist-deep">
              {{ item.displayPatient }}
            </span>
            <span class="text-[11px] text-ink-muted">
              کیس {{ siblings.index + 1 }} از {{ siblings.total || '—' }}
            </span>
          </div>

          <h1 class="mt-4 max-w-3xl text-3xl font-bold tracking-tight text-ink sm:text-4xl sm:leading-[1.2]">
            <SiteTypeText
              :key="item.slug"
              as="span"
              :text="item.title"
              :speed="28"
              :start-delay="80"
            />
          </h1>
          <p class="mt-4 max-w-2xl text-[15px] leading-8 text-ink-muted">
            {{ item.description }}
          </p>
        </div>
      </header>
    </SiteReveal>

    <div class="mx-auto max-w-7xl space-y-14 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <SiteReveal v-if="item.hasBeforeAfter" variant="zoom" delay="20ms">
        <section>
          <div class="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p class="text-[11px] font-semibold tracking-[0.18em] text-gold">مقایسه بصری</p>
              <h2 class="mt-2 text-2xl font-bold text-ink">قبل و بعد درمان</h2>
            </div>
            <p class="text-xs text-ink-muted">خط وسط را بکشید</p>
          </div>
          <PortfolioBeforeAfter
            :before-src="item.beforeImage!"
            :after-src="item.afterImage!"
            :before-alt="`قبل — ${item.title}`"
            :after-alt="`بعد — ${item.title}`"
          />
        </section>
      </SiteReveal>

      <SiteReveal variant="up" delay="30ms">
        <section class="grid gap-8 lg:grid-cols-12 lg:gap-12">
          <div class="lg:col-span-5">
            <p class="text-[11px] font-semibold tracking-[0.18em] text-gold">شرح کیس</p>
            <h2 class="mt-2 text-2xl font-bold text-ink">مسیر درمان این بیمار</h2>
            <p class="mt-4 text-[15px] leading-8 text-ink-muted">
              {{ item.description }}
            </p>
            <ul class="mt-6 space-y-3 text-sm text-ink">
              <li class="flex gap-2">
                <span class="mt-2 size-1.5 shrink-0 rounded-full bg-gold" />
                <span><strong class="font-semibold">خدمت:</strong> {{ item.treatment || '—' }}</span>
              </li>
              <li class="flex gap-2">
                <span class="mt-2 size-1.5 shrink-0 rounded-full bg-gold" />
                <span><strong class="font-semibold">بیمار:</strong> {{ item.displayPatient }} (هویت محفوظ)</span>
              </li>
            </ul>
            <div class="mt-8 flex flex-wrap gap-3">
              <NuxtLink
                to="/consultation"
                class="inline-flex rounded-xl bg-green-deep px-5 py-3 text-sm font-bold text-on-primary transition hover:brightness-110"
              >
                مشاوره مشابه این کیس
              </NuxtLink>
              <a
                v-if="item.gallery.length"
                href="#gallery"
                class="inline-flex rounded-xl px-5 py-3 text-sm font-medium text-ink ring-1 ring-mist-deep transition hover:bg-mist"
              >
                گالری تصاویر
              </a>
            </div>
          </div>

          <div class="lg:col-span-7">
            <div class="overflow-hidden rounded-[1.5rem] bg-band shadow-[0_28px_70px_rgba(6,54,55,0.18)] ring-1 ring-gold/20">
              <div class="relative aspect-[16/11]">
                <img
                  :src="mediaSrc(item.cover)"
                  :alt="item.title"
                  class="size-full object-cover opacity-90"
                  width="960"
                  height="660"
                >
                <div class="absolute inset-0 bg-gradient-to-t from-band via-transparent to-transparent" />
                <div class="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                  <p class="text-[11px] tracking-[0.16em] text-gold">نتیجه درمان</p>
                  <p class="mt-1 text-lg font-semibold text-on-band">{{ item.title }}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </SiteReveal>

      <SiteReveal v-if="item.gallery.length" variant="clip" delay="40ms">
        <PortfolioGallery
          :images="item.gallery"
          title="عکس‌های دندان و جزئیات کیس"
        />
      </SiteReveal>

      <SiteReveal variant="soft" delay="20ms">
        <nav class="grid gap-3 border-y border-mist-deep py-6 sm:grid-cols-2" aria-label="کیس‌های مجاور">
          <NuxtLink
            v-if="siblings.prev"
            :to="siblings.prev.href"
            class="group flex items-center gap-4 rounded-2xl bg-mist p-4 ring-1 ring-mist-deep transition hover:bg-panel hover:ring-gold/35"
          >
            <span class="text-ink-muted" aria-hidden="true">→</span>
            <span class="min-w-0">
              <span class="block text-[11px] tracking-[0.16em] text-gold">قبلی</span>
              <span class="mt-1 block truncate text-sm font-semibold text-ink">{{ siblings.prev.title }}</span>
            </span>
          </NuxtLink>
          <div v-else class="hidden sm:block" />
          <NuxtLink
            v-if="siblings.next"
            :to="siblings.next.href"
            class="group flex items-center justify-end gap-4 rounded-2xl bg-mist p-4 ring-1 ring-mist-deep transition hover:bg-panel hover:ring-gold/35"
          >
            <span class="min-w-0 text-left">
              <span class="block text-[11px] tracking-[0.16em] text-gold">بعدی</span>
              <span class="mt-1 block truncate text-sm font-semibold text-ink">{{ siblings.next.title }}</span>
            </span>
            <span class="text-ink-muted" aria-hidden="true">←</span>
          </NuxtLink>
        </nav>
      </SiteReveal>

      <SiteReveal v-if="related.length" variant="up" delay="40ms">
        <section>
          <p class="text-[11px] font-semibold tracking-[0.18em] text-gold">کیس‌های مشابه</p>
          <h2 class="mt-2 text-2xl font-bold text-ink">نمونه‌های دیگر</h2>
          <ul class="mt-6 grid gap-4 sm:grid-cols-3">
            <li
              v-for="(entry, index) in related"
              :key="entry.id"
              class="reveal-item reveal-item-scale"
              :style="{ '--reveal-i': index }"
            >
              <NuxtLink
                :to="entry.href"
                class="group block overflow-hidden rounded-[1.25rem] bg-mist ring-1 ring-mist-deep transition hover:-translate-y-1 hover:ring-gold/40"
              >
                <div class="relative aspect-[16/11] overflow-hidden">
                  <img
                    :src="mediaSrc(entry.cover)"
                    :alt="entry.title"
                    class="size-full object-cover transition duration-700 group-hover:scale-105"
                    width="480"
                    height="330"
                    loading="lazy"
                  >
                  <span
                    v-if="entry.treatment"
                    class="absolute bottom-3 right-3 rounded-md bg-panel/95 px-2 py-1 text-[10px] font-semibold text-ink"
                  >
                    {{ entry.treatment }}
                  </span>
                </div>
                <div class="p-4">
                  <h3 class="text-sm font-semibold text-ink group-hover:text-green-deep">{{ entry.title }}</h3>
                  <p class="mt-1 text-[11px] text-ink-muted">{{ entry.displayPatient }}</p>
                </div>
              </NuxtLink>
            </li>
          </ul>
        </section>
      </SiteReveal>
    </div>
  </article>
</template>
