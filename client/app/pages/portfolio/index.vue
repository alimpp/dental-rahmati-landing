<script setup lang="ts">
import { portfolioModule } from '~/modules'
import { PortfolioItemModel } from '~/modules/portfolio/models/index.model'
import PortfolioBeforeAfter from '~/modules/portfolio/components/PortfolioBeforeAfter.vue'

const portfolioDS = portfolioModule.store
const mediaSrc = useMediaSrc()
const items = computed(() =>
  portfolioDS.getVisibleItems.map((item) => new PortfolioItemModel(item)),
)
const loading = computed(() => portfolioDS.getLoading && !items.value.length)

const treatments = computed(() => {
  const set = new Set(items.value.map(item => item.treatment).filter(Boolean))
  return ['همه', ...set]
})
const activeTreatment = ref('همه')
const filtered = computed(() => {
  if (activeTreatment.value === 'همه') return items.value
  return items.value.filter(item => item.treatment === activeTreatment.value)
})

await portfolioModule.controller.getPortfolioList()

usePageSeo({
  title: 'نمونه کارهای دندانپزشکی | قبل و بعد درمان کلینیک امیر رحمتی',
  description:
    'نمونه کارهای واقعی بیماران کلینیک امیر رحمتی در کرج: لمینت، ایمپلنت، زیبایی و ارتودنسی با عکس قبل و بعد.',
  keywords:
    'نمونه کار دندانپزشکی کرج, قبل و بعد لمینت, نمونه کار ایمپلنت کرج, لبخند بیماران امیر رحمتی',
  image: () => items.value[0]?.cover || '/clinic/06-vip.jpg',
  path: '/portfolio',
})

useSchemaOrg([
  defineWebPage({
    '@type': 'CollectionPage',
    name: 'نمونه کارهای بیماران کلینیک امیر رحمتی',
    description:
      'گالری قبل و بعد درمان‌های دندانپزشکی کلینیک امیر رحمتی در کرج جهانشهر.',
    url: '/portfolio',
  }),
  defineBreadcrumb({
    itemListElement: [
      { name: 'خانه', item: '/' },
      { name: 'نمونه کارها', item: '/portfolio' },
    ],
  }),
])
</script>

<template>
  <div class="bg-surface">
    <SiteReveal variant="fade">
      <section class="relative isolate overflow-hidden bg-band text-on-band">
        <img
          v-if="items[0]"
          :src="mediaSrc(items[0].cover)"
          alt=""
          class="portfolio-hero-media absolute inset-0 size-full object-cover opacity-35"
          width="1920"
          height="900"
        >
        <div class="absolute inset-0 bg-gradient-to-t from-band via-band/80 to-band/50" />
        <div
          class="pointer-events-none absolute -left-20 top-1/4 size-[24rem] rounded-full bg-green-deep/30 blur-3xl"
          aria-hidden="true"
        />

        <div class="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <p class="text-[11px] font-semibold tracking-[0.28em] text-gold">
            کلینیک امیر رحمتی
          </p>
          <h1 class="mt-4 max-w-3xl text-3xl font-bold tracking-tight sm:text-5xl sm:leading-[1.12]">
            <SiteTypeText
              text="نمونه کارهای واقعی بیماران"
              :speed="32"
              :start-delay="80"
              as="span"
            />
          </h1>
          <p class="mt-5 max-w-xl text-[15px] leading-8 text-on-band/75">
            لبخندهایی که در کلینیک ساخته شده‌اند — عکس دندان و نتیجه درمان، با توضیح کوتاه هر کیس.
            هویت بیماران محرمانه می‌ماند.
          </p>
          <div class="mt-8 flex flex-wrap gap-3">
            <a
              href="#cases"
              class="inline-flex rounded-xl bg-green-deep px-5 py-3 text-sm font-bold tracking-wide text-on-primary shadow-[0_10px_28px_rgba(15,118,110,0.4)] ring-1 ring-white/20 transition hover:brightness-110"
            >
              مشاهده کیس‌ها
            </a>
            <NuxtLink
              to="/consultation"
              class="inline-flex rounded-xl px-5 py-3 text-sm font-medium text-on-band ring-1 ring-on-band/25 transition hover:bg-on-band/10"
            >
              مشاوره برای کیس مشابه
            </NuxtLink>
          </div>
        </div>
      </section>
    </SiteReveal>

    <section id="cases" class="scroll-mt-24 mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <SiteReveal variant="up" delay="20ms">
        <div class="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p class="text-[11px] font-semibold tracking-[0.2em] text-gold">قبل و بعد</p>
            <h2 class="mt-2 text-2xl font-bold text-ink sm:text-3xl">کیس‌های درمان‌شده</h2>
          </div>
          <p class="text-sm text-ink-muted">{{ filtered.length }} مورد</p>
        </div>

        <div
          v-if="treatments.length > 1"
          class="mt-8 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <button
            v-for="treatment in treatments"
            :key="treatment"
            type="button"
            class="shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition"
            :class="activeTreatment === treatment
              ? 'bg-green-deep text-on-primary'
              : 'bg-mist text-ink ring-1 ring-mist-deep hover:bg-panel'"
            @click="activeTreatment = treatment"
          >
            {{ treatment }}
          </button>
        </div>
      </SiteReveal>

      <div v-if="loading" class="py-20 text-center text-sm text-ink-muted">
        در حال بارگذاری نمونه کارها...
      </div>

      <ul
        v-else
        class="mt-10 grid gap-8 sm:grid-cols-2"
      >
        <li
          v-for="(item, index) in filtered"
          :key="item.id"
        >
          <SiteReveal :variant="index % 2 === 0 ? 'left' : 'right'" delay="30ms">
            <article class="group overflow-hidden rounded-[1.5rem] bg-mist ring-1 ring-mist-deep transition hover:ring-gold/40 hover:shadow-[0_24px_55px_rgba(6,54,55,0.1)]">
              <NuxtLink :to="item.href" class="block">
                <PortfolioBeforeAfter
                  v-if="item.hasBeforeAfter"
                  :before-src="item.beforeImage!"
                  :after-src="item.afterImage!"
                  size="card"
                  :before-alt="`قبل — ${item.title}`"
                  :after-alt="`بعد — ${item.title}`"
                />
                <div
                  v-else
                  class="relative aspect-[16/11] overflow-hidden"
                >
                  <img
                    :src="mediaSrc(item.cover)"
                    :alt="item.title"
                    class="size-full object-cover transition duration-700 group-hover:scale-105"
                    width="800"
                    height="550"
                    loading="lazy"
                  >
                </div>
              </NuxtLink>

              <div class="p-5 sm:p-6">
                <div class="flex flex-wrap items-center gap-2">
                  <span
                    v-if="item.treatment"
                    class="rounded-md bg-panel px-2.5 py-1 text-[11px] font-semibold text-green-deep ring-1 ring-mist-deep"
                  >
                    {{ item.treatment }}
                  </span>
                  <span class="text-[11px] text-ink-muted">
                    {{ item.displayPatient }}
                  </span>
                </div>
                <h3 class="mt-3 text-xl font-bold leading-8 text-ink transition group-hover:text-green-deep">
                  <NuxtLink :to="item.href">{{ item.title }}</NuxtLink>
                </h3>
                <p class="mt-2 line-clamp-3 text-sm leading-7 text-ink-muted">
                  {{ item.description }}
                </p>
                <NuxtLink
                  :to="item.href"
                  class="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-green-deep"
                >
                  جزئیات کیس
                  <span class="h-px w-8 bg-gold transition-all group-hover:w-12" aria-hidden="true" />
                </NuxtLink>
              </div>
            </article>
          </SiteReveal>
        </li>
      </ul>

      <SiteReveal variant="bloom" delay="40ms">
        <div class="mt-14 overflow-hidden rounded-[1.75rem] bg-band px-6 py-10 text-on-band sm:px-10">
          <div class="grid gap-6 lg:grid-cols-12 lg:items-center">
            <div class="lg:col-span-8">
              <p class="text-[11px] font-semibold tracking-[0.2em] text-gold">کیس شما</p>
              <h2 class="mt-3 text-2xl font-bold sm:text-3xl">
                نتیجه‌ای شبیه این نمونه‌ها می‌خواهید؟
              </h2>
              <p class="mt-4 max-w-xl text-sm leading-8 text-on-band/70">
                در مشاوره اولیه، وضعیت فعلی دندان‌ها بررسی می‌شود و مسیر درمان شفاف توضیح داده می‌شود.
              </p>
            </div>
            <div class="flex flex-wrap gap-3 lg:col-span-4 lg:justify-end">
              <NuxtLink
                to="/consultation"
                class="inline-flex rounded-xl bg-green-deep px-5 py-3 text-sm font-bold text-on-primary transition hover:brightness-110"
              >
                رزرو مشاوره
              </NuxtLink>
              <NuxtLink
                to="/practice-areas"
                class="inline-flex rounded-xl px-5 py-3 text-sm font-medium text-on-band ring-1 ring-on-band/25 transition hover:bg-on-band/10"
              >
                خدمات
              </NuxtLink>
            </div>
          </div>
        </div>
      </SiteReveal>
    </section>
  </div>
</template>

<style scoped>
.portfolio-hero-media {
  animation: portfolio-kenburns 18s ease-out forwards;
}
@keyframes portfolio-kenburns {
  from { transform: scale(1); }
  to { transform: scale(1.08); }
}
@media (prefers-reduced-motion: reduce) {
  .portfolio-hero-media { animation: none; }
}
</style>
