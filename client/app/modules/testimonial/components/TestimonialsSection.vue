<script setup lang="ts">
import { testimonialModule } from '~/modules'

const testimonialDS = testimonialModule.store
const mediaSrc = useMediaSrc()
const items = computed(() => {
  const visible = testimonialDS.getVisibleItems
  const featured = visible.filter((item) => item.featured)
  return (featured.length ? featured : visible).slice(0, 6)
})
const lead = computed(() => items.value[0] ?? null)
const rest = computed(() => items.value.slice(1))

await testimonialModule.controller.getList()
</script>

<template>
  <section v-if="items.length" class="bg-mist py-16 sm:py-20 lg:py-24">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="max-w-2xl">
        <p class="reveal-item reveal-item-fade text-[11px] font-semibold tracking-[0.2em] text-gold" style="--reveal-i: 0">
          نظرات بیماران
        </p>
        <h2 class="reveal-item mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl" style="--reveal-i: 1">
          اعتماد، از زبان کسانی که همراهشان بودیم
        </h2>
      </div>

      <div class="mt-12 grid gap-5 lg:grid-cols-12 lg:gap-6">
        <article
          v-if="lead"
          class="reveal-item reveal-item-scale rounded-[1.75rem] bg-band p-7 text-on-band sm:p-9 lg:col-span-5"
          style="--reveal-i: 2"
        >
          <span class="testimonial-quote !bg-gold" aria-hidden="true" />
          <p class="mt-8 text-lg leading-9 text-on-band/90 sm:text-xl sm:leading-10">
            {{ lead.quote }}
          </p>
          <div class="mt-8 flex items-center gap-3 border-t border-white/15 pt-6">
            <img
              v-if="lead.avatarUrl"
              :src="mediaSrc(lead.avatarUrl)"
              :alt="lead.clientName"
              class="size-12 rounded-full object-cover ring-2 ring-gold/40"
              width="48"
              height="48"
              loading="lazy"
            >
            <span
              v-else
              class="inline-flex size-12 items-center justify-center rounded-full bg-white/10 text-sm font-semibold text-gold"
            >
              {{ lead.initials }}
            </span>
            <div>
              <p class="font-semibold">{{ lead.clientName }}</p>
              <p v-if="lead.roleOrCompany" class="mt-0.5 text-sm text-gold">
                {{ lead.roleOrCompany }}
              </p>
            </div>
          </div>
        </article>

        <ul class="grid gap-4 sm:grid-cols-2 lg:col-span-7">
          <li
            v-for="(item, index) in rest"
            :key="item.id"
            class="reveal-item reveal-item-left flex flex-col rounded-[1.4rem] bg-panel p-6 ring-1 ring-mist-deep"
            :style="{ '--reveal-i': index + 3 }"
          >
            <p class="flex-1 text-[15px] leading-8 text-ink">
              {{ item.quote }}
            </p>
            <div class="mt-5 flex items-center gap-3 border-t border-mist pt-4">
              <img
                v-if="item.avatarUrl"
                :src="mediaSrc(item.avatarUrl)"
                :alt="item.clientName"
                class="size-10 rounded-full object-cover"
                width="40"
                height="40"
                loading="lazy"
              >
              <span
                v-else
                class="inline-flex size-10 items-center justify-center rounded-full bg-mist text-xs font-semibold text-ink"
              >
                {{ item.initials }}
              </span>
              <div class="min-w-0">
                <p class="truncate text-sm font-semibold text-ink">{{ item.clientName }}</p>
                <p v-if="item.roleOrCompany" class="truncate text-[12px] text-ink-muted">
                  {{ item.roleOrCompany }}
                </p>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>
