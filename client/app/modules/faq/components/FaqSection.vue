<script setup lang="ts">
import { faqModule } from '~/modules'

const faqDS = faqModule.store
const items = computed(() => faqDS.getVisibleItems)
const openId = ref<string | null>(null)

await faqModule.controller.getList()

function toggle(id: string) {
  openId.value = openId.value === id ? null : id
}
</script>

<template>
  <section v-if="items.length" class="relative overflow-hidden bg-white">
    <div class="pointer-events-none absolute -right-24 bottom-10 size-72 rounded-full bg-green-soft/40 blur-3xl" />

    <div class="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
      <div class="grid items-start gap-10 lg:grid-cols-12 lg:gap-14">
        <div class="lg:sticky lg:top-28 lg:col-span-4">
          <p class="reveal-item reveal-item-fade text-[11px] font-medium tracking-[0.18em] text-gold" style="--reveal-i: 0">
            سوالات متداول
          </p>
          <h2 class="reveal-item reveal-item-drop mt-3 text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl" style="--reveal-i: 1">
            پیش از ویزیت، شاید این‌ها را بپرسید
          </h2>
          <p class="reveal-item mt-4 text-[15px] leading-8 text-ink-muted" style="--reveal-i: 2">
            پاسخ کوتاه پرسش‌های رایج بیماران. اگر سؤال شما این‌جا نیست، با ما در میان بگذارید.
          </p>
          <NuxtLink
            to="/consultation"
            class="reveal-item reveal-item-scale mt-6 inline-flex items-center rounded-xl bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:bg-gold hover:text-ink"
            style="--reveal-i: 3"
          >
            رزرو نوبت
          </NuxtLink>
        </div>

        <ul class="space-y-3 lg:col-span-8">
          <li
            v-for="(item, index) in items"
            :key="item.id"
            class="reveal-item reveal-item-left faq-item overflow-hidden rounded-2xl ring-1 transition duration-300"
            :class="openId === item.id
              ? 'bg-white shadow-[0_16px_40px_rgba(43,48,54,0.09)] ring-gold/45'
              : 'bg-mist/40 ring-mist-deep hover:bg-white hover:ring-gold/30'"
            :style="{ '--reveal-i': index + 4 }"
          >
            <h3>
              <button
                type="button"
                class="flex w-full items-center gap-4 px-5 py-4 text-right sm:px-6 sm:py-5"
                :aria-expanded="openId === item.id"
                :aria-controls="`faq-panel-${item.id}`"
                @click="toggle(item.id)"
              >
                <span
                  class="inline-flex size-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold ring-1 transition duration-300"
                  :class="openId === item.id
                    ? 'bg-gold text-ink ring-gold'
                    : 'bg-gold/10 text-gold ring-gold/25'"
                  aria-hidden="true"
                >
                  {{ String(index + 1).padStart(2, '0') }}
                </span>
                <span class="flex-1 text-[15px] font-semibold leading-7 text-ink sm:text-base">
                  {{ item.question }}
                </span>
                <span
                  class="faq-plus relative block size-8 shrink-0 rounded-full ring-1 transition duration-300"
                  :class="openId === item.id
                    ? 'is-open bg-green-deep ring-green-deep'
                    : 'bg-white ring-mist-deep'"
                  aria-hidden="true"
                />
              </button>
            </h3>
            <div
              :id="`faq-panel-${item.id}`"
              class="faq-panel"
              :class="openId === item.id && 'is-open'"
              role="region"
            >
              <div class="faq-panel-inner">
                <p class="px-5 pb-5 ps-[4.5rem] text-sm leading-8 text-ink-muted sm:px-6 sm:pb-6 sm:ps-[4.75rem]">
                  {{ item.answer }}
                </p>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>
