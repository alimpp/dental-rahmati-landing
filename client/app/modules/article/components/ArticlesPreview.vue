<script setup lang="ts">
import { articleModule } from '~/modules'

const articleDS = articleModule.store
const mediaSrc = useMediaSrc()
const items = computed(() => articleDS.getFeatured)
const loading = computed(() => articleDS.getLoading)
const lead = computed(() => items.value[0] ?? null)
const rest = computed(() => items.value.slice(1, 4))
const categories = computed(() => articleDS.getCategories)

await Promise.all([
  articleModule.controller.getFeaturedArticles(4),
  articleModule.controller.getArticleCategories(),
])
</script>

<template>
  <section class="bg-[#f4f6f5] py-16 sm:py-20 lg:py-24">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="grid gap-8 lg:grid-cols-12 lg:items-end">
        <div class="lg:col-span-8">
          <p class="reveal-item reveal-item-fade text-[11px] font-semibold tracking-[0.22em] text-gold" style="--reveal-i: 0">
            دانش دندانپزشکی، به‌زبان روشن
          </p>
          <h2 class="reveal-item mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl lg:text-[2.7rem]" style="--reveal-i: 1">
            از پیشگیری تا درمان و مراقبت
          </h2>
          <p class="reveal-item reveal-item-fade mt-4 max-w-xl text-[15px] leading-8 text-ink-muted" style="--reveal-i: 2">
            پیش‌نمایش مقاله‌ها برای تصمیم سریع‌تر، پیش از نوبت.
          </p>
        </div>
        <div class="lg:col-span-4 lg:flex lg:justify-end">
          <NuxtLink
            to="/articles"
            class="reveal-item reveal-item-scale inline-flex rounded-2xl bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-deep hover:text-ink"
            style="--reveal-i: 3"
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
          v-for="(entry, index) in categories.slice(0, 6)"
          :key="entry.category"
          :to="{ path: '/articles', query: { category: entry.category } }"
          class="reveal-item reveal-item-scale rounded-full bg-white px-3.5 py-1.5 text-xs font-medium text-ink ring-1 ring-mist-deep transition hover:bg-ink hover:text-white"
          :style="{ '--reveal-i': index + 4 }"
        >
          {{ entry.category }}
        </NuxtLink>
      </div>

      <div v-if="loading && !items.length" class="mt-12 py-16 text-center text-ink-muted">
        در حال بارگذاری مقالات...
      </div>

      <div v-else-if="lead" class="mt-12 space-y-4">
        <NuxtLink
          :to="lead.href"
          class="reveal-item reveal-item-scale group grid overflow-hidden rounded-[1.75rem] bg-ink lg:grid-cols-12"
          :style="{ '--reveal-i': 4 }"
        >
          <div class="relative aspect-[16/11] overflow-hidden lg:col-span-7 lg:aspect-auto lg:min-h-[20rem]">
            <img
              :src="mediaSrc(lead.coverImage)"
              :alt="lead.title"
              class="home-media-shift size-full object-cover opacity-90"
              width="960"
              height="640"
            >
          </div>
          <div class="flex flex-col justify-center p-7 sm:p-9 lg:col-span-5">
            <span class="w-fit rounded-full bg-gold/15 px-3 py-1 text-[11px] font-medium text-gold">
              {{ lead.category }}
            </span>
            <h3 class="mt-4 text-2xl font-bold leading-10 text-white sm:text-3xl">
              {{ lead.title }}
            </h3>
            <p class="mt-4 line-clamp-3 text-sm leading-7 text-white/70">
              {{ lead.excerpt }}
            </p>
            <span class="mt-6 text-sm font-semibold text-green-deep">
              {{ lead.readingMinutes }} دقیقه مطالعه ←
            </span>
          </div>
        </NuxtLink>

        <ul class="grid gap-4 sm:grid-cols-3">
          <li
            v-for="(item, index) in rest"
            :key="item.id"
            class="reveal-item reveal-item-scale"
            :style="{ '--reveal-i': index + 5 }"
          >
            <NuxtLink
              :to="item.href"
              class="group flex h-full flex-col rounded-[1.4rem] bg-white p-5 ring-1 ring-mist-deep transition hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(6,54,55,0.1)] hover:ring-gold/30"
            >
              <span class="font-mono text-[11px] text-gold">{{ String(index + 2).padStart(2, '0') }}</span>
              <p class="mt-3 text-[11px] font-medium text-ink-muted">{{ item.category }}</p>
              <h3 class="mt-2 line-clamp-3 flex-1 text-base font-bold leading-7 text-ink group-hover:text-green-deep">
                {{ item.title }}
              </h3>
              <p class="mt-4 text-[12px] text-ink-muted">{{ item.readingMinutes }} دقیقه</p>
            </NuxtLink>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>
