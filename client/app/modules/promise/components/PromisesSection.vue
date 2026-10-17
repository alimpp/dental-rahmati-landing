<script setup lang="ts">
import { promiseModule } from '~/modules'

const promiseDS = promiseModule.store
const items = computed(() => promiseDS.getVisibleItems)

await promiseModule.controller.getList()
</script>

<template>
  <section v-if="items.length" class="bg-[#f4f6f5] py-16 sm:py-20 lg:py-24">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="grid gap-10 lg:grid-cols-12 lg:gap-14">
        <div class="lg:col-span-4 lg:sticky lg:top-28 lg:self-start">
          <p class="reveal-item reveal-item-fade text-[11px] font-semibold tracking-[0.2em] text-gold" style="--reveal-i: 0">
            چرا امیر رحمتی
          </p>
          <h2 class="reveal-item mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl" style="--reveal-i: 1">
            سه تعهد ساده؛ بدون شعار اضافه
          </h2>
          <p class="reveal-item reveal-item-fade mt-5 text-[15px] leading-8 text-ink-muted" style="--reveal-i: 2">
            قبل از جزئیات خدمات، بدانید چطور کار می‌کنیم — شفاف، تخصصی و تا انتها همراه درمان شما.
          </p>
        </div>

        <ol class="space-y-4 lg:col-span-8">
          <li
            v-for="(item, index) in items"
            :key="item.id"
            class="reveal-item reveal-item-left group relative overflow-hidden rounded-[1.5rem] bg-white p-6 shadow-[0_10px_30px_rgba(6,54,55,0.04)] ring-1 ring-mist-deep transition hover:-translate-y-0.5 hover:shadow-[0_20px_44px_rgba(6,54,55,0.1)] hover:ring-gold/35 sm:p-7"
            :style="{ '--reveal-i': index + 3 }"
          >
            <div class="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-7">
              <span class="font-mono text-4xl font-bold leading-none text-green-deep/80 sm:w-16">
                {{ String(index + 1).padStart(2, '0') }}
              </span>
              <div class="min-w-0 flex-1">
                <h3 class="text-xl font-bold text-ink">
                  {{ item.title }}
                </h3>
                <p class="mt-3 text-[15px] leading-8 text-ink-muted">
                  {{ item.description }}
                </p>
              </div>
            </div>
            <span
              class="pointer-events-none absolute inset-y-0 right-0 w-1 origin-top scale-y-0 bg-green-deep transition-transform duration-400 group-hover:scale-y-100"
              aria-hidden="true"
            />
          </li>
        </ol>
      </div>
    </div>
  </section>
</template>
