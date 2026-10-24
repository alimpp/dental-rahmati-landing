<script setup lang="ts">
import { catalogModule } from '~/modules'
import { CatalogItemModel } from '~/modules/catalog/models/index.model'

const catalogDS = catalogModule.store
const mediaSrc = useMediaSrc()
const items = computed(() =>
  catalogDS.getVisibleItems.slice(0, 6).map(item => new CatalogItemModel(item)),
)

await catalogModule.controller.getCatalogList()
</script>

<template>
  <section
    v-if="items.length"
    class="bg-surface py-16 sm:py-20 lg:py-24"
  >
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex flex-wrap items-end justify-between gap-5">
        <div class="max-w-2xl">
          <p class="text-[11px] font-semibold tracking-[0.2em] text-gold">
            کاتالوگ خدمات
          </p>
          <h2 class="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            بخوانید، ببینید، تصمیم بگیرید
          </h2>
          <p class="mt-4 text-[15px] leading-8 text-ink-muted">
            متن کامل، گالری تصویر و فایل PDF — اطلاعات شفاف قبل از نوبت، بدون تماس اجباری.
          </p>
        </div>
        <NuxtLink
          to="/catalog"
          class="inline-flex rounded-2xl bg-green-deep px-5 py-3 text-sm font-semibold text-on-primary transition hover:opacity-90"
        >
          همه کاتالوگ‌ها
        </NuxtLink>
      </div>

      <ul class="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <li
          v-for="(item, index) in items"
          :key="item.id"
        >
          <NuxtLink
            :to="item.href"
            class="group flex h-full flex-col overflow-hidden rounded-[1.25rem] bg-mist ring-1 ring-mist-deep transition duration-200 hover:-translate-y-0.5 hover:bg-surface hover:ring-gold/40"
          >
            <div class="relative aspect-[16/10] overflow-hidden bg-green-soft">
              <img
                :src="mediaSrc(item.coverImage)"
                :alt="item.title"
                class="size-full object-cover transition duration-500 group-hover:scale-[1.04]"
                width="640"
                height="440"
                loading="lazy"
              >
              <div class="absolute inset-x-0 bottom-0 flex flex-wrap gap-2 bg-gradient-to-t from-band/55 to-transparent p-3.5 pt-10">
                <span
                  v-if="item.galleryCount"
                  class="rounded-md bg-surface/95 px-2.5 py-1 text-[11px] font-medium text-ink"
                >
                  {{ item.galleryCount }} تصویر
                </span>
                <span
                  v-if="item.pdfs.length"
                  class="rounded-md bg-gold px-2.5 py-1 text-[11px] font-semibold text-on-accent"
                >
                  PDF
                </span>
              </div>
              <span class="absolute top-3 inset-inline-start-3 rounded-md bg-surface/90 px-2 py-1 font-mono text-[11px] font-semibold tracking-widest text-green-deep ring-1 ring-mist-deep">
                {{ String(index + 1).padStart(2, '0') }}
              </span>
            </div>

            <div class="flex flex-1 flex-col p-4 sm:p-5">
              <h3 class="text-base font-bold leading-7 text-ink transition group-hover:text-green-deep sm:text-lg sm:leading-8">
                {{ item.title }}
              </h3>
              <p class="mt-2 line-clamp-2 flex-1 text-sm leading-7 text-ink-muted">
                {{ item.excerpt }}
              </p>
              <div class="mt-4 flex items-center gap-2 border-t border-mist-deep pt-3 text-sm font-semibold text-green-deep">
                <span>مشاهده کاتالوگ</span>
                <span
                  class="inline-block size-4 bg-current transition-transform duration-200 group-hover:-translate-x-0.5"
                  aria-hidden="true"
                  :style="{
                    maskImage: 'url(/icons/arrow-left.svg)',
                    WebkitMaskImage: 'url(/icons/arrow-left.svg)',
                    maskRepeat: 'no-repeat',
                    WebkitMaskRepeat: 'no-repeat',
                    maskPosition: 'center',
                    WebkitMaskPosition: 'center',
                    maskSize: 'contain',
                    WebkitMaskSize: 'contain',
                  }"
                />
              </div>
            </div>
          </NuxtLink>
        </li>
      </ul>
    </div>
  </section>
</template>
