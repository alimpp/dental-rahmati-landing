<script setup lang="ts">
import { serviceModule } from '~/modules'

const serviceDS = serviceModule.store
const serviceController = serviceModule.controller
const items = computed(() => serviceDS.getVisibleItems)
const mediaSrc = useMediaSrc()
const loading = computed(() => serviceDS.getLoading)
const lead = computed(() => items.value[0] ?? null)
const rest = computed(() => items.value.slice(1, 5))

onMounted(() => {
  serviceController.getServiceList()
})
</script>

<template>
  <section class="bg-surface py-16 sm:py-20 lg:py-24">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex flex-wrap items-end justify-between gap-5">
        <div class="max-w-2xl">
          <p class="text-[11px] font-semibold tracking-[0.2em] text-gold">
            خدمات
          </p>
          <h2 class="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            هر نیاز، درمان متناسب همان خدمت
          </h2>
          <p class="mt-4 max-w-2xl text-[15px] leading-8 text-ink-muted">
            از معاینه و پیشگیری تا ترمیم، زیبایی، لمینت و ایمپلنت در کرج جهانشهر —
            هر خدمت با توضیح شفاف و برنامه درمانی مشخص.
          </p>
        </div>
        <NuxtLink
          to="/practice-areas"
          class="inline-flex rounded-2xl bg-green-deep px-5 py-3 text-sm font-semibold text-on-primary transition hover:opacity-90"
        >
          همه خدمات
        </NuxtLink>
      </div>

      <div
        v-if="loading && !items.length"
        class="mt-12 py-16 text-center text-ink-muted"
      >
        در حال بارگذاری خدمات...
      </div>

      <div
        v-else-if="!items.length"
        class="mt-12 py-16 text-center text-ink-muted"
      >
        خدمتی برای نمایش وجود ندارد.
      </div>

      <div
        v-else
        class="mt-12 grid gap-5 lg:grid-cols-12"
      >
        <NuxtLink
          v-if="lead"
          :to="lead.href"
          class="group relative min-h-[16rem] overflow-hidden rounded-[1.5rem] bg-band lg:col-span-5 lg:min-h-full"
        >
          <img
            src="/services/hero.jpg"
            :alt="lead.title"
            class="absolute inset-0 size-full object-cover opacity-45"
            width="900"
            height="1100"
          >
          <div class="absolute inset-0 bg-gradient-to-t from-band via-band/70 to-band/30" />
          <div class="relative z-10 flex h-full flex-col justify-end p-6 sm:p-7">
            <span
              class="mb-4 inline-flex size-14 items-center justify-center rounded-2xl bg-on-band/10 backdrop-blur"
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
            <h3 class="text-2xl font-bold text-on-band sm:text-3xl">
              {{ lead.title }}
            </h3>
            <p class="mt-3 max-w-md text-sm leading-7 text-on-band/75">
              {{ lead.description }}
            </p>
            <span class="mt-6 text-sm font-semibold text-gold">جزئیات خدمت</span>
          </div>
        </NuxtLink>

        <ul class="grid gap-4 sm:grid-cols-2 lg:col-span-7">
          <li
            v-for="item in rest"
            :key="item.id"
          >
            <NuxtLink
              :to="item.href"
              class="group flex h-full flex-col rounded-[1.25rem] bg-mist p-5 ring-1 ring-mist-deep transition hover:bg-surface hover:ring-gold/35"
            >
              <span
                class="mb-3 inline-flex size-12 items-center justify-center rounded-xl bg-surface ring-1 ring-mist-deep"
                aria-hidden="true"
              >
                <span
                  class="inline-block size-7 bg-ink transition group-hover:bg-green-deep"
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
              <h3 class="text-lg font-bold text-ink transition group-hover:text-green-deep">
                {{ item.title }}
              </h3>
              <p class="mt-2 line-clamp-2 flex-1 text-sm leading-7 text-ink-muted">
                {{ item.description }}
              </p>
            </NuxtLink>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>
