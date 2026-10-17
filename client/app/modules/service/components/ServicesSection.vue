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
  <section class="bg-white py-16 sm:py-20 lg:py-24">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex flex-wrap items-end justify-between gap-5">
        <div class="max-w-2xl">
          <p class="reveal-item reveal-item-fade text-[11px] font-semibold tracking-[0.2em] text-gold" style="--reveal-i: 0">
            خدمات
          </p>
          <h2 class="reveal-item mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl" style="--reveal-i: 1">
            هر نیاز، درمان متناسب همان خدمت
          </h2>
          <p class="reveal-item reveal-item-fade mt-4 max-w-xl text-[15px] leading-8 text-ink-muted" style="--reveal-i: 2">
            از معاینه تا زیبایی و ایمپلنت — با توضیح شفاف و برنامه درمانی مشخص.
          </p>
        </div>
        <NuxtLink
          to="/practice-areas"
          class="reveal-item reveal-item-scale inline-flex rounded-2xl bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-deep hover:text-ink"
          style="--reveal-i: 3"
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
          class="reveal-item reveal-item-scale group relative min-h-[22rem] overflow-hidden rounded-[1.75rem] bg-ink lg:col-span-5 lg:min-h-full"
          style="--reveal-i: 4"
        >
          <img
            src="/services/hero.jpg"
            :alt="lead.title"
            class="home-media-shift absolute inset-0 size-full object-cover opacity-50"
            width="900"
            height="1100"
          >
          <div class="absolute inset-0 bg-gradient-to-t from-ink via-ink/65 to-ink/25" />
          <div class="relative z-10 flex h-full flex-col justify-end p-7 sm:p-8">
            <span
              class="mb-5 inline-flex size-12 items-center justify-center rounded-2xl bg-white/10 backdrop-blur"
              aria-hidden="true"
            >
              <span
                class="inline-block size-6 bg-gold"
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
            <h3 class="text-2xl font-bold text-white sm:text-3xl">
              {{ lead.title }}
            </h3>
            <p class="mt-3 max-w-md text-sm leading-7 text-white/75">
              {{ lead.description }}
            </p>
            <span class="mt-6 text-sm font-semibold text-gold">جزئیات خدمت ←</span>
          </div>
        </NuxtLink>

        <ul class="grid gap-4 sm:grid-cols-2 lg:col-span-7">
          <li
            v-for="(item, index) in rest"
            :key="item.id"
            class="reveal-item reveal-item-left"
            :style="{ '--reveal-i': index + 5 }"
          >
            <NuxtLink
              :to="item.href"
              class="group flex h-full min-h-[11.5rem] flex-col rounded-[1.4rem] bg-[#f4f6f5] p-6 ring-1 ring-mist-deep transition hover:bg-white hover:shadow-[0_18px_40px_rgba(6,54,55,0.1)] hover:ring-gold/30"
            >
              <span
                class="mb-4 inline-flex size-11 items-center justify-center rounded-xl bg-white ring-1 ring-mist-deep"
                aria-hidden="true"
              >
                <span
                  class="inline-block size-5 bg-ink transition group-hover:bg-green-deep"
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
