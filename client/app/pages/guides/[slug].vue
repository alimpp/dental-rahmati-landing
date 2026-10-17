<script setup lang="ts">
import { guideModule } from '~/modules'
import { GuideModel } from '~/modules/guide/models/index.model'

const route = useRoute()
const mediaSrc = useMediaSrc()
const slug = computed(() => String(route.params.slug || ''))

const response = await guideModule.controller.getBySlug(slug.value)
if (!response.success || !response.data) {
  throw createError({ statusCode: 404, statusMessage: 'راهنما یافت نشد' })
}

const item = computed(() => new GuideModel(response.data!))

usePageSeo({
  title: () => `${item.value.title} | راهنمای دندانپزشکی کرج`,
  description: () => item.value.excerpt,
  keywords: () =>
    [item.value.category, 'راهنمای دندانپزشکی کرج', 'کلینیک امیر رحمتی جهانشهر', 'دندانپزشکی در کرج']
      .filter(Boolean)
      .join(', '),
  image: () => item.value.coverImage,
  path: () => item.value.href,
})

useSchemaOrg([
  defineWebPage({
    '@type': 'Article',
    name: () => item.value.title,
    description: () => item.value.excerpt,
    url: () => item.value.href,
  }),
  defineBreadcrumb({
    itemListElement: [
      { name: 'خانه', item: '/' },
      { name: 'راهنماها', item: '/guides' },
      { name: () => item.value.title, item: () => item.value.href },
    ],
  }),
])
</script>

<template>
  <article class="bg-white">
    <SiteReveal variant="zoom">
      <header class="relative isolate overflow-hidden">
        <div class="relative min-h-[min(48vh,460px)] w-full">
          <img
            :src="mediaSrc(item.coverImage)"
            :alt="item.title"
            class="absolute inset-0 size-full object-cover"
            width="1600"
            height="900"
          >
          <div class="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/20" />
          <div class="absolute inset-x-0 bottom-0 mx-auto max-w-3xl px-4 pb-10 sm:px-6 lg:px-8">
            <div class="flex flex-wrap gap-2 text-[11px]">
              <span v-if="item.category" class="rounded-full bg-white/15 px-3 py-1 text-white ring-1 ring-white/20">
                {{ item.category }}
              </span>
              <span class="rounded-full bg-gold/20 px-3 py-1 text-gold ring-1 ring-gold/30">
                {{ item.readingMinutes }} دقیقه مطالعه
              </span>
            </div>
            <h1 class="mt-4 text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">
              {{ item.title }}
            </h1>
            <p class="mt-4 max-w-2xl text-[15px] leading-8 text-white/75">
              {{ item.excerpt }}
            </p>
          </div>
        </div>
      </header>
    </SiteReveal>

    <SiteReveal variant="up" delay="40ms">
      <div class="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div class="space-y-6 text-[15px] leading-8 text-ink-muted">
          <p v-for="(paragraph, index) in item.paragraphs" :key="index">
            {{ paragraph }}
          </p>
        </div>

        <aside
          v-if="item.takeaways.length"
          class="mt-10 rounded-[1.4rem] bg-[#f7faf8] p-6 ring-1 ring-mist-deep"
        >
          <p class="text-[11px] font-medium tracking-[0.16em] text-gold">جمع‌بندی کوتاه</p>
          <ul class="mt-4 space-y-3">
            <li
              v-for="point in item.takeaways"
              :key="point"
              class="flex gap-2.5 text-sm leading-7 text-ink"
            >
              <span class="mt-2.5 size-1.5 shrink-0 rounded-full bg-green-deep" />
              {{ point }}
            </li>
          </ul>
        </aside>

        <div class="mt-12 flex flex-wrap gap-3 border-t border-mist pt-8">
          <NuxtLink
            to="/consultation"
            class="inline-flex rounded-xl bg-green-deep px-5 py-3 text-sm font-semibold text-ink transition hover:bg-ink"
          >
            رزرو نوبت
          </NuxtLink>
          <NuxtLink
            to="/guides"
            class="inline-flex rounded-xl px-5 py-3 text-sm font-medium text-ink ring-1 ring-mist-deep transition hover:bg-mist"
          >
            بازگشت به راهنماها
          </NuxtLink>
        </div>
      </div>
    </SiteReveal>
  </article>
</template>
