<script setup lang="ts">
import { serviceModule } from '~/modules'
import { ServiceModel } from '~/modules/service/models/index.model'
import type { RevealVariant } from '~/components/SiteReveal.vue'

const route = useRoute()
const slug = computed(() => String(route.params.slug || ''))

const { data, error } = await useAsyncData(
  () => `service-${slug.value}`,
  async () => {
    const res = await serviceModule.controller.getServiceBySlug(slug.value)
    if (!res.success || !res.data) return null
    return res.data
  },
  { watch: [slug] },
)

if (error.value || !data.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'خدمت یافت نشد',
  })
}

const service = computed(() => new ServiceModel(data.value!))
const mediaSrc = useMediaSrc()

const related = computed(() =>
  serviceModule.store.getVisibleItems
    .filter((item) => item.id !== service.value.id)
    .slice(0, 3),
)

onMounted(() => {
  if (!serviceModule.store.getVisibleItems.length) {
    serviceModule.controller.getServiceList()
  }
})

const sectionShell = [
  'left',
  'right',
  'up',
  'rise',
  'tilt',
  'clip',
  'bloom',
  'slide',
] as const satisfies readonly RevealVariant[]

usePageSeo({
  title: () => service.value.displaySeoTitle,
  description: () => service.value.displaySeoDescription,
  keywords: () => service.value.seoKeywords || undefined,
  image: () => service.value.coverImage || '/services/hero.jpg',
  path: () => service.value.href,
})

useSchemaOrg([
  defineBreadcrumb({
    itemListElement: [
      { name: 'خانه', item: '/' },
      { name: 'خدمات', item: '/practice-areas' },
      { name: () => service.value.title, item: () => service.value.href },
    ],
  }),
])
</script>

<template>
  <article class="bg-mist">
    <!-- Split editorial hero -->
    <SiteReveal variant="fade" delay="0ms">
      <header class="relative overflow-hidden">
        <div
          class="pointer-events-none absolute -left-24 top-10 size-[26rem] rounded-full bg-green-deep/15 blur-3xl"
          aria-hidden="true"
        />
        <div
          class="pointer-events-none absolute -right-20 bottom-0 size-[18rem] rounded-full bg-band/10 blur-3xl"
          aria-hidden="true"
        />

        <div class="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-12 lg:gap-12 lg:px-8 lg:py-20">
          <div class="lg:col-span-6">
            <SiteReveal variant="drop" delay="40ms">
              <NuxtLink
                to="/practice-areas"
                class="inline-flex items-center gap-2 text-sm font-medium text-ink-muted transition hover:text-ink"
              >
                <span class="inline-flex size-9 items-center justify-center rounded-full bg-panel text-lg leading-none ring-1 ring-mist-deep">←</span>
                بازگشت به خدمات
              </NuxtLink>
            </SiteReveal>

            <SiteReveal variant="right" delay="90ms">
              <div class="mt-7 flex items-center gap-4">
                <span
                  class="inline-flex size-16 shrink-0 items-center justify-center rounded-2xl bg-panel shadow-sm ring-1 ring-mist-deep"
                  aria-hidden="true"
                >
                  <span
                    class="inline-block size-9 bg-ink"
                    :style="{
                      maskImage: `url(${mediaSrc(service.icon)})`,
                      WebkitMaskImage: `url(${mediaSrc(service.icon)})`,
                      maskRepeat: 'no-repeat',
                      WebkitMaskRepeat: 'no-repeat',
                      maskPosition: 'center',
                      WebkitMaskPosition: 'center',
                      maskSize: 'contain',
                      WebkitMaskSize: 'contain',
                    }"
                  />
                </span>
                <p class="text-[11px] font-semibold tracking-[0.22em] text-gold">
                  خدمات کلینیک امیر رحمتی
                </p>
              </div>
            </SiteReveal>

            <h1 class="mt-5 min-h-[3.5rem] text-3xl font-bold tracking-tight text-ink sm:min-h-[4.5rem] sm:text-5xl sm:leading-[1.2]">
              <SiteTypeText
                :key="service.slug"
                as="span"
                :text="service.title"
                :speed="30"
                :start-delay="160"
              />
            </h1>

            <SiteReveal variant="up" delay="180ms">
              <p class="mt-5 max-w-xl text-[15px] leading-8 text-ink-muted">
                {{ service.description }}
              </p>
            </SiteReveal>

            <SiteReveal variant="soft" delay="240ms">
              <div class="mt-8 flex flex-wrap gap-3">
                <NuxtLink
                  to="/consultation"
                  class="inline-flex rounded-2xl bg-band px-5 py-3 text-sm font-semibold text-on-band transition hover:bg-green-deep hover:text-on-primary"
                >
                  رزرو نوبت
                </NuxtLink>
                <NuxtLink
                  to="/guides"
                  class="inline-flex rounded-2xl bg-panel px-5 py-3 text-sm font-medium text-ink ring-1 ring-mist-deep transition hover:bg-mist"
                >
                  راهنماهای مرتبط
                </NuxtLink>
              </div>
            </SiteReveal>
          </div>

          <SiteReveal variant="left" delay="110ms" class="lg:col-span-6">
            <div class="relative">
              <div class="absolute -inset-3 rounded-[2rem] bg-gradient-to-bl from-green-deep/20 to-band/10 blur-2xl" aria-hidden="true" />
              <div class="relative overflow-hidden rounded-[1.75rem] bg-band shadow-[0_30px_80px_rgba(6,54,55,0.22)]">
                <div class="relative aspect-[16/11]">
                  <img
                    :src="mediaSrc(service.coverImage || '/services/hero.jpg')"
                    :alt="service.title"
                    class="home-media-shift size-full object-cover opacity-85"
                    width="960"
                    height="660"
                  >
                  <div class="absolute inset-0 bg-gradient-to-t from-band via-band/20 to-transparent" />
                  <div class="absolute inset-x-0 top-0 p-5 sm:p-6">
                    <div class="inline-flex flex-col rounded-2xl bg-panel px-4 py-3 shadow-[0_12px_30px_rgba(6,54,55,0.16)]">
                      <p class="text-[11px] font-medium text-ink-muted">دکتر امیر رحمتی</p>
                      <p class="mt-0.5 text-sm font-semibold text-ink">همین خدمت، طرح درمان شفاف</p>
                    </div>
                  </div>
                  <div class="absolute inset-x-0 bottom-0 p-6 sm:p-7">
                    <p class="text-[11px] tracking-[0.18em] text-gold">امیر رحمتی</p>
                    <p class="mt-2 text-lg font-semibold text-on-band">{{ service.title }}</p>
                  </div>
                </div>
              </div>
            </div>
          </SiteReveal>
        </div>
      </header>
    </SiteReveal>

    <!-- Content + sticky -->
    <div class="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-12 lg:gap-12 lg:px-8">
      <div class="min-w-0 space-y-8 lg:col-span-8">
        <template v-if="service.hasSections">
          <SiteReveal
            v-for="(section, idx) in service.sections"
            :key="`${service.slug}-sec-${idx}`"
            :variant="sectionShell[idx % sectionShell.length]"
            :delay="`${36 + (idx % 5) * 36}ms`"
          >
            <!-- Alternating editorial shells -->
            <section
              class="scroll-mt-28 overflow-hidden"
              :class="
                idx % 3 === 1
                  ? 'rounded-[1.6rem] bg-band p-6 text-on-band sm:p-8'
                  : idx % 3 === 2
                    ? 'grid gap-6 rounded-[1.6rem] bg-panel p-6 ring-1 ring-mist-deep sm:grid-cols-12 sm:p-8'
                    : 'rounded-[1.6rem] bg-panel p-6 ring-1 ring-mist-deep sm:p-8'
              "
            >
              <div :class="idx % 3 === 2 ? 'sm:col-span-4' : ''">
                <p
                  class="reveal-item reveal-item-fade font-mono text-[11px] font-semibold tracking-[0.2em]"
                  :class="idx % 3 === 1 ? 'text-gold' : 'text-gold'"
                  :style="{ '--reveal-i': 0 }"
                >
                  {{ String(idx + 1).padStart(2, '0') }}
                </p>

                <h2
                  v-if="section.title"
                  class="reveal-item mt-3 text-xl font-bold sm:text-2xl"
                  :class="idx % 3 === 1 ? 'text-on-band' : 'text-ink'"
                  :style="{ '--reveal-i': 1 }"
                >
                  <SiteTypeText
                    :key="`${service.slug}-t-${idx}`"
                    as="span"
                    :text="section.title"
                    :speed="24"
                    :start-delay="120 + (idx % 3) * 40"
                    :caret="idx === 0"
                  />
                </h2>
              </div>

              <div :class="idx % 3 === 2 ? 'sm:col-span-8' : section.title ? 'mt-4' : ''">
                <p
                  v-if="section.type === 'text' && section.content"
                  class="reveal-item whitespace-pre-line text-[15px] leading-8"
                  :class="
                    idx % 3 === 1
                      ? 'reveal-item-fade text-on-band/75'
                      : idx % 2 === 0
                        ? 'reveal-item-left text-ink-muted'
                        : 'reveal-item-right text-ink-muted'
                  "
                  :style="{ '--reveal-i': 2 }"
                >
                  {{ section.content }}
                </p>

                <ol
                  v-else-if="section.type === 'list' && section.items?.length"
                  class="space-y-3"
                >
                  <li
                    v-for="(entry, i) in section.items"
                    :key="i"
                    class="reveal-item flex gap-3 text-[15px] leading-7"
                    :class="[
                      idx % 3 === 1 ? 'text-on-band' : 'text-ink',
                      i % 2 === 0 ? 'reveal-item-left' : 'reveal-item-right',
                    ]"
                    :style="{ '--reveal-i': i + 2 }"
                  >
                    <span
                      class="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-xl font-mono text-xs font-bold ring-1"
                      :class="
                        idx % 3 === 1
                          ? 'bg-white/10 text-gold ring-white/15'
                          : 'bg-mist text-ink ring-mist-deep'
                      "
                    >
                      {{ String(i + 1).padStart(2, '0') }}
                    </span>
                    <span class="pt-1">{{ entry }}</span>
                  </li>
                </ol>
              </div>
            </section>
          </SiteReveal>
        </template>

        <!-- Case path timeline -->
        <SiteReveal
          v-if="service.hasCasePath"
          variant="bloom"
          delay="60ms"
        >
          <section class="overflow-hidden rounded-[1.6rem] bg-band p-6 text-on-band sm:p-8">
            <p class="reveal-item reveal-item-fade text-[11px] font-semibold tracking-[0.2em] text-gold" style="--reveal-i: 0">
              مسیر درمان
            </p>
            <h2 class="reveal-item mt-3 text-xl font-bold sm:text-2xl" style="--reveal-i: 1">
              <SiteTypeText
                :key="`${service.slug}-case`"
                as="span"
                :text="service.casePathTitle || 'مسیر درمان'"
                :speed="26"
                :start-delay="140"
              />
            </h2>
            <p
              v-if="service.casePathDescription"
              class="reveal-item reveal-item-right mt-4 max-w-2xl text-[15px] leading-8 text-on-band/75"
              style="--reveal-i: 2"
            >
              {{ service.casePathDescription }}
            </p>
            <div class="reveal-item reveal-item-scale mt-7 h-px w-full bg-gradient-to-l from-transparent via-gold/50 to-transparent" style="--reveal-i: 3" aria-hidden="true" />
            <p class="reveal-item reveal-item-slide mt-5 text-sm text-on-band/55" style="--reveal-i: 4">
              از ارزیابی اولیه تا اقدام عملی — مسیر را شفاف جلو می‌بریم.
            </p>
          </section>
        </SiteReveal>

        <!-- Documents -->
        <SiteReveal
          v-if="service.hasDocuments"
          variant="rise"
          delay="80ms"
        >
          <section class="overflow-hidden rounded-[1.6rem] bg-panel p-6 ring-1 ring-mist-deep sm:p-8">
            <div class="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p class="reveal-item reveal-item-fade text-[11px] font-semibold tracking-[0.2em] text-gold" style="--reveal-i: 0">
                  آماده‌سازی
                </p>
                <h2 class="reveal-item mt-2 text-xl font-bold text-ink sm:text-2xl" style="--reveal-i: 1">
                  <SiteTypeText
                    :key="`${service.slug}-docs`"
                    text="مدارک مورد نیاز"
                    :speed="28"
                    :start-delay="100"
                    as="span"
                  />
                </h2>
              </div>
              <p class="reveal-item reveal-item-drop text-sm text-ink-muted" style="--reveal-i: 2">
                {{ service.requiredDocuments?.length }} مورد
              </p>
            </div>

            <ul class="mt-6 grid gap-3 sm:grid-cols-2">
              <li
                v-for="(doc, i) in service.requiredDocuments"
                :key="i"
                class="reveal-item flex items-start gap-3 rounded-2xl bg-mist px-4 py-3.5 text-[15px] leading-7 text-ink"
                :class="i % 2 === 0 ? 'reveal-item-left' : 'reveal-item-right'"
                :style="{ '--reveal-i': i + 3 }"
              >
                <span class="mt-2 size-2 shrink-0 rotate-45 bg-gold" aria-hidden="true" />
                <span>{{ doc }}</span>
              </li>
            </ul>
          </section>
        </SiteReveal>
      </div>

      <!-- Sticky side: sticky outside SiteReveal so transform/overflow don't kill it -->
      <aside class="lg:col-span-4">
        <div class="sticky top-24 space-y-4">
          <SiteReveal variant="zoom" delay="120ms">
            <div class="overflow-hidden rounded-[1.6rem] bg-band p-6 text-on-band shadow-[0_24px_55px_rgba(6,54,55,0.2)] sm:p-7">
              <p class="reveal-item reveal-item-fade text-[11px] font-semibold tracking-[0.18em] text-gold" style="--reveal-i: 0">
                مراقبت تخصصی
              </p>
              <h3 class="reveal-item reveal-item-drop mt-3 text-xl font-bold leading-8" style="--reveal-i: 1">
                درمان «{{ service.title }}» را با هماهنگی نوبت شروع کنید
              </h3>
              <p class="reveal-item reveal-item-fade mt-3 text-sm leading-7 text-on-band/70" style="--reveal-i: 2">
                جلسه اول برای بررسی اولیه و پیشنهاد مسیر در نظر گرفته می‌شود.
              </p>
              <NuxtLink
                to="/consultation"
                class="reveal-item reveal-item-scale mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-green-deep px-5 py-3 text-sm font-semibold text-on-primary transition hover:bg-panel hover:text-ink"
                style="--reveal-i: 3"
              >
                رزرو نوبت
              </NuxtLink>
              <NuxtLink
                to="/contact"
                class="reveal-item reveal-item-scale mt-3 inline-flex w-full items-center justify-center rounded-2xl px-5 py-3 text-sm font-medium text-on-band ring-1 ring-white/25 transition hover:bg-white/10"
                style="--reveal-i: 4"
              >
                تماس با دفتر
              </NuxtLink>
            </div>
          </SiteReveal>

          <SiteReveal
            v-if="related.length"
            variant="up"
            delay="160ms"
          >
            <div class="rounded-[1.5rem] bg-panel p-5 ring-1 ring-mist-deep sm:p-6">
              <p class="reveal-item reveal-item-fade text-[11px] font-semibold tracking-[0.18em] text-gold" style="--reveal-i: 0">
                خدمات دیگر
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
                    class="flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink transition hover:bg-mist"
                  >
                    <span class="truncate">{{ item.title }}</span>
                    <span class="text-lg leading-none text-gold">←</span>
                  </NuxtLink>
                </li>
              </ul>
            </div>
          </SiteReveal>
        </div>
      </aside>
    </div>

    <!-- Bottom CTA -->
    <SiteReveal variant="slide" delay="40ms">
      <section class="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div class="grid gap-6 overflow-hidden rounded-[1.75rem] bg-panel p-8 ring-1 ring-mist-deep sm:p-10 lg:grid-cols-12 lg:items-center">
          <div class="lg:col-span-8">
            <p class="reveal-item reveal-item-fade text-[11px] font-semibold tracking-[0.2em] text-gold" style="--reveal-i: 0">
              گام بعدی
            </p>
            <h2 class="reveal-item mt-3 text-2xl font-bold text-ink sm:text-3xl" style="--reveal-i: 1">
              <SiteTypeText
                text="آماده‌اید مسیر درمان را شفاف کنیم؟"
                :speed="26"
                :start-delay="200"
                as="span"
              />
            </h2>
            <p class="reveal-item reveal-item-right mt-4 max-w-xl text-sm leading-8 text-ink-muted" style="--reveal-i: 2">
              اگر سابقه درمان دارید یا فقط می‌خواهید معاینه اولیه بگیرید، از رزرو نوبت شروع کنید.
            </p>
          </div>
          <div class="flex flex-wrap gap-3 lg:col-span-4 lg:justify-end">
            <NuxtLink
              to="/consultation"
              class="reveal-item reveal-item-scale inline-flex rounded-2xl bg-band px-5 py-3 text-sm font-semibold text-on-band transition hover:bg-green-deep hover:text-on-primary"
              style="--reveal-i: 3"
            >
              رزرو نوبت
            </NuxtLink>
            <NuxtLink
              to="/articles"
              class="reveal-item reveal-item-drop inline-flex rounded-2xl px-5 py-3 text-sm font-medium text-ink ring-1 ring-mist-deep transition hover:bg-mist"
              style="--reveal-i: 4"
            >
              مقالات مرتبط
            </NuxtLink>
          </div>
        </div>
      </section>
    </SiteReveal>
  </article>
</template>
