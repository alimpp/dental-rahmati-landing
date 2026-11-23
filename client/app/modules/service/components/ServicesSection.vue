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
            خدمات دندان پزشکی دیجیتال
          </p>
          <h2 class="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            ایمپلنت دیجیتال، لمینت و کامپوزیت
          </h2>
          <p class="mt-4 max-w-2xl text-[15px] leading-8 text-ink-muted">
            خدمات دندان پزشکی دیجیتال دکتر امیر رحمتی — از ایمپلنت دیجیتال و طراحی لبخند تا لمینت و کامپوزیت،
            با طرح درمان شفاف.
          </p>
        </div>
        <NuxtLink
          to="/practice-areas"
          class="inline-flex rounded-2xl bg-green-deep px-5 py-3 text-sm font-semibold text-on-primary transition hover:opacity-90"
        >
          همه خدمات دیجیتال
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
          class="group relative min-h-[22rem] overflow-hidden rounded-[1.5rem] bg-band lg:col-span-5 lg:min-h-full"
        >
          <img
            :src="mediaSrc(lead.coverSrc)"
            :alt="lead.title"
            class="absolute inset-0 size-full object-cover object-center transition duration-700 group-hover:scale-[1.05]"
            width="900"
            height="1100"
          >
          <div class="absolute inset-0 bg-gradient-to-t from-band via-band/55 to-band/15" />
          <div class="relative z-10 flex h-full flex-col justify-end p-6 sm:p-7">
            <h3 class="text-2xl font-bold text-on-band sm:text-3xl">
              {{ lead.title }}
            </h3>
            <p class="mt-3 max-w-md text-sm leading-7 text-on-band/85">
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
              class="group relative flex min-h-[16.5rem] overflow-hidden rounded-[1.25rem] bg-band sm:min-h-[17.5rem]"
            >
              <img
                :src="mediaSrc(item.coverSrc)"
                :alt="item.title"
                class="absolute inset-0 size-full object-cover object-center transition duration-700 group-hover:scale-[1.05]"
                width="640"
                height="480"
                loading="lazy"
              >
              <div class="absolute inset-0 bg-gradient-to-t from-band via-band/50 to-band/10" />
              <div class="relative z-10 mt-auto flex w-full flex-col p-5 sm:p-6">
                <h3 class="text-lg font-bold text-on-band">
                  {{ item.title }}
                </h3>
                <p class="mt-2 line-clamp-2 text-sm leading-7 text-on-band/80">
                  {{ item.description }}
                </p>
                <span class="mt-4 text-sm font-semibold text-gold">جزئیات خدمت</span>
              </div>
            </NuxtLink>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>
