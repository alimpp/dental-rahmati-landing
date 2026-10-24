<script setup lang="ts">
import { catalogModule } from '~/modules'
import { CatalogItemModel } from '~/modules/catalog/models/index.model'
import CatalogGallery from '~/modules/catalog/components/CatalogGallery.vue'
import type { RevealVariant } from '~/components/SiteReveal.vue'

const route = useRoute()
const slug = computed(() => String(route.params.slug || ''))

const { data, error } = await useAsyncData(
  () => `catalog-${slug.value}`,
  async () => {
    const res = await catalogModule.controller.getCatalogBySlug(slug.value)
    if (!res.success || !res.data) return null
    return res.data
  },
  { watch: [slug] },
)

if (error.value || !data.value) {
  throw createError({
    statusCode: 404,
    message: 'آیتم کاتالوگ یافت نشد',
  })
}

const item = computed(() => new CatalogItemModel(data.value!))
const mediaSrc = useMediaSrc()

const related = computed(() =>
  catalogModule.store.getVisibleItems
    .filter((entry) => entry.slug !== item.value.slug)
    .slice(0, 3),
)

await catalogModule.controller.getCatalogList()

const toc = computed(() => {
  const links = [
    { id: 'overview', label: 'معرفی' },
    { id: 'highlights', label: 'نکات کلیدی' },
    { id: 'content', label: 'متن کامل' },
  ]
  if (item.value.gallery.length) links.push({ id: 'gallery', label: 'گالری' })
  if (item.value.pdfs.length) links.push({ id: 'pdfs', label: 'فایل PDF' })
  if (related.value.length) links.push({ id: 'related', label: 'مرتبط' })
  return links
})

const paraMotion = ['reveal-item-left', 'reveal-item-right', 'reveal-item-fade', 'reveal-item-slide'] as const
const shell: RevealVariant[] = ['clip', 'rise', 'left', 'right', 'bloom', 'tilt']

usePageSeo({
  title: () => item.value.displaySeoTitle,
  description: () => item.value.displaySeoDescription,
  keywords: () => item.value.seoKeywords,
  image: () => item.value.primaryImage,
  path: () => item.value.href,
  type: 'website',
})

useSchemaOrg([
  defineWebPage({
    '@type': 'CollectionPage',
    name: () => item.value.title,
    description: () => item.value.displaySeoDescription,
    url: () => item.value.href,
    primaryImageOfPage: () => item.value.primaryImage,
  }),
  defineBreadcrumb({
    itemListElement: [
      { name: 'خانه', item: '/' },
      { name: 'کاتالوگ', item: '/catalog' },
      { name: () => item.value.title, item: () => item.value.href },
    ],
  }),
  defineImage({
    url: () => item.value.primaryImage,
    caption: () => item.value.title,
  }),
])
</script>

<template>
  <!-- Dossier / library character -->
  <article class="bg-surface" itemscope itemtype="https://schema.org/CollectionPage">
    <meta itemprop="name" :content="item.title">
    <meta itemprop="description" :content="item.displaySeoDescription">

    <SiteReveal variant="fade" delay="0ms">
      <header class="relative overflow-hidden bg-mist">
        <div
          class="pointer-events-none absolute -left-20 top-16 size-[24rem] rounded-full bg-band/10 blur-3xl"
          aria-hidden="true"
        />
        <div class="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-12 lg:gap-12 lg:px-8 lg:py-20">
          <div class="lg:col-span-6">
            <SiteReveal variant="drop" delay="40ms">
              <NuxtLink
                to="/catalog"
                class="inline-flex items-center gap-2 text-sm font-medium text-ink-muted transition hover:text-ink"
              >
                <span class="inline-flex size-9 items-center justify-center rounded-full bg-panel text-lg leading-none ring-1 ring-mist-deep">←</span>
                همه کاتالوگ‌ها
              </NuxtLink>
            </SiteReveal>

            <SiteReveal variant="right" delay="80ms">
              <p class="mt-7 text-[11px] font-semibold tracking-[0.22em] text-gold">
                کاتالوگ کلینیک امیر رحمتی
              </p>
            </SiteReveal>

            <h1 class="mt-4 min-h-[3.5rem] text-3xl font-bold tracking-tight text-ink sm:min-h-[4.5rem] sm:text-5xl sm:leading-[1.15]">
              <SiteTypeText
                :key="item.slug"
                as="span"
                :text="item.title"
                :speed="30"
                :start-delay="150"
              />
            </h1>

            <SiteReveal variant="up" delay="170ms">
              <p class="mt-5 max-w-xl text-[15px] leading-8 text-ink-muted">
                {{ item.excerpt }}
              </p>
            </SiteReveal>

            <SiteReveal variant="soft" delay="220ms">
              <div class="mt-7 flex flex-wrap gap-2">
                <span class="rounded-2xl bg-panel px-3.5 py-2 text-[12px] font-medium text-ink ring-1 ring-mist-deep">
                  {{ item.readingMinutes }} دقیقه
                </span>
                <span
                  v-if="item.galleryCount"
                  class="rounded-2xl bg-panel px-3.5 py-2 text-[12px] font-medium text-ink ring-1 ring-mist-deep"
                >
                  {{ item.galleryCount }} تصویر
                </span>
                <span
                  v-if="item.pdfs.length"
                  class="rounded-2xl bg-band px-3.5 py-2 text-[12px] font-medium text-gold"
                >
                  {{ item.pdfs.length }} PDF
                </span>
              </div>
            </SiteReveal>
          </div>

          <SiteReveal variant="left" delay="100ms" class="lg:col-span-6">
            <div class="relative mx-auto max-w-md lg:max-w-none">
              <!-- Dossier cover frame -->
              <div class="absolute -inset-2 rounded-[1.4rem] border border-gold/35" aria-hidden="true" />
              <div class="absolute -left-3 -top-3 size-10 rounded-br-[1.25rem] bg-gold/80" aria-hidden="true" />
              <div class="relative overflow-hidden rounded-[1.25rem] bg-band shadow-[0_28px_70px_rgba(6,54,55,0.22)]">
                <div class="relative aspect-[4/5] sm:aspect-[5/6] lg:aspect-[16/12]">
                  <img
                    :src="mediaSrc(item.primaryImage)"
                    :alt="item.title"
                    itemprop="image"
                    class="home-media-shift size-full object-cover opacity-90"
                    width="900"
                    height="720"
                  >
                  <div class="absolute inset-0 bg-gradient-to-t from-band via-transparent to-transparent" />
                  <div class="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                    <p class="text-[11px] tracking-[0.18em] text-gold">جلد کاتالوگ</p>
                    <p class="mt-1 text-base font-semibold text-on-band">{{ item.title }}</p>
                  </div>
                </div>
              </div>
            </div>
          </SiteReveal>
        </div>
      </header>
    </SiteReveal>

    <div class="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-12 lg:gap-12 lg:px-8">
      <!-- Sticky TOC + CTA -->
      <aside class="hidden lg:col-span-3 lg:block">
        <div class="sticky top-24 space-y-4">
          <SiteReveal variant="right" delay="80ms">
            <nav class="rounded-[1.4rem] bg-mist p-5 ring-1 ring-mist-deep" aria-label="فهرست مطالب">
              <p class="reveal-item reveal-item-fade text-[11px] font-semibold tracking-[0.16em] text-gold" style="--reveal-i: 0">
                فهرست مطالب
              </p>
              <ul class="mt-4 space-y-1">
                <li
                  v-for="(link, index) in toc"
                  :key="link.id"
                  class="reveal-item reveal-item-left"
                  :style="{ '--reveal-i': index + 1 }"
                >
                  <a
                    :href="`#${link.id}`"
                    class="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-ink-muted transition hover:bg-panel hover:text-ink"
                  >
                    <span class="font-mono text-[10px] text-gold">{{ String(index + 1).padStart(2, '0') }}</span>
                    {{ link.label }}
                  </a>
                </li>
              </ul>
            </nav>
          </SiteReveal>

          <SiteReveal variant="zoom" delay="140ms">
            <div class="rounded-[1.4rem] bg-band p-5 text-on-band">
              <p class="reveal-item reveal-item-fade text-[11px] font-semibold tracking-[0.14em] text-gold" style="--reveal-i: 0">
                قدم بعد
              </p>
              <p class="reveal-item reveal-item-drop mt-3 text-sm leading-7 text-on-band/75" style="--reveal-i: 1">
                اگر این کاتالوگ به نیاز شما نزدیک است، نوبت معاینه را رزرو کنید.
              </p>
              <NuxtLink
                to="/consultation"
                class="reveal-item reveal-item-scale mt-5 inline-flex w-full items-center justify-center rounded-2xl bg-green-deep px-4 py-3 text-sm font-semibold text-on-primary transition hover:bg-panel hover:text-ink"
                style="--reveal-i: 2"
              >
                رزرو نوبت
              </NuxtLink>
              <NuxtLink
                to="/contact"
                class="reveal-item reveal-item-scale mt-2 inline-flex w-full items-center justify-center rounded-2xl px-4 py-3 text-sm font-medium text-on-band ring-1 ring-white/25 transition hover:bg-white/10"
                style="--reveal-i: 3"
              >
                تماس با دفتر
              </NuxtLink>
            </div>
          </SiteReveal>
        </div>
      </aside>

      <div class="min-w-0 space-y-10 lg:col-span-9">
        <SiteReveal :variant="shell[0]" delay="40ms">
          <section id="overview" class="scroll-mt-28 rounded-[1.5rem] bg-mist p-6 ring-1 ring-mist-deep sm:p-8">
            <p class="reveal-item reveal-item-fade text-[11px] font-semibold tracking-[0.18em] text-gold" style="--reveal-i: 0">
              معرفی
            </p>
            <h2 class="reveal-item mt-2 text-2xl font-bold text-ink" style="--reveal-i: 1">
              <SiteTypeText
                text="چرا این کاتالوگ را بخوانید؟"
                :speed="24"
                :start-delay="100"
                as="span"
              />
            </h2>
            <p class="reveal-item reveal-item-left mt-4 text-[15px] leading-8 text-ink-muted" style="--reveal-i: 2">
              {{ item.excerpt }}
            </p>
          </section>
        </SiteReveal>

        <SiteReveal
          v-if="item.highlights.length"
          :variant="shell[1]"
          delay="50ms"
        >
          <section id="highlights" class="scroll-mt-28">
            <p class="reveal-item reveal-item-fade text-[11px] font-semibold tracking-[0.18em] text-gold" style="--reveal-i: 0">
              نکات کلیدی
            </p>
            <h2 class="reveal-item mt-2 text-2xl font-bold text-ink" style="--reveal-i: 1">
              آنچه در این مسیر مهم است
            </h2>
            <ul class="mt-6 grid gap-3 sm:grid-cols-2">
              <li
                v-for="(point, index) in item.highlights"
                :key="point"
                class="reveal-item flex gap-3 rounded-[1.25rem] bg-panel px-4 py-4 text-[14px] leading-7 text-ink ring-1 ring-mist-deep"
                :class="index % 2 === 0 ? 'reveal-item-left' : 'reveal-item-right'"
                :style="{ '--reveal-i': index + 2 }"
              >
                <span class="font-mono text-xs font-bold text-gold">
                  {{ String(index + 1).padStart(2, '0') }}
                </span>
                <span>{{ point }}</span>
              </li>
            </ul>
          </section>
        </SiteReveal>

        <SiteReveal :variant="shell[2]" delay="60ms">
          <section id="content" class="scroll-mt-28">
            <p class="reveal-item reveal-item-fade text-[11px] font-semibold tracking-[0.18em] text-gold" style="--reveal-i: 0">
              متن کامل
            </p>
            <h2 class="reveal-item mt-2 text-2xl font-bold text-ink" style="--reveal-i: 1">
              جزئیات مسیر همکاری
            </h2>
            <div class="mt-6 space-y-5">
              <p
                v-for="(paragraph, index) in item.paragraphs"
                :key="paragraph"
                class="reveal-item text-[15px] leading-8 text-ink-muted"
                :class="paraMotion[index % paraMotion.length]"
                :style="{ '--reveal-i': index + 2 }"
              >
                {{ paragraph }}
              </p>
            </div>
          </section>
        </SiteReveal>

        <SiteReveal
          v-if="item.gallery.length"
          variant="clip"
          delay="40ms"
        >
          <div id="gallery" class="scroll-mt-28">
            <CatalogGallery
              :images="item.gallery"
              title="گالری تصاویر این کاتالوگ"
            />
          </div>
        </SiteReveal>

        <SiteReveal
          v-if="item.pdfs.length"
          variant="bloom"
          delay="50ms"
        >
          <section
            id="pdfs"
            class="scroll-mt-28 overflow-hidden rounded-[1.5rem] bg-band text-on-band"
          >
            <div class="border-b border-white/10 px-5 py-5 sm:px-7">
              <p class="reveal-item reveal-item-fade text-[11px] font-semibold tracking-[0.16em] text-gold" style="--reveal-i: 0">
                دانلود
              </p>
              <h2 class="reveal-item mt-2 text-xl font-bold" style="--reveal-i: 1">
                <SiteTypeText
                  text="فایل‌های PDF برای مطالعه آفلاین"
                  :speed="24"
                  :start-delay="120"
                  as="span"
                />
              </h2>
              <p class="reveal-item reveal-item-right mt-2 text-[13px] leading-7 text-on-band/65" style="--reveal-i: 2">
                مناسب ارائه به خانواده یا مرور قبل از ویزیت.
              </p>
            </div>
            <ul class="space-y-2 p-5 sm:p-7">
              <li
                v-for="(file, index) in item.pdfs"
                :key="file.url"
                class="reveal-item"
                :class="index % 2 === 0 ? 'reveal-item-left' : 'reveal-item-scale'"
                :style="{ '--reveal-i': index + 3 }"
              >
                <a
                  :href="mediaSrc(file.url)"
                  target="_blank"
                  rel="noopener"
                  class="flex items-center justify-between gap-3 rounded-2xl bg-white/5 px-4 py-3.5 text-sm font-medium text-on-band ring-1 ring-white/15 transition hover:bg-green-deep hover:text-on-primary hover:ring-green-deep"
                >
                  <span>دریافت {{ file.title }}</span>
                  <span aria-hidden="true">↓</span>
                </a>
              </li>
            </ul>
          </section>
        </SiteReveal>

        <SiteReveal variant="slide" delay="40ms">
          <section class="flex flex-col gap-4 rounded-[1.5rem] bg-mist px-6 py-8 ring-1 ring-mist-deep sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <div class="max-w-xl">
              <p class="reveal-item reveal-item-fade text-[11px] font-semibold tracking-[0.16em] text-gold" style="--reveal-i: 0">
                آماده اقدام؟
              </p>
              <p class="reveal-item mt-2 text-lg font-bold leading-8 text-ink" style="--reveal-i: 1">
                همین امروز مسیر درمان را روشن کنید
              </p>
            </div>
            <div class="flex flex-col gap-2 sm:flex-row">
              <NuxtLink
                to="/consultation"
                class="reveal-item reveal-item-scale inline-flex items-center justify-center rounded-2xl bg-band px-5 py-3 text-sm font-semibold text-on-band transition hover:bg-green-deep hover:text-on-primary"
                style="--reveal-i: 2"
              >
                رزرو نوبت
              </NuxtLink>
              <NuxtLink
                to="/practice-areas"
                class="reveal-item reveal-item-drop inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-medium text-ink ring-1 ring-mist-deep transition hover:bg-panel"
                style="--reveal-i: 3"
              >
                خدمات
              </NuxtLink>
            </div>
          </section>
        </SiteReveal>

        <SiteReveal
          v-if="related.length"
          variant="up"
          delay="40ms"
        >
          <section id="related" class="scroll-mt-28">
            <p class="reveal-item reveal-item-fade text-[11px] font-semibold tracking-[0.18em] text-gold" style="--reveal-i: 0">
              ادامه مطالعه
            </p>
            <h2 class="reveal-item mt-2 text-2xl font-bold text-ink" style="--reveal-i: 1">
              کاتالوگ‌های مرتبط
            </h2>
            <ul class="mt-6 grid gap-4 sm:grid-cols-3">
              <li
                v-for="(entry, index) in related"
                :key="entry.id"
                class="reveal-item reveal-item-scale"
                :style="{ '--reveal-i': index + 2 }"
              >
                <NuxtLink
                  :to="entry.href"
                  class="group flex h-full flex-col overflow-hidden rounded-[1.25rem] bg-mist ring-1 ring-mist-deep transition hover:-translate-y-1 hover:bg-panel hover:ring-gold/35"
                >
                  <div class="relative aspect-[16/10] overflow-hidden bg-mist">
                    <img
                      :src="mediaSrc(entry.coverImage)"
                      :alt="entry.title"
                      class="home-media-shift size-full object-cover"
                      width="480"
                      height="300"
                      loading="lazy"
                    >
                  </div>
                  <div class="flex flex-1 flex-col p-4">
                    <h3 class="text-sm font-semibold leading-7 text-ink group-hover:text-green-deep">
                      {{ entry.title }}
                    </h3>
                    <p class="mt-1 line-clamp-2 text-[12px] leading-6 text-ink-muted">
                      {{ entry.excerpt }}
                    </p>
                  </div>
                </NuxtLink>
              </li>
            </ul>
          </section>
        </SiteReveal>
      </div>
    </div>
  </article>
</template>
