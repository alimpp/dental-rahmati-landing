<script setup lang="ts">
import { catalogModule } from '~/modules'
import { CatalogItemModel } from '~/modules/catalog/models/index.model'

const catalogDS = catalogModule.store
const mediaSrc = useMediaSrc()
const items = computed(() =>
  catalogDS.getVisibleItems.slice(0, 3).map((item) => new CatalogItemModel(item)),
)

await catalogModule.controller.getCatalogList()
</script>

<template>
  <section v-if="items.length" class="bg-white py-16 sm:py-20 lg:py-24">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="grid gap-8 lg:grid-cols-12 lg:items-end">
        <div class="lg:col-span-8">
          <p class="reveal-item reveal-item-fade text-[11px] font-semibold tracking-[0.2em] text-gold" style="--reveal-i: 0">
            کاتالوگ خدمات
          </p>
          <h2 class="reveal-item mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl" style="--reveal-i: 1">
            بخوانید، ببینید، تصمیم بگیرید
          </h2>
          <p class="reveal-item reveal-item-fade mt-4 max-w-xl text-[15px] leading-8 text-ink-muted" style="--reveal-i: 2">
            متن کامل، گالری و PDF — بدون تماس اجباری، فقط اطلاعات شفاف.
          </p>
        </div>
        <div class="lg:col-span-4 lg:flex lg:justify-end">
          <NuxtLink
            to="/catalog"
            class="reveal-item reveal-item-scale inline-flex rounded-2xl bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-deep hover:text-ink"
            style="--reveal-i: 3"
          >
            همه کاتالوگ‌ها ←
          </NuxtLink>
        </div>
      </div>

      <!-- Horizontal stacked rows — same language as /catalog page -->
      <ul class="mt-12 space-y-4">
        <li
          v-for="(item, index) in items"
          :key="item.id"
          class="reveal-item reveal-item-left"
          :style="{ '--reveal-i': index + 4 }"
        >
          <NuxtLink
            :to="item.href"
            class="group grid overflow-hidden rounded-[1.5rem] bg-[#f4f6f5] ring-1 ring-mist-deep transition hover:bg-white hover:shadow-[0_22px_50px_rgba(6,54,55,0.1)] hover:ring-gold/35 md:grid-cols-12"
          >
            <div class="relative aspect-[16/10] overflow-hidden md:col-span-4 md:aspect-auto md:min-h-[11rem]">
              <img
                :src="mediaSrc(item.coverImage)"
                :alt="item.title"
                class="home-media-shift size-full object-cover"
                width="480"
                height="320"
                loading="lazy"
              >
              <div class="absolute inset-x-0 bottom-0 flex gap-2 p-3">
                <span
                  v-if="item.galleryCount"
                  class="rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-medium text-ink"
                >
                  {{ item.galleryCount }} تصویر
                </span>
                <span
                  v-if="item.pdfs.length"
                  class="rounded-full bg-ink/85 px-2.5 py-1 text-[11px] font-medium text-gold"
                >
                  PDF
                </span>
              </div>
            </div>
            <div class="flex flex-col justify-center p-5 sm:p-6 md:col-span-8 md:flex-row md:items-center md:gap-8">
              <div class="min-w-0 flex-1">
                <span class="font-mono text-[11px] font-semibold tracking-widest text-gold">
                  {{ String(index + 1).padStart(2, '0') }}
                </span>
                <h3 class="mt-2 text-xl font-bold text-ink transition group-hover:text-green-deep">
                  {{ item.title }}
                </h3>
                <p class="mt-2 line-clamp-2 text-sm leading-7 text-ink-muted">
                  {{ item.excerpt }}
                </p>
              </div>
              <span class="mt-4 inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-ink md:mt-0">
                مطالعه
                <span class="inline-flex size-10 items-center justify-center rounded-full bg-ink text-xl leading-none text-white transition group-hover:bg-green-deep group-hover:text-ink">
                  ←
                </span>
              </span>
            </div>
          </NuxtLink>
        </li>
      </ul>
    </div>
  </section>
</template>
