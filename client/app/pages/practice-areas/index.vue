<script setup lang="ts">
import { serviceModule } from '~/modules'

const serviceDS = serviceModule.store
const serviceController = serviceModule.controller
const items = computed(() => serviceDS.getVisibleItems)
const mediaSrc = useMediaSrc()
const loading = computed(() => serviceDS.getLoading)
const lead = computed(() => items.value[0] ?? null)
const rest = computed(() => items.value.slice(1))

await serviceController.getServiceList()

usePageSeo({
  title: 'خدمات دندانپزشکی در کرج | دیجیتال، ایمپلنت، لمینت',
  description:
    'فهرست خدمات کلینیک امیر رحمتی در کرج جهانشهر: دندان‌پزشکی دیجیتال، ایمپلنت، لمینت، ارتودنسی، جرم‌گیری، کودکان و اورژانس.',
  keywords:
    'خدمات دندانپزشکی کرج, ایمپلنت در کرج, لمینت دندان کرج, دندان پزشکی دیجیتال در کرج, ارتودنسی کرج, کلینیک جهانشهر',
  path: '/practice-areas',
  image: '/services/dental-smile.jpg',
})
</script>

<template>
  <div class="bg-surface">
    <!-- Split hero -->
    <SiteReveal variant="fade">
      <section class="relative overflow-hidden bg-mist">
        <div
          class="pointer-events-none absolute -left-24 top-0 size-[24rem] rounded-full bg-green-deep/15 blur-3xl"
          aria-hidden="true"
        />
        <div
          class="pointer-events-none absolute -right-16 bottom-0 size-[18rem] rounded-full bg-band/8 blur-3xl"
          aria-hidden="true"
        />

        <div class="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-12 lg:px-8 lg:py-20">
          <div class="lg:col-span-6">
            <p class="text-[11px] font-semibold tracking-[0.24em] text-gold">
              خدمات کلینیک
            </p>
            <h1 class="mt-4 text-3xl font-bold tracking-tight text-ink sm:text-5xl sm:leading-[1.2]">
              خدمات دندانپزشکی؛
              <span class="text-ink-muted">با دقت و تخصص</span>
            </h1>
            <p class="mt-5 max-w-lg text-[15px] leading-8 text-ink-muted">
              هر درمان با توجه به نیاز شما برنامه‌ریزی می‌شود — برای سلامت دهان، زیبایی لبخند و آرامش در ویزیت.
            </p>
            <div class="mt-8 flex flex-wrap gap-3">
              <span class="rounded-2xl bg-panel px-4 py-2 text-sm font-medium text-ink ring-1 ring-mist-deep">
                {{ items.length }} خدمت فعال
              </span>
              <NuxtLink
                to="/consultation"
                class="rounded-2xl bg-band px-4 py-2 text-sm font-semibold text-on-band transition hover:bg-green-deep hover:text-on-primary"
              >
                رزرو نوبت
              </NuxtLink>
              <NuxtLink
                to="/articles"
                class="rounded-2xl px-4 py-2 text-sm font-medium text-ink ring-1 ring-mist-deep transition hover:bg-panel"
              >
                مقالات
              </NuxtLink>
            </div>
          </div>

          <div class="relative lg:col-span-6">
            <div class="absolute -inset-3 rounded-[2rem] bg-gradient-to-bl from-green-deep/20 to-band/10 blur-2xl" aria-hidden="true" />
            <div class="relative overflow-hidden rounded-[1.75rem] bg-band shadow-[0_30px_80px_rgba(6,54,55,0.22)]">
              <div class="relative aspect-[16/11]">
                <img
                  src="/services/hero.jpg"
                  alt="خدمات کلینیک دندان‌پزشکی امیر رحمتی"
                  class="size-full object-cover opacity-80"
                  width="960"
                  height="660"
                >
                <div class="absolute inset-0 bg-gradient-to-t from-band via-band/25 to-transparent" />
                <div class="absolute inset-x-0 top-0 p-5 sm:p-6">
                  <div class="inline-flex flex-col rounded-2xl bg-panel px-4 py-3 shadow-[0_12px_30px_rgba(6,54,55,0.16)]">
                    <p class="text-[11px] font-medium text-ink-muted">تخصص واقعی</p>
                    <p class="mt-0.5 text-sm font-semibold text-ink">هر خدمت، با برنامه درمانی شفاف</p>
                  </div>
                </div>
                <div class="absolute inset-x-0 bottom-0 p-6 sm:p-7">
                  <p class="text-[11px] tracking-[0.18em] text-gold">امیر رحمتی</p>
                  <p class="mt-2 max-w-sm text-lg font-semibold text-on-band">
                    از معاینه و ترمیم تا زیبایی و ایمپلنت
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </SiteReveal>

    <SiteReveal variant="up" delay="40ms">
      <section class="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div v-if="loading && !items.length" class="py-20 text-center text-ink-muted">
          در حال بارگذاری...
        </div>

        <div
          v-else-if="!items.length"
          class="rounded-[1.5rem] bg-mist px-6 py-16 text-center text-ink-muted"
        >
          خدمتی برای نمایش وجود ندارد.
        </div>

        <template v-else>
          <div class="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p class="text-[11px] font-semibold tracking-[0.2em] text-gold">فهرست خدمات</p>
              <h2 class="mt-2 text-2xl font-bold text-ink sm:text-3xl">
                خدمت مورد نیاز خود را انتخاب کنید
              </h2>
            </div>
            <p class="text-sm text-ink-muted">{{ items.length }} مورد</p>
          </div>

          <!-- Featured lead -->
          <NuxtLink
            v-if="lead"
            :to="lead.href"
            class="group mb-6 grid overflow-hidden rounded-[1.75rem] bg-band shadow-[0_24px_60px_rgba(6,54,55,0.16)] lg:grid-cols-12"
          >
            <div class="relative aspect-[16/11] overflow-hidden lg:col-span-5 lg:aspect-auto lg:min-h-[14rem]">
              <img
                :src="mediaSrc(lead.coverImage || '/services/hero.jpg')"
                :alt="lead.title"
                class="home-media-shift size-full object-cover opacity-75"
                width="800"
                height="560"
              >
              <div class="absolute inset-0 bg-gradient-to-l from-band/80 via-transparent to-transparent max-lg:hidden" />
              <div class="absolute inset-0 bg-gradient-to-t from-band/70 via-transparent to-transparent lg:hidden" />
            </div>
            <div class="flex flex-col justify-center p-7 sm:p-9 lg:col-span-7">
              <span
                class="mb-5 inline-flex size-14 items-center justify-center rounded-2xl bg-on-band/10"
                aria-hidden="true"
              >
                <span
                  class="inline-block size-8 bg-gold"
                  :style="{
                    maskImage: `url(${mediaSrc(lead.icon)})`,
                    WebkitMaskImage: `url(${mediaSrc(lead.icon)})`,
                    maskRepeat: 'no-repeat',
                    WebkitMaskRepeat: 'no-repeat',
                    maskPosition: 'center',
                    WebkitMaskPosition: 'center',
                    maskSize: 'contain',
                    WebkitMaskSize: 'contain',
                  }"
                />
              </span>
              <p class="text-[11px] font-medium tracking-[0.16em] text-gold">خدمت ویژه</p>
              <h2 class="mt-2 text-2xl font-bold text-on-band sm:text-3xl">
                {{ lead.title }}
              </h2>
              <p class="mt-4 max-w-xl text-sm leading-8 text-on-band/70">
                {{ lead.description }}
              </p>
              <span class="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-green-deep">
                جزئیات این خدمت
                <span class="h-px w-8 bg-green-deep transition-all group-hover:w-12" aria-hidden="true" />
              </span>
            </div>
          </NuxtLink>

          <!-- Stacked editorial rows -->
          <ul class="space-y-4">
            <li
              v-for="(item, index) in rest"
              :key="item.id"
              class="reveal-item reveal-item-left"
              :style="{ '--reveal-i': index }"
            >
              <NuxtLink
                :to="item.href"
                class="group grid overflow-hidden rounded-[1.5rem] bg-mist ring-1 ring-mist-deep transition hover:bg-panel hover:shadow-[0_22px_50px_rgba(6,54,55,0.1)] hover:ring-gold/35 md:grid-cols-12"
              >
                <div class="flex items-center gap-4 border-b border-mist-deep/70 p-5 md:col-span-4 md:border-b-0 md:border-l md:border-mist-deep/70 md:p-6">
                  <span
                    class="inline-flex size-14 shrink-0 items-center justify-center rounded-2xl bg-panel ring-1 ring-mist-deep transition group-hover:bg-band"
                    aria-hidden="true"
                  >
                    <span
                      class="inline-block size-8 bg-ink transition group-hover:bg-gold"
                      :style="{
                        maskImage: `url(${mediaSrc(item.icon)})`,
                        WebkitMaskImage: `url(${mediaSrc(item.icon)})`,
                        maskRepeat: 'no-repeat',
                        WebkitMaskRepeat: 'no-repeat',
                        maskPosition: 'center',
                        WebkitMaskPosition: 'center',
                        maskSize: 'contain',
                        WebkitMaskSize: 'contain',
                      }"
                    />
                  </span>
                  <div class="min-w-0">
                    <span class="font-mono text-[11px] font-semibold tracking-widest text-gold">
                      {{ String(index + 2).padStart(2, '0') }}
                    </span>
                    <h2 class="mt-1 text-lg font-bold text-ink transition group-hover:text-green-deep sm:text-xl">
                      {{ item.title }}
                    </h2>
                  </div>
                </div>

                <div class="flex flex-col justify-center gap-4 p-5 sm:flex-row sm:items-center sm:justify-between md:col-span-8 md:p-6">
                  <p class="line-clamp-3 max-w-2xl text-sm leading-7 text-ink-muted">
                    {{ item.description }}
                  </p>
                  <span class="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-ink">
                    مشاهده
                    <span class="inline-flex size-10 items-center justify-center rounded-full bg-band text-xl leading-none text-on-band transition group-hover:bg-green-deep group-hover:text-on-primary">
                      ←
                    </span>
                  </span>
                </div>
              </NuxtLink>
            </li>
          </ul>

          <!-- CTA band -->
          <div class="mt-14 grid gap-6 overflow-hidden rounded-[1.75rem] bg-band p-8 text-on-band sm:p-10 lg:grid-cols-12 lg:items-center">
            <div class="lg:col-span-8">
              <p class="text-[11px] font-semibold tracking-[0.2em] text-gold">مطمئن نیستید کدام خدمت؟</p>
              <h2 class="mt-3 text-2xl font-bold sm:text-3xl">
                در ویزیت اول، مسیر درست را مشخص می‌کنیم
              </h2>
              <p class="mt-4 max-w-xl text-sm leading-8 text-on-band/70">
                اگر بین چند گزینه مردد هستید، کافی است علائم را کوتاه بگویید تا خدمت و گام بعدی روشن شود.
              </p>
            </div>
            <div class="flex flex-wrap gap-3 lg:col-span-4 lg:justify-end">
              <NuxtLink
                to="/consultation"
                class="inline-flex rounded-2xl bg-green-deep px-5 py-3 text-sm font-semibold text-on-primary transition hover:bg-panel hover:text-ink"
              >
                رزرو نوبت
              </NuxtLink>
              <NuxtLink
                to="/articles"
                class="inline-flex rounded-2xl px-5 py-3 text-sm font-medium text-on-band ring-1 ring-on-band/25 transition hover:bg-on-band/10"
              >
                مقالات
              </NuxtLink>
            </div>
          </div>
        </template>
      </section>
    </SiteReveal>
  </div>
</template>
