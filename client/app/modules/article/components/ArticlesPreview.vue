<script setup lang="ts">
import { articleModule } from '~/modules'

const articleDS = articleModule.store
const mediaSrc = useMediaSrc()
const items = computed(() => articleDS.getFeatured)
const loading = computed(() => articleDS.getLoading)
const lead = computed(() => items.value[0] ?? null)
const rest = computed(() => items.value.slice(1, 7))
const categories = computed(() => articleDS.getCategories)

await Promise.all([
  articleModule.controller.getFeaturedArticles(7),
  articleModule.controller.getArticleCategories(),
])
</script>

<template>
  <section class="bg-mist py-16 sm:py-20 lg:py-24">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="grid gap-8 lg:grid-cols-12 lg:items-end">
        <div class="lg:col-span-8">
          <p class="text-[11px] font-semibold tracking-[0.22em] text-gold">
            دانش دندانپزشکی، به‌زبان روشن
          </p>
          <h2 class="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl lg:text-[2.7rem]">
            از پیشگیری تا درمان و مراقبت
          </h2>
          <p class="mt-4 max-w-2xl text-[15px] leading-8 text-ink-muted">
            مقاله‌های کوتاه و کاربردی درباره ایمپلنت، لمینت، دندان‌پزشکی دیجیتال و مراقبت روزانه —
            تا قبل از ویزیت تصویر روشن‌تری از مسیر درمان داشته باشید.
          </p>
        </div>
        <div class="flex flex-col gap-3 lg:col-span-4 lg:items-end">
          <NuxtLink
            to="/articles"
            class="inline-flex rounded-2xl bg-green-deep px-5 py-3 text-sm font-semibold text-on-primary transition hover:opacity-90"
          >
            همه مقالات
          </NuxtLink>
        </div>
      </div>

      <div
        v-if="categories.length"
        class="mt-8 flex flex-wrap gap-2"
      >
        <NuxtLink
          v-for="entry in categories.slice(0, 6)"
          :key="entry.category"
          :to="{ path: '/articles', query: { category: entry.category } }"
          class="rounded-full bg-surface px-3.5 py-1.5 text-xs font-medium text-ink ring-1 ring-mist-deep transition hover:bg-green-soft hover:text-green-deep hover:ring-green-deep/30"
        >
          {{ entry.category }}
        </NuxtLink>
      </div>

      <div
        v-if="loading && !items.length"
        class="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        <div
          v-for="n in 6"
          :key="n"
          class="h-72 animate-pulse rounded-[1.5rem] bg-surface ring-1 ring-mist-deep"
        />
      </div>

      <div
        v-else-if="!lead"
        class="mt-12 rounded-[1.5rem] bg-surface p-8 ring-1 ring-mist-deep"
      >
        <p class="text-sm font-semibold text-ink">
          هنوز مقالهٔ ویژه‌ای در پیش‌نمایش نیست
        </p>
        <p class="mt-2 text-sm leading-7 text-ink-muted">
          به صفحه مقالات بروید یا از پذیرش درباره موضوع موردنظرتان بپرسید.
        </p>
        <NuxtLink
          to="/articles"
          class="mt-5 inline-flex rounded-xl bg-green-deep px-4 py-2.5 text-sm font-semibold text-on-primary"
        >
          رفتن به مقالات
        </NuxtLink>
      </div>

      <div
        v-else
        class="mt-12 space-y-5"
      >
        <NuxtLink
          :to="lead.href"
          class="group grid overflow-hidden rounded-[1.4rem] bg-surface ring-1 ring-mist-deep transition hover:ring-gold/40 lg:grid-cols-12"
        >
          <div class="relative aspect-[16/10] overflow-hidden lg:col-span-7 lg:aspect-auto lg:min-h-[15rem]">
            <img
              :src="mediaSrc(lead.coverImage)"
              :alt="lead.title"
              class="size-full object-cover transition duration-500 group-hover:scale-[1.03]"
              width="960"
              height="640"
            >
            <div class="absolute inset-0 bg-gradient-to-t from-band/50 via-transparent to-transparent lg:hidden" />
          </div>
          <div class="flex flex-col justify-center p-5 sm:p-6 lg:col-span-5">
            <span class="w-fit rounded-full bg-green-soft px-3 py-1 text-[11px] font-medium text-green-deep">
              {{ lead.category }}
            </span>
            <h3 class="mt-3 text-xl font-bold leading-8 text-ink transition group-hover:text-green-deep sm:text-2xl sm:leading-9">
              {{ lead.title }}
            </h3>
            <p class="mt-3 line-clamp-3 text-sm leading-7 text-ink-muted">
              {{ lead.excerpt }}
            </p>
            <div class="mt-6 flex items-center justify-between gap-3 border-t border-mist pt-4">
              <span class="text-sm font-semibold text-green-deep">
                {{ lead.readingMinutes }} دقیقه مطالعه
              </span>
              <span class="h-px w-10 bg-gold transition-all group-hover:w-14" aria-hidden="true" />
            </div>
          </div>
        </NuxtLink>

        <ul class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <li
            v-for="(item, index) in rest"
            :key="item.id"
          >
            <NuxtLink
              :to="item.href"
              class="group flex h-full flex-col overflow-hidden rounded-[1.4rem] bg-surface ring-1 ring-mist-deep transition hover:-translate-y-0.5 hover:ring-gold/40"
            >
              <div class="relative aspect-[16/10] overflow-hidden bg-mist">
                <img
                  :src="mediaSrc(item.coverImage)"
                  :alt="item.title"
                  class="size-full object-cover transition duration-500 group-hover:scale-[1.04]"
                  width="640"
                  height="400"
                  loading="lazy"
                >
                <span class="absolute top-3 inset-inline-start-3 rounded-md bg-surface/95 px-2 py-1 font-mono text-[10px] font-semibold text-gold ring-1 ring-mist-deep">
                  {{ String(index + 2).padStart(2, '0') }}
                </span>
              </div>
              <div class="flex flex-1 flex-col p-5">
                <p class="text-[11px] font-medium text-ink-muted">
                  {{ item.category }}
                </p>
                <h3 class="mt-2 line-clamp-2 text-base font-bold leading-7 text-ink group-hover:text-green-deep">
                  {{ item.title }}
                </h3>
                <p class="mt-2 line-clamp-2 flex-1 text-xs leading-6 text-ink-muted">
                  {{ item.excerpt }}
                </p>
                <div class="mt-4 flex items-center justify-between border-t border-mist pt-3">
                  <span class="text-[12px] text-ink-muted">{{ item.readingMinutes }} دقیقه</span>
                  <span class="text-sm font-semibold text-green-deep">مطالعه</span>
                </div>
              </div>
            </NuxtLink>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>
