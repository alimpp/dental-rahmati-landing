<script setup lang="ts">
import { articleModule } from '~/modules'

const articleDS = articleModule.store
const mediaSrc = useMediaSrc()
const route = useRoute()
const router = useRouter()

const page = computed(() => {
  const raw = Number(route.query.page || 1)
  return Number.isFinite(raw) && raw > 0 ? raw : 1
})

const category = computed(() => String(route.query.category || '').trim())
const items = computed(() => articleDS.getVisibleItems)
const loading = computed(() => articleDS.getLoading)
const pageCount = computed(() => articleDS.getPageCount)
const total = computed(() => articleDS.getTotal)
const categories = computed(() => articleDS.getCategories)
const pages = computed(() =>
  Array.from({ length: pageCount.value }, (_, index) => index + 1),
)
const allCount = computed(() =>
  categories.value.reduce((sum, entry) => sum + entry.count, 0),
)
const lead = computed(() => (page.value === 1 && !category.value ? items.value[0] : null))
const gridItems = computed(() => {
  if (lead.value) return items.value.slice(1)
  return items.value
})

function listQuery(nextPage = page.value, nextCategory = category.value) {
  return {
    page: nextPage,
    limit: 9,
    category: nextCategory || undefined,
  }
}

await Promise.all([
  articleModule.controller.getArticleCategories(),
  articleModule.controller.getArticleList(listQuery()),
])

watch(
  [page, category],
  ([nextPage, nextCategory]) => {
    articleModule.controller.getArticleList(listQuery(nextPage, nextCategory), { force: true })
  },
)

function goToPage(next: number) {
  if (next < 1 || next > pageCount.value) return
  router.push({
    query: {
      ...route.query,
      page: next === 1 ? undefined : String(next),
    },
  })
}

function goToCategory(next: string) {
  router.push({
    query: {
      category: next || undefined,
      page: undefined,
    },
  })
}

usePageSeo({
  title: () =>
    category.value
      ? `مقالات ${category.value} در کرج | کلینیک امیر رحمتی`
      : 'مقالات دندانپزشکی در کرج | ایمپلنت، لمینت، دیجیتال',
  description:
    'مقالات آموزشی کلینیک امیر رحمتی در کرج: دندان پزشکی دیجیتال، ایمپلنت در کرج، لمینت، زیبایی و پیشگیری — جهانشهر.',
  keywords:
    'مقالات دندانپزشکی کرج, ایمپلنت در کرج, لمینت دندان کرج, دندان پزشکی دیجیتال در کرج, بهترین دندانپزشک کرج',
  path: '/articles',
})
</script>

<template>
  <div class="bg-mist">
    <!-- Hero -->
    <SiteReveal variant="fade">
      <section class="relative overflow-hidden bg-mist">
        <div class="pointer-events-none absolute -left-24 top-0 size-[24rem] rounded-full bg-green-deep/15 blur-3xl" aria-hidden="true" />
        <div class="pointer-events-none absolute -right-20 bottom-0 size-[18rem] rounded-full bg-gold/10 blur-3xl" aria-hidden="true" />
        <div class="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-12 lg:items-center lg:gap-10 lg:px-8 lg:py-16">
          <div class="lg:col-span-7">
            <p class="text-[11px] font-semibold tracking-[0.24em] text-gold">
              اتاق مطالعه سلامت دهان · کرج جهانشهر
            </p>
            <h1 class="mt-4 text-3xl font-bold tracking-tight text-ink sm:text-5xl sm:leading-[1.2]">
              دانش دندانپزشکی، به‌زبان روشن
            </h1>
            <p class="mt-5 max-w-2xl text-[15px] leading-8 text-ink-muted">
              مقاله‌های بخش‌بندی‌شده درباره ایمپلنت، لمینت، دندان‌پزشکی دیجیتال، عصب‌کشی، پیشگیری و مراقبت روزانه —
              تا قبل از ویزیت در کلینیک امیر رحمتی، تصویر روشنی از مسیر درمان داشته باشید.
            </p>
            <div class="mt-6 flex flex-wrap gap-3 text-sm">
              <span class="rounded-2xl bg-surface px-4 py-2 font-medium text-ink ring-1 ring-mist-deep">
                {{ allCount || total }} مقاله
              </span>
              <span class="rounded-2xl bg-band px-4 py-2 font-medium text-on-band">
                {{ categories.length }} دسته‌بندی
              </span>
              <NuxtLink
                to="/clinic"
                class="rounded-2xl bg-surface px-4 py-2 font-medium text-green-deep ring-1 ring-mist-deep transition hover:bg-green-soft"
              >
                تور کلینیک
              </NuxtLink>
              <NuxtLink
                to="/consultation"
                class="rounded-2xl bg-green-deep px-4 py-2 font-medium text-on-primary"
              >
                رزرو نوبت
              </NuxtLink>
            </div>
            <div
              v-if="categories.length"
              class="mt-6 flex flex-wrap gap-2.5 py-1"
            >
              <button
                v-for="entry in categories.slice(0, 8)"
                :key="entry.category"
                type="button"
                class="rounded-full bg-panel px-3.5 py-2 text-xs font-medium leading-none text-ink ring-1 ring-mist-deep transition hover:bg-green-soft hover:text-green-deep"
                @click="goToCategory(entry.category)"
              >
                {{ entry.category }}
                <span class="opacity-55">{{ entry.count }}</span>
              </button>
            </div>
          </div>
          <div class="relative lg:col-span-5">
            <div class="relative overflow-hidden rounded-[1.75rem] bg-band ring-1 ring-mist-deep">
              <img
                src="/images/articles-bg.jpg"
                alt=""
                class="aspect-[16/11] size-full object-cover opacity-75 sm:aspect-[5/4]"
                width="720"
                height="580"
                aria-hidden="true"
              >
              <div class="absolute inset-0 bg-gradient-to-t from-band via-band/35 to-transparent" />
              <div class="absolute inset-x-0 bottom-0 space-y-2 p-5 sm:p-6">
                <p class="text-[11px] tracking-[0.18em] text-gold">مجله امیر رحمتی</p>
                <p class="text-lg font-semibold text-on-band">از پیشگیری تا درمان و زیبایی</p>
                <p class="max-w-sm text-sm leading-7 text-on-band/70">
                  قبل از نوبت بخوانید؛ در جلسه با آمادگی بیشتر تصمیم بگیرید.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </SiteReveal>

    <SiteReveal variant="up" delay="30ms">
      <section class="border-y border-mist-deep bg-surface">
        <div class="mx-auto max-w-7xl overflow-x-auto py-2 lg:overflow-visible">
          <div class="flex w-max min-w-full gap-1 px-4 sm:px-6 lg:flex-wrap lg:px-8">
            <button
              type="button"
              class="shrink-0 border-b-2 px-4 py-3 text-sm font-semibold transition"
              :class="!category ? 'border-gold text-ink' : 'border-transparent text-ink-muted hover:text-ink'"
              @click="goToCategory('')"
            >
              همه
              <span class="ms-1 opacity-55">{{ allCount }}</span>
            </button>
            <button
              v-for="entry in categories"
              :key="entry.category"
              type="button"
              class="shrink-0 border-b-2 px-4 py-3 text-sm font-semibold transition"
              :class="category === entry.category ? 'border-gold text-ink' : 'border-transparent text-ink-muted hover:text-ink'"
              @click="goToCategory(entry.category)"
            >
              {{ entry.category }}
              <span class="ms-1 opacity-55">{{ entry.count }}</span>
            </button>
          </div>
        </div>
      </section>
    </SiteReveal>

    <SiteReveal variant="up" delay="40ms">
      <section class="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <p v-if="category" class="mb-8 text-sm text-ink-muted">
          {{ total }} مقاله در «{{ category }}»
        </p>

        <div v-if="loading && !items.length" class="py-20 text-center text-ink-muted">
          در حال بارگذاری مقالات...
        </div>

        <div
          v-else-if="!items.length"
          class="rounded-[1.5rem] bg-surface px-6 py-16 text-center text-ink-muted ring-1 ring-mist-deep"
        >
          مقاله‌ای در این دسته‌بندی نیست.
        </div>

        <template v-else>
          <NuxtLink
            v-if="lead"
            :to="lead.href"
            class="group mb-8 grid overflow-hidden rounded-[1.75rem] bg-surface ring-1 ring-mist-deep transition hover:ring-gold/40 lg:grid-cols-2"
          >
            <div class="relative aspect-[16/10] overflow-hidden lg:aspect-auto lg:min-h-[15rem]">
              <img
                :src="mediaSrc(lead.coverImage)"
                :alt="lead.title"
                class="size-full object-cover transition duration-500 group-hover:scale-[1.03]"
                width="900"
                height="620"
              >
            </div>
            <div class="flex flex-col justify-center p-7 sm:p-9">
              <div class="flex flex-wrap gap-2 text-[11px] text-ink-muted">
                <span class="rounded-full bg-green-soft px-3 py-1.5 font-medium leading-none text-green-deep">{{ lead.category }}</span>
                <span v-if="lead.displayDate">{{ lead.displayDate }}</span>
                <span>{{ lead.readingMinutes }} دقیقه</span>
              </div>
              <h2 class="mt-4 text-2xl font-bold leading-10 text-ink transition group-hover:text-green-deep sm:text-3xl">
                {{ lead.title }}
              </h2>
              <p class="mt-4 text-sm leading-8 text-ink-muted">
                {{ lead.excerpt }}
              </p>
              <span class="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-green-deep">
                مطالعه مقاله
                <span class="h-px w-8 bg-gold transition-all group-hover:w-12" aria-hidden="true" />
              </span>
            </div>
          </NuxtLink>

          <ul class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <li
              v-for="(item, index) in gridItems"
              :key="item.id"
              :class="index === 0 && gridItems.length > 3 ? 'sm:col-span-2 lg:col-span-2' : ''"
            >
              <NuxtLink
                :to="item.href"
                class="group flex h-full flex-col overflow-hidden rounded-[1.5rem] bg-surface ring-1 ring-mist-deep transition hover:-translate-y-0.5 hover:ring-gold/40"
                :class="index === 0 && gridItems.length > 3 ? 'sm:flex-row' : ''"
              >
                <div
                  class="relative overflow-hidden bg-mist"
                  :class="index === 0 && gridItems.length > 3
                    ? 'aspect-[16/10] sm:aspect-auto sm:w-[48%] sm:min-h-[14rem]'
                    : 'aspect-[16/10]'"
                >
                  <img
                    :src="mediaSrc(item.coverImage)"
                    :alt="item.title"
                    class="size-full object-cover transition duration-500 group-hover:scale-[1.04]"
                    width="640"
                    height="400"
                    loading="lazy"
                  >
                  <span class="absolute inset-inline-end-3 top-3 rounded-full bg-panel/95 px-3 py-1.5 text-[11px] font-semibold leading-none text-ink ring-1 ring-mist-deep">
                    {{ item.category }}
                  </span>
                </div>
                <div class="flex flex-1 flex-col p-5 sm:p-6">
                  <h2 class="text-lg font-bold leading-8 text-ink transition group-hover:text-green-deep">
                    {{ item.title }}
                  </h2>
                  <p class="mt-3 line-clamp-3 flex-1 text-sm leading-7 text-ink-muted">
                    {{ item.excerpt }}
                  </p>
                  <div class="mt-4 flex items-center justify-between border-t border-mist pt-3 text-[12px]">
                    <p class="text-ink-muted">
                      <span v-if="item.displayDate">{{ item.displayDate }} · </span>
                      {{ item.readingMinutes }} دقیقه
                    </p>
                    <span class="font-semibold text-green-deep">مطالعه</span>
                  </div>
                </div>
              </NuxtLink>
            </li>
          </ul>

          <nav
            v-if="pageCount > 1"
            class="mt-12 flex flex-wrap items-center justify-center gap-2"
            aria-label="صفحه‌بندی مقالات"
          >
            <button
              type="button"
              class="rounded-2xl bg-surface px-4 py-2.5 text-sm text-ink ring-1 ring-mist-deep disabled:opacity-40"
              :disabled="page <= 1"
              @click="goToPage(page - 1)"
            >
              قبلی
            </button>
            <button
              v-for="entry in pages"
              :key="entry"
              type="button"
              class="min-w-10 rounded-2xl px-3 py-2.5 text-sm font-semibold"
              :class="entry === page ? 'bg-green-deep text-on-primary' : 'bg-surface text-ink ring-1 ring-mist-deep hover:bg-mist'"
              @click="goToPage(entry)"
            >
              {{ entry }}
            </button>
            <button
              type="button"
              class="rounded-2xl bg-surface px-4 py-2.5 text-sm text-ink ring-1 ring-mist-deep disabled:opacity-40"
              :disabled="page >= pageCount"
              @click="goToPage(page + 1)"
            >
              بعدی
            </button>
          </nav>
        </template>
      </section>
    </SiteReveal>
  </div>
</template>
