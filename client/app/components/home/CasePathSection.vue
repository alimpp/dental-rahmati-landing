<script setup lang="ts">
import { processStepModule } from '~/modules'

const stepDS = processStepModule.store
const steps = computed(() => stepDS.getVisibleItems)

await processStepModule.controller.getList()
</script>

<template>
  <section v-if="steps.length" class="bg-panel py-16 sm:py-20 lg:py-24">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="grid items-end gap-8 lg:grid-cols-12">
        <div class="lg:col-span-5">
          <p class="reveal-item reveal-item-fade text-[11px] font-semibold tracking-[0.2em] text-gold" style="--reveal-i: 0">
            مسیر درمان
          </p>
          <h2 class="reveal-item mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl" style="--reveal-i: 1">
            از نوبت تا پیگیری
          </h2>
        </div>
        <p class="reveal-item reveal-item-fade text-[15px] leading-8 text-ink-muted lg:col-span-6 lg:col-start-7" style="--reveal-i: 2">
          مراقبت شما در یک مسیر مشخص پیش می‌رود؛ هر مرحله با شفافیت توضیح داده می‌شود.
        </p>
      </div>

      <ol class="relative mt-12 space-y-0">
        <li
          v-for="(step, index) in steps"
          :key="step.id"
          class="reveal-item reveal-item-right group grid gap-4 border-t border-mist-deep py-7 sm:grid-cols-12 sm:gap-6 sm:py-8"
          :style="{ '--reveal-i': index + 3 }"
        >
          <div class="flex items-center gap-4 sm:col-span-3">
            <span class="inline-flex size-10 items-center justify-center rounded-full bg-mist font-mono text-sm font-bold text-ink ring-1 ring-mist-deep transition group-hover:bg-band group-hover:text-gold">
              {{ String(index + 1).padStart(2, '0') }}
            </span>
            <span class="hidden h-px flex-1 bg-mist-deep sm:block" aria-hidden="true" />
          </div>
          <h3 class="text-xl font-bold text-ink sm:col-span-4">
            {{ step.title }}
          </h3>
          <p class="text-[15px] leading-8 text-ink-muted sm:col-span-5">
            {{ step.description }}
          </p>
        </li>
      </ol>
    </div>
  </section>
</template>
