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
  <div class="bg-[#f4f6f5]">
    <!-- Hero: split like homepage banner -->
    <SiteReveal variant="fade">
      <section class="relative overflow-hidden bg-[#f4f6f5]">
        <div class="pointer-events-none absolute -left-24 top-0 size-[24rem] rounded-full bg-green-deep/15 blur-3xl" aria-hidden="true" />
        <div class="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-12 lg:items-end lg:px-8 lg:py-20">
          <div class="lg:col-span-7">
            <SiteReveal variant="right" delay="40ms">
              <p class="text-[11px] font-semibold tracking-[0.24em] text-gold">اتاق مطالعه سلامت دهان</p>
            </SiteReveal>
            <h1 class="mt-4 min-h-[4rem] text-3xl font-bold tracking-tight text-ink sm:min-h-[5rem] sm:text-5xl sm:leading-[1.2]">
              <SiteTypeText
                text="دانش دندانپزشکی، به‌زبان روشن"
                :speed="28"
                :start-delay="120"
                as="span"
              />
            </h1>
            <SiteReveal variant="up" delay="160ms">
              <p class="mt-5 max-w-xl text-[15px] leading-8 text-ink-muted">
                هر مقاله بخش‌بندی شده و کاربردی است — تا قبل از ویزیت، تصویر روشنی داشته باشید.
              </p>
            </SiteReveal>
            <SiteReveal variant="soft" delay="200ms">
              <div class="mt-7 flex flex-wrap gap-3 text-sm">
                <span class="rounded-2xl bg-white px-4 py-2 font-medium text-ink ring-1 ring-mist-deep">
                  {{ allCount || total }} مقاله
                </span>
                <span class="rounded-2xl bg-ink px-4 py-2 font-medium text-white">
                  {{ categories.length }} دسته‌بندی
                </span>
              </div>
            </SiteReveal>
          </div>
          <SiteReveal variant="left" delay="100ms" class="relative hidden lg:col-span-5 lg:block">
            <div class="relative overflow-hidden rounded-[1.75rem] bg-ink shadow-[0_28px_70px_rgba(6,54,55,0.2)] ring-1 ring-white/10">
              <img
                src="/images/articles-bg.jpg"
                alt=""
                class="aspect-[5/4] size-full object-cover opacity-70"
                width="720"
                height="580"
                aria-hidden="true"
              >
              <div class="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
              <div class="absolute inset-x-0 bottom-0 p-6">
                <p class="text-[11px] tracking-[0.18em] text-gold">مجله امیر رحمتی</p>
                <p class="mt-2 text-lg font-semibold text-white">از پیشگیری تا درمان</p>
              </div>
            </div>
          </SiteReveal>
        </div>
      </section>
    </SiteReveal>

    <!-- Editorial category rail (underline tabs — distinct from catalog chips) -->
    <SiteReveal variant="up" delay="30ms">
      <section class="border-y border-mist-deep bg-white">
        <div class="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 py-1 sm:px-6 lg:flex-wrap lg:overflow-visible lg:px-8">
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
          class="rounded-[1.5rem] bg-white px-6 py-16 text-center text-ink-muted ring-1 ring-mist-deep"
        >
          مقاله‌ای در این دسته‌بندی نیست.
        </div>

        <template v-else>
          <!-- Featured lead -->
          <NuxtLink
            v-if="lead"
            :to="lead.href"
            class="group mb-8 grid overflow-hidden rounded-[1.75rem] bg-ink shadow-[0_24px_60px_rgba(6,54,55,0.18)] lg:grid-cols-2"
          >
            <div class="relative aspect-[16/11] overflow-hidden lg:aspect-auto lg:min-h-[22rem]">
              <img
                :src="mediaSrc(lead.coverImage)"
                :alt="lead.title"
                class="home-media-shift size-full object-cover opacity-90"
                width="900"
                height="620"
              >
            </div>
            <div class="flex flex-col justify-center p-7 sm:p-9">
              <div class="flex flex-wrap gap-2 text-[11px] text-white/60">
                <span class="rounded-full bg-gold/15 px-2.5 py-1 font-medium text-gold">{{ lead.category }}</span>
                <span v-if="lead.displayDate">{{ lead.displayDate }}</span>
                <span>{{ lead.readingMinutes }} دقیقه</span>
              </div>
              <h2 class="mt-4 text-2xl font-bold leading-10 text-white sm:text-3xl">
                {{ lead.title }}
              </h2>
              <p class="mt-4 text-sm leading-8 text-white/70">
                {{ lead.excerpt }}
              </p>
              <span class="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-gold">
                مطالعه مقاله
                <span class="h-px w-8 bg-gold transition-all group-hover:w-12" aria-hidden="true" />
              </span>
            </div>
          </NuxtLink>

          <!-- Magazine bento: mix scale / left / right -->
          <ul class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <li
              v-for="(item, index) in gridItems"
              :key="item.id"
              class="reveal-item"
              :class="[
                index === 0 && gridItems.length > 3 ? 'sm:col-span-2 lg:col-span-2' : '',
                index % 3 === 0 ? 'reveal-item-scale' : index % 3 === 1 ? 'reveal-item-left' : 'reveal-item-right',
              ]"
              :style="{ '--reveal-i': index }"
            >
              <NuxtLink
                :to="item.href"
                class="group flex h-full flex-col overflow-hidden rounded-[1.5rem] bg-white ring-1 ring-mist-deep transition hover:-translate-y-1 hover:shadow-[0_22px_50px_rgba(6,54,55,0.1)] hover:ring-gold/35"
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
                    class="home-media-shift size-full object-cover"
                    width="640"
                    height="400"
                    loading="lazy"
                  >
                  <span class="absolute right-3 top-3 rounded-full bg-white/95 px-3 py-1 text-[11px] font-semibold text-ink">
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
                  <p class="mt-4 text-[12px] text-ink-muted">
                    <span v-if="item.displayDate">{{ item.displayDate }} · </span>
                    {{ item.readingMinutes }} دقیقه مطالعه
                  </p>
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
              class="rounded-2xl px-4 py-2.5 text-sm text-ink ring-1 ring-mist-deep disabled:opacity-40"
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
              :class="entry === page ? 'bg-ink text-white' : 'text-ink ring-1 ring-mist-deep hover:bg-white'"
              @click="goToPage(entry)"
            >
              {{ entry }}
            </button>
            <button
              type="button"
              class="rounded-2xl px-4 py-2.5 text-sm text-ink ring-1 ring-mist-deep disabled:opacity-40"
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
