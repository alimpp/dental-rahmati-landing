<script setup lang="ts">
import { guideModule } from '~/modules'
import { GuideModel } from '~/modules/guide/models/index.model'

const mediaSrc = useMediaSrc()
const guideDS = guideModule.store
const items = computed(() =>
  guideDS.getVisibleItems.slice(0, 3).map(item => new GuideModel(item)),
)

await guideModule.controller.getList()
</script>

<template>
  <section
    v-if="items.length"
    class="relative overflow-hidden bg-mist"
  >
    <div
      class="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-gold to-transparent"
      aria-hidden="true"
    />

    <div class="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
      <div class="flex flex-wrap items-end justify-between gap-4">
        <div class="max-w-2xl">
          <p
            class="reveal-item reveal-item-fade text-[11px] font-medium tracking-[0.18em] text-gold"
            style="--reveal-i: 0"
          >
            راهنماها
          </p>
          <h2
            class="reveal-item mt-3 text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl"
            style="--reveal-i: 1"
          >
            قبل از اقدام، کوتاه بخوانید
          </h2>
          <p
            class="reveal-item reveal-item-fade mt-4 max-w-xl text-[15px] leading-8 text-ink-muted"
            style="--reveal-i: 2"
          >
            آماده‌سازی نوبت، بهداشت و مراقبت بعد درمان — کاربردی و بدون حاشیه.
          </p>
        </div>
        <NuxtLink
          to="/guides"
          class="reveal-item reveal-item-scale inline-flex rounded-xl bg-green-deep px-5 py-3 text-sm font-semibold text-on-primary transition hover:brightness-110"
          style="--reveal-i: 3"
        >
          همه راهنماها
        </NuxtLink>
      </div>

      <ul class="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <li
          v-for="(item, index) in items"
          :key="item.id"
          class="reveal-item reveal-item-scale h-full"
          :style="{ '--reveal-i': index + 4 }"
        >
          <NuxtLink
            :to="item.href"
            class="group flex h-full flex-col overflow-hidden rounded-2xl bg-panel ring-1 ring-mist-deep transition duration-300 hover:-translate-y-0.5 hover:ring-gold/40"
          >
            <div class="relative aspect-[16/10] overflow-hidden bg-mist">
              <img
                :src="mediaSrc(item.coverImage)"
                :alt="item.title"
                class="size-full object-cover transition duration-500 group-hover:scale-[1.03]"
                width="640"
                height="400"
                loading="lazy"
              >
              <div class="absolute inset-0 bg-gradient-to-t from-band/45 via-transparent to-transparent" />
              <div class="absolute inset-x-0 bottom-0 flex flex-wrap gap-1.5 p-3">
                <span
                  v-if="item.category"
                  class="rounded-md bg-panel/95 px-2.5 py-1 text-[11px] font-medium text-ink"
                >
                  {{ item.category }}
                </span>
                <span class="rounded-md bg-band/80 px-2.5 py-1 text-[11px] font-medium text-on-band">
                  {{ item.readingMinutes }} دقیقه
                </span>
              </div>
            </div>
            <div class="flex flex-1 flex-col p-5">
              <h3 class="line-clamp-2 text-lg font-bold leading-8 text-ink transition group-hover:text-green-deep">
                {{ item.title }}
              </h3>
              <p class="mt-2 line-clamp-3 flex-1 text-sm leading-7 text-ink-muted">
                {{ item.excerpt }}
              </p>
              <span class="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-green-deep">
                مطالعه
                <span
                  class="h-px w-8 bg-gold transition-all group-hover:w-12"
                  aria-hidden="true"
                />
              </span>
            </div>
          </NuxtLink>
        </li>
      </ul>
    </div>
  </section>
</template>
