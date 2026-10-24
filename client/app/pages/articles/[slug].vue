<script setup lang="ts">
import { articleModule } from '~/modules'
import { ArticleModel } from '~/modules/article/models/index.model'
import type { RevealVariant } from '~/components/SiteReveal.vue'

const route = useRoute()
const slug = computed(() => String(route.params.slug || ''))

const { data, error } = await useAsyncData(
  () => `article-${slug.value}`,
  async () => {
    const res = await articleModule.controller.getArticleBySlug(slug.value)
    if (!res.success || !res.data) return null
    return res.data
  },
  { watch: [slug] },
)

if (error.value || !data.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'مقاله یافت نشد',
  })
}

const article = computed(() => new ArticleModel(data.value!))
const mediaSrc = useMediaSrc()

const related = computed(() =>
  articleModule.store.getVisibleItems
    .filter((item) => item.id !== article.value.id)
    .slice(0, 3),
)

onMounted(() => {
  if (!articleModule.store.getVisibleItems.length) {
    articleModule.controller.getArticleList({ page: 1, limit: 6 })
  }
})

const sectionShell = [
  'up',
  'right',
  'left',
  'soft',
  'rise',
  'tilt',
] as const satisfies readonly RevealVariant[]

usePageSeo({
  title: () => article.value.displaySeoTitle,
  description: () => article.value.displaySeoDescription,
  keywords: () => article.value.seoKeywords || undefined,
  image: () => article.value.ogImage || article.value.coverImage,
  path: () => article.value.href,
  type: 'article',
  published: () => article.value.publishedAt,
})

useSchemaOrg([
  defineArticle({
    headline: () => article.value.title,
    description: () => article.value.displaySeoDescription,
    image: () => article.value.coverImage,
    datePublished: () => article.value.publishedAt || undefined,
    author: {
      name: article.value.author,
    },
  }),
  defineBreadcrumb({
    itemListElement: [
      { name: 'خانه', item: '/' },
      { name: 'مقالات', item: '/articles' },
      { name: () => article.value.title, item: () => article.value.href },
    ],
  }),
])
</script>

<template>
  <!-- Magazine / reading-room character -->
  <article class="bg-mist">
    <SiteReveal variant="fade" delay="0ms">
      <header class="relative overflow-hidden">
        <div
          class="pointer-events-none absolute -right-24 top-0 size-[22rem] rounded-full bg-green-deep/12 blur-3xl"
          aria-hidden="true"
        />

        <div class="relative mx-auto grid max-w-7xl items-end gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-12 lg:gap-12 lg:px-8 lg:py-20">
          <div class="lg:col-span-7">
            <SiteReveal variant="drop" delay="40ms">
              <NuxtLink
                to="/articles"
                class="inline-flex items-center gap-2 text-sm font-medium text-ink-muted transition hover:text-ink"
              >
                <span class="inline-flex size-9 items-center justify-center rounded-full bg-panel text-lg leading-none ring-1 ring-mist-deep">←</span>
                بازگشت به مقالات
              </NuxtLink>
            </SiteReveal>

            <SiteReveal variant="right" delay="80ms">
              <div class="mt-7 flex flex-wrap items-center gap-2 text-[11px]">
                <span class="rounded-full bg-gold/15 px-3 py-1 font-semibold text-gold ring-1 ring-gold/25">
                  {{ article.category }}
                </span>
                <span class="rounded-full bg-panel px-3 py-1 text-ink-muted ring-1 ring-mist-deep">
                  {{ article.readingMinutes }} دقیقه مطالعه
                </span>
                <span
                  v-if="article.displayDate"
                  class="rounded-full bg-panel px-3 py-1 text-ink-muted ring-1 ring-mist-deep"
                >
                  {{ article.displayDate }}
                </span>
              </div>
            </SiteReveal>

            <h1 class="mt-5 min-h-[4rem] text-3xl font-bold tracking-tight text-ink sm:min-h-[5rem] sm:text-5xl sm:leading-[1.2]">
              <SiteTypeText
                :key="article.slug"
                as="span"
                :text="article.title"
                :speed="28"
                :start-delay="140"
              />
            </h1>

            <SiteReveal variant="up" delay="180ms">
              <p class="mt-5 max-w-2xl text-[15px] leading-8 text-ink-muted">
                {{ article.excerpt }}
              </p>
            </SiteReveal>

            <SiteReveal variant="soft" delay="220ms">
              <p class="mt-6 text-sm text-ink">
                <span class="text-ink-muted">نویسنده:</span>
                {{ article.author }}
              </p>
            </SiteReveal>
          </div>

          <SiteReveal variant="left" delay="100ms" class="lg:col-span-5">
            <figure class="relative">
              <div class="absolute -inset-3 rounded-[1.75rem] bg-gradient-to-tr from-band/10 to-green-deep/15 blur-2xl" aria-hidden="true" />
              <div class="relative overflow-hidden rounded-[1.5rem] bg-panel shadow-[0_24px_60px_rgba(6,54,55,0.14)] ring-1 ring-mist-deep">
                <div class="aspect-[4/5] sm:aspect-[5/6]">
                  <img
                    :src="mediaSrc(article.coverImage)"
                    :alt="article.title"
                    class="home-media-shift size-full object-cover"
                    width="720"
                    height="900"
                  >
                </div>
                <figcaption class="flex items-center justify-between gap-3 border-t border-mist-deep bg-panel px-4 py-3">
                  <span class="text-[11px] tracking-[0.16em] text-gold">مقاله امیر رحمتی</span>
                  <span class="truncate text-xs text-ink-muted">{{ article.category }}</span>
                </figcaption>
              </div>
            </figure>
          </SiteReveal>
        </div>
      </header>
    </SiteReveal>

    <div class="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-12 lg:gap-12 lg:px-8">
      <!-- Reading column -->
      <div class="min-w-0 space-y-8 lg:col-span-8">
        <template v-if="article.hasSections">
          <SiteReveal
            v-for="(section, idx) in article.sections"
            :key="`${article.slug}-sec-${idx}`"
            :variant="sectionShell[idx % sectionShell.length]"
            :delay="`${32 + (idx % 4) * 32}ms`"
          >
            <section
              class="scroll-mt-28 overflow-hidden rounded-[1.4rem] bg-panel p-6 ring-1 ring-mist-deep sm:p-8"
              :class="idx % 2 === 1 ? 'border-s-4 border-s-gold' : ''"
            >
              <p
                class="reveal-item reveal-item-fade font-mono text-[11px] font-semibold tracking-[0.2em] text-gold"
                :style="{ '--reveal-i': 0 }"
              >
                {{ String(idx + 1).padStart(2, '0') }}
              </p>

              <h2
                v-if="section.title"
                class="reveal-item mt-3 text-xl font-bold text-ink sm:text-2xl"
                :style="{ '--reveal-i': 1 }"
              >
                <SiteTypeText
                  :key="`${article.slug}-t-${idx}`"
                  as="span"
                  :text="section.title"
                  :speed="22"
                  :start-delay="100"
                  :caret="idx === 0"
                />
              </h2>

              <p
                v-if="section.type === 'text' && section.content"
                class="reveal-item whitespace-pre-line text-[15px] leading-8 text-ink-muted"
                :class="[
                  section.title ? 'mt-4' : 'mt-3',
                  idx % 2 === 0 ? 'reveal-item-left' : 'reveal-item-right',
                ]"
                :style="{ '--reveal-i': 2 }"
              >
                {{ section.content }}
              </p>

              <ol
                v-else-if="section.type === 'list' && section.items?.length"
                class="mt-5 space-y-3"
              >
                <li
                  v-for="(entry, i) in section.items"
                  :key="i"
                  class="reveal-item flex gap-3 text-[15px] leading-7 text-ink"
                  :class="i % 2 === 0 ? 'reveal-item-left' : 'reveal-item-drop'"
                  :style="{ '--reveal-i': i + 2 }"
                >
                  <span class="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-mist font-mono text-xs font-bold text-ink ring-1 ring-mist-deep">
                    {{ i + 1 }}
                  </span>
                  <span class="pt-1">{{ entry }}</span>
                </li>
              </ol>

              <figure
                v-else-if="section.type === 'image' && section.src"
                class="reveal-item reveal-item-scale mt-6 overflow-hidden rounded-[1.25rem]"
                :style="{ '--reveal-i': 2 }"
              >
                <img
                  :src="section.src"
                  :alt="section.alt || article.title"
                  class="w-full object-cover"
                  width="1200"
                  height="720"
                  loading="lazy"
                >
                <figcaption
                  v-if="section.caption"
                  class="bg-mist px-5 py-3 text-sm text-ink-muted"
                >
                  {{ section.caption }}
                </figcaption>
              </figure>
            </section>
          </SiteReveal>
        </template>

        <SiteReveal variant="slide" delay="40ms">
          <aside class="overflow-hidden rounded-[1.5rem] bg-band p-6 text-on-band sm:p-8">
            <p class="reveal-item reveal-item-fade text-[11px] font-semibold tracking-[0.2em] text-gold" style="--reveal-i: 0">
              ادامه مسیر
            </p>
            <h3 class="reveal-item mt-3 text-xl font-bold" style="--reveal-i: 1">
              <SiteTypeText
                text="همین موضوع را در ویزیت با دکتر مطرح کنید"
                :speed="26"
                :start-delay="160"
                as="span"
              />
            </h3>
            <p class="reveal-item reveal-item-right mt-3 text-sm leading-7 text-on-band/70" style="--reveal-i: 2">
              اگر مقاله به وضعیت شما نزدیک است، از رزرو نوبت شروع کنید.
            </p>
            <NuxtLink
              to="/consultation"
              class="reveal-item reveal-item-scale mt-6 inline-flex rounded-2xl bg-green-deep px-5 py-3 text-sm font-semibold text-on-primary transition hover:bg-panel hover:text-ink"
              style="--reveal-i: 3"
            >
              رزرو نوبت
            </NuxtLink>
          </aside>
        </SiteReveal>
      </div>

      <!-- Sticky meta rail -->
      <aside class="lg:col-span-4">
        <div class="sticky top-24 space-y-4">
          <SiteReveal variant="zoom" delay="120ms">
            <div class="rounded-[1.5rem] bg-panel p-5 ring-1 ring-mist-deep sm:p-6">
              <p class="reveal-item reveal-item-fade text-[11px] font-semibold tracking-[0.18em] text-gold" style="--reveal-i: 0">
                مشخصات مقاله
              </p>
              <dl class="mt-4 space-y-3 text-sm">
                <div class="reveal-item reveal-item-left flex justify-between gap-3" style="--reveal-i: 1">
                  <dt class="text-ink-muted">دسته</dt>
                  <dd class="font-medium text-ink">{{ article.category }}</dd>
                </div>
                <div class="reveal-item reveal-item-right flex justify-between gap-3" style="--reveal-i: 2">
                  <dt class="text-ink-muted">نویسنده</dt>
                  <dd class="font-medium text-ink">{{ article.author }}</dd>
                </div>
                <div
                  v-if="article.displayDate"
                  class="reveal-item reveal-item-left flex justify-between gap-3"
                  style="--reveal-i: 3"
                >
                  <dt class="text-ink-muted">تاریخ</dt>
                  <dd class="font-medium text-ink">{{ article.displayDate }}</dd>
                </div>
                <div class="reveal-item reveal-item-right flex justify-between gap-3" style="--reveal-i: 4">
                  <dt class="text-ink-muted">زمان مطالعه</dt>
                  <dd class="font-medium text-ink">{{ article.readingMinutes }} دقیقه</dd>
                </div>
              </dl>
              <NuxtLink
                to="/consultation"
                class="reveal-item reveal-item-scale mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-band px-5 py-3 text-sm font-semibold text-on-band transition hover:bg-green-deep hover:text-on-primary"
                style="--reveal-i: 5"
              >
                رزرو نوبت
              </NuxtLink>
            </div>
          </SiteReveal>

          <SiteReveal v-if="related.length" variant="up" delay="160ms">
            <div class="rounded-[1.5rem] bg-panel p-5 ring-1 ring-mist-deep sm:p-6">
              <p class="reveal-item reveal-item-fade text-[11px] font-semibold tracking-[0.18em] text-gold" style="--reveal-i: 0">
                مقالات مرتبط
              </p>
              <ul class="mt-4 space-y-2">
                <li
                  v-for="(item, index) in related"
                  :key="item.id"
                  class="reveal-item"
                  :class="index % 2 === 0 ? 'reveal-item-left' : 'reveal-item-right'"
                  :style="{ '--reveal-i': index + 1 }"
                >
                  <NuxtLink
                    :to="item.href"
                    class="block rounded-xl px-3 py-2.5 transition hover:bg-mist"
                  >
                    <span class="line-clamp-2 text-sm font-medium text-ink">{{ item.title }}</span>
                    <span class="mt-1 block text-[11px] text-ink-muted">{{ item.category }}</span>
                  </NuxtLink>
                </li>
              </ul>
            </div>
          </SiteReveal>
        </div>
      </aside>
    </div>
  </article>
</template>
