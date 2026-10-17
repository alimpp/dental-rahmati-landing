<script setup lang="ts">
import { guideModule } from '~/modules'
import { GuideModel } from '~/modules/guide/models/index.model'

const mediaSrc = useMediaSrc()
const guideDS = guideModule.store
const items = computed(() =>
  guideDS.getVisibleItems.slice(0, 3).map((item) => new GuideModel(item)),
)

await guideModule.controller.getList()
</script>

<template>
  <section v-if="items.length" class="relative overflow-hidden bg-[#f7faf8]">
    <div class="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-gold to-transparent" />
    <div class="home-glow pointer-events-none absolute inset-0 opacity-50" aria-hidden="true" />

    <div class="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
      <div class="flex flex-wrap items-end justify-between gap-4">
        <div class="max-w-2xl">
          <p class="reveal-item reveal-item-fade text-[11px] font-medium tracking-[0.18em] text-gold" style="--reveal-i: 0">
            راهنماهای خواندنی
          </p>
          <h2 class="reveal-item reveal-item-right mt-3 text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl" style="--reveal-i: 1">
            قبل از اقدام، مسیر را بخوانید
          </h2>
          <p class="reveal-item reveal-item-fade mt-4 max-w-xl text-[15px] leading-8 text-ink-muted" style="--reveal-i: 2">
            راهنماهای کوتاه و کاربردی برای آماده‌سازی قبل از ویزیت، بهداشت دهان و مراقبت پس از درمان — بدون شعار، با تمرکز روی عمل.
          </p>
        </div>
        <NuxtLink
          to="/guides"
          class="reveal-item reveal-item-scale inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium text-ink ring-1 ring-mist-deep transition hover:bg-ink hover:text-white hover:ring-ink"
          style="--reveal-i: 3"
        >
          همه راهنماها
        </NuxtLink>
      </div>

      <ul class="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-3 lg:gap-6">
        <li
          v-for="(item, index) in items"
          :key="item.id"
          class="reveal-item reveal-item-scale h-full"
          :style="{ '--reveal-i': index + 4 }"
        >
          <NuxtLink
            :to="item.href"
            class="group flex h-full flex-col overflow-hidden rounded-[1.6rem] bg-white ring-1 ring-mist-deep transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_22px_50px_rgba(43,48,54,0.1)] hover:ring-gold/40"
          >
            <div class="relative aspect-[16/10] overflow-hidden bg-mist">
              <img
                :src="mediaSrc(item.coverImage)"
                :alt="item.title"
                class="size-full object-cover transition duration-700 group-hover:scale-105"
                width="640"
                height="400"
                loading="lazy"
              >
              <div class="absolute inset-0 bg-gradient-to-t from-ink/45 via-transparent to-transparent" />
              <div class="absolute bottom-3 right-3 flex flex-wrap gap-1.5">
                <span
                  v-if="item.category"
                  class="rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-medium text-ink"
                >
                  {{ item.category }}
                </span>
                <span class="rounded-full bg-ink/80 px-2.5 py-1 text-[11px] font-medium text-white">
                  {{ item.readingMinutes }} دقیقه مطالعه
                </span>
              </div>
            </div>
            <div class="flex flex-1 flex-col p-5 sm:p-6">
              <h3 class="line-clamp-2 min-h-[3.5rem] text-lg font-bold leading-7 text-ink transition group-hover:text-green-deep">
                {{ item.title }}
              </h3>
              <p class="mt-2 line-clamp-3 flex-1 text-sm leading-7 text-ink-muted">
                {{ item.excerpt }}
              </p>
              <span class="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-medium text-gold">
                مطالعه راهنما
                <span class="inline-block h-px w-5 bg-gold transition-all duration-300 group-hover:w-9" aria-hidden="true" />
              </span>
            </div>
          </NuxtLink>
        </li>
      </ul>
    </div>
  </section>
</template>
