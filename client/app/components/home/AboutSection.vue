<script setup lang="ts">
import { aboutProfile as profile } from '~/data/about-profile'

withDefaults(
  defineProps<{
    /** Full /about page: h1, complete experience lists, page CTAs */
    full?: boolean
  }>(),
  { full: false },
)

const pillars = [
  {
    title: 'معاینه دقیق',
    text: 'قبل از هر درمان، وضعیت دهان و دندان، درد و انتظارات شما بررسی می‌شود تا طرح درمان از همان ابتدا روشن باشد.',
  },
  {
    title: 'درمان متناسب با شما',
    text: 'هر بیمار شرایط خاص خود را دارد؛ گزینه‌ها با توجه به سلامت، زمان و بودجه واقعی شما پیشنهاد می‌شود.',
  },
  {
    title: 'پیگیری تا بهبود',
    text: 'از جرم‌گیری و ترمیم تا زیبایی و ایمپلنت، مراقبت را رها نمی‌کنیم و پس از درمان‌های حساس پیگیری می‌کنیم.',
  },
] as const

const focusAreas = [
  'معاینه و پیشگیری',
  'ترمیم و درمان ریشه',
  'زیبایی و بلیچینگ',
  'ایمپلنت و پروتز',
  'جرم‌گیری حرفه‌ای',
  'آموزش بهداشت دهان',
] as const

const roleParts = profile.roles.split('|').map((part) => part.trim())
</script>

<template>
  <section
    id="about"
    class="relative scroll-mt-24 overflow-hidden bg-white"
  >
    <!-- Rich top band — no portrait -->
    <div class="relative isolate overflow-hidden bg-ink">
      <div class="home-glow-dark pointer-events-none absolute inset-0" aria-hidden="true" />
      <div class="pointer-events-none absolute -left-24 top-10 size-80 rounded-full bg-green-deep/25 blur-3xl" aria-hidden="true" />
      <div class="pointer-events-none absolute -right-16 bottom-0 size-72 rounded-full bg-gold/20 blur-3xl" aria-hidden="true" />
      <div
        class="pointer-events-none absolute inset-0 opacity-[0.07]"
        style="background-image: radial-gradient(circle at 1px 1px, #fff 1px, transparent 0); background-size: 26px 26px;"
        aria-hidden="true"
      />
      <div class="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-gold to-transparent" />

      <div class="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-12 lg:items-stretch lg:gap-12 lg:px-8 lg:py-24">
        <div class="lg:col-span-7">
          <p class="reveal-item reveal-item-fade text-[11px] font-medium tracking-[0.22em] text-gold" style="--reveal-i: 0">
            درباره کلینیک
          </p>
          <component
            :is="full ? 'h1' : 'p'"
            class="reveal-item mt-4 text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl lg:text-[3.4rem]"
            style="--reveal-i: 1"
          >
            {{ profile.name }}
          </component>
          <component
            :is="full ? 'p' : 'h2'"
            class="reveal-item mt-4 max-w-xl text-xl font-medium leading-9 text-white/90 sm:text-2xl"
            style="--reveal-i: 2"
          >
            مراقبت دندانپزشکی که بتوان به آن اعتماد کرد
          </component>
          <p class="reveal-item reveal-item-fade mt-5 max-w-2xl text-[15px] leading-8 text-white/70" style="--reveal-i: 3">
            از معاینه اولیه تا تکمیل درمان، مسیر مراقبت را با دقت، شفافیت و تخصص پیش می‌بریم —
            برای شما و خانواده‌ای که به لبخندی سالم و تجربه‌ای آرام نیاز دارید.
          </p>

          <ul class="mt-7 flex flex-wrap gap-2">
            <li
              v-for="(role, index) in roleParts"
              :key="role"
              class="reveal-item reveal-item-scale rounded-full bg-white/10 px-3.5 py-1.5 text-[12px] font-medium text-white ring-1 ring-white/20"
              :style="{ '--reveal-i': index + 4 }"
            >
              {{ role }}
            </li>
            <li
              class="reveal-item reveal-item-scale rounded-full bg-gold/20 px-3.5 py-1.5 text-[12px] font-medium text-gold ring-1 ring-gold/35"
              :style="{ '--reveal-i': roleParts.length + 4 }"
            >
              {{ profile.barSince }}
            </li>
          </ul>

          <dl class="mt-10 grid grid-cols-3 gap-3 sm:max-w-lg">
            <div
              v-for="(stat, index) in profile.stats"
              :key="stat.label"
              class="reveal-item reveal-item-scale rounded-2xl bg-white/8 px-3 py-4 text-center ring-1 ring-white/15 backdrop-blur-sm"
              :style="{ '--reveal-i': roleParts.length + 5 + index }"
            >
              <dt class="text-xl font-semibold text-gold sm:text-2xl">
                {{ stat.value }}
              </dt>
              <dd class="mt-1.5 text-[10px] leading-4 text-white/65 sm:text-[11px]">
                {{ stat.label }}
              </dd>
            </div>
          </dl>
        </div>

        <aside class="reveal-item reveal-item-left flex lg:col-span-5" :style="{ '--reveal-i': roleParts.length + 8 }">
          <div class="flex w-full flex-col justify-between rounded-[1.75rem] bg-white/[0.06] p-6 ring-1 ring-white/15 backdrop-blur-sm sm:p-7">
            <div>
              <p class="text-[11px] font-medium tracking-[0.16em] text-gold">
                کلینیک دندان‌پزشکی امیر رحمتی
              </p>
              <p class="mt-3 text-lg font-semibold text-white">
                {{ profile.location }}
              </p>
              <p class="mt-2 text-[13px] leading-7 text-white/70">
                {{ profile.bar }}
              </p>
              <ul class="mt-6 space-y-3">
                <li
                  v-for="item in profile.memberships"
                  :key="item.title"
                  class="border-t border-white/10 pt-3"
                >
                  <p class="text-sm font-medium leading-7 text-white/90">
                    {{ item.title }}
                  </p>
                  <p v-if="item.detail" class="mt-1 text-[12px] text-white/55">
                    {{ item.detail }}
                  </p>
                </li>
              </ul>
            </div>
            <a
              :href="`mailto:${profile.email}`"
              class="mt-8 inline-flex items-center justify-center rounded-xl bg-gold px-4 py-3 text-sm font-semibold text-ink transition hover:bg-white"
            >
              {{ profile.email }}
            </a>
          </div>
        </aside>
      </div>
    </div>

    <!-- Focus chips -->
    <div class="border-b border-mist bg-mist/40">
      <div class="mx-auto flex max-w-7xl flex-wrap gap-2 px-4 py-5 sm:px-6 lg:px-8">
        <span
          v-for="(item, index) in focusAreas"
          :key="item"
          class="reveal-item reveal-item-fade rounded-full bg-white px-3.5 py-1.5 text-[12px] font-medium text-ink ring-1 ring-mist-deep"
          :style="{ '--reveal-i': index }"
        >
          {{ item }}
        </span>
      </div>
    </div>

    <div class="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
      <div class="pointer-events-none absolute -right-28 top-20 size-80 rounded-full bg-green-soft/30 blur-3xl" aria-hidden="true" />
      <div class="pointer-events-none absolute -left-16 bottom-24 size-72 rounded-full bg-gold/10 blur-3xl" aria-hidden="true" />

      <!-- Long story -->
      <div class="relative grid gap-12 lg:grid-cols-12 lg:gap-14">
        <div class="lg:col-span-7">
          <p class="reveal-item reveal-item-fade text-[11px] font-medium tracking-[0.18em] text-gold" style="--reveal-i: 0">
            از ۱۳۹۵ تا امروز
          </p>
          <h3 class="reveal-item mt-3 text-2xl font-semibold tracking-tight text-ink sm:text-3xl" style="--reveal-i: 1">
            مسیر شکل‌گیری کلینیک
          </h3>
          <div class="mt-7 space-y-5">
            <p
              v-for="(paragraph, index) in profile.story"
              :key="paragraph"
              class="reveal-item reveal-item-fade text-[15px] leading-8 text-ink-muted"
              :style="{ '--reveal-i': index + 2 }"
            >
              {{ paragraph }}
            </p>
          </div>
        </div>

        <div class="space-y-5 lg:col-span-5">
          <div class="reveal-item reveal-item-left rounded-[1.5rem] bg-mist/50 p-6 ring-1 ring-mist-deep" style="--reveal-i: 2">
            <p class="text-[11px] font-medium tracking-[0.16em] text-gold">
              خلاصه فعالیت حرفه‌ای
            </p>
            <ul class="mt-5 space-y-4">
              <li
                v-for="(item, index) in profile.summary"
                :key="item"
                class="reveal-item flex gap-3 text-[13px] leading-7 text-ink-muted"
                :style="{ '--reveal-i': index + 3 }"
              >
                <span class="mt-2 size-1.5 shrink-0 rounded-full bg-gold" aria-hidden="true" />
                {{ item }}
              </li>
            </ul>
          </div>

          <div class="reveal-item reveal-item-left rounded-[1.5rem] bg-ink p-6 text-white" style="--reveal-i: 6">
            <p class="text-[11px] font-medium tracking-[0.16em] text-gold">
              عضویت حرفه‌ای
            </p>
            <ul class="mt-5 space-y-4">
              <li
                v-for="(item, index) in profile.memberships"
                :key="item.title"
                class="reveal-item border-b border-white/10 pb-4 last:border-0 last:pb-0"
                :style="{ '--reveal-i': index + 7 }"
              >
                <p class="text-sm font-semibold leading-7">
                  {{ item.title }}
                </p>
                <p v-if="item.detail" class="mt-1 text-[12px] text-white/60">
                  {{ item.detail }}
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Education + experience -->
      <div class="relative mt-16 grid gap-8 lg:grid-cols-2">
        <div class="reveal-item rounded-[1.5rem] bg-white p-6 ring-1 ring-mist-deep sm:p-7" style="--reveal-i: 0">
          <p class="text-[11px] font-medium tracking-[0.16em] text-gold">
            سوابق تحصیلی
          </p>
          <ol class="mt-6 space-y-5">
            <li
              v-for="(item, index) in profile.education"
              :key="item.title"
              class="reveal-item reveal-item-right flex gap-4"
              :style="{ '--reveal-i': index + 1 }"
            >
              <span class="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-gold/15 text-xs font-bold text-gold">
                {{ String(index + 1).padStart(2, '0') }}
              </span>
              <div>
                <p class="font-semibold text-ink">
                  {{ item.title }}
                </p>
                <p v-if="item.place" class="mt-1 text-sm text-ink-muted">
                  {{ item.place }}
                </p>
              </div>
            </li>
          </ol>
        </div>

        <div class="space-y-5">
          <article
            v-for="(job, index) in profile.experience"
            :key="job.title"
            class="reveal-item reveal-item-left rounded-[1.5rem] bg-white p-6 ring-1 ring-mist-deep sm:p-7"
            :style="{ '--reveal-i': index + 1 }"
          >
            <p class="text-[11px] font-medium tracking-[0.16em] text-gold">
              {{ job.place }}
            </p>
            <h3 class="mt-2 text-lg font-semibold text-ink">
              {{ job.title }}
            </h3>
            <ul class="mt-4 space-y-2">
              <li
                v-for="line in (full ? job.items : job.items.slice(0, 4))"
                :key="line"
                class="flex gap-3 text-[13px] leading-7 text-ink-muted"
              >
                <span class="mt-2 size-1.5 shrink-0 rounded-full bg-green-deep" aria-hidden="true" />
                {{ line }}
              </li>
            </ul>
          </article>
        </div>
      </div>

      <!-- Companies -->
      <div class="relative mt-16">
        <p class="reveal-item reveal-item-fade text-[11px] font-medium tracking-[0.18em] text-gold" style="--reveal-i: 0">
          همکاری‌های درمانی
        </p>
        <h3 class="reveal-item mt-3 text-2xl font-semibold tracking-tight text-ink" style="--reveal-i: 1">
          شبکه همکاران و مراکز
        </h3>
        <ul class="mt-7 grid gap-3 sm:grid-cols-3">
          <li
            v-for="(company, index) in profile.companies"
            :key="company"
            class="reveal-item reveal-item-scale rounded-2xl bg-mist/50 px-5 py-6 text-center text-sm font-semibold text-ink ring-1 ring-mist-deep"
            :style="{ '--reveal-i': index + 2 }"
          >
            {{ company }}
          </li>
        </ul>
      </div>

      <!-- Honors -->
      <div class="relative mt-16">
        <p class="reveal-item reveal-item-fade text-[11px] font-medium tracking-[0.18em] text-gold" style="--reveal-i: 0">
          افتخارات و دستاوردها
        </p>
        <ul class="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <li
            v-for="(item, index) in profile.honors"
            :key="item"
            class="reveal-item rounded-2xl bg-white px-5 py-4 text-[13px] leading-7 text-ink ring-1 ring-mist-deep"
            :style="{ '--reveal-i': index + 1 }"
          >
            <span class="me-2 inline-block size-1.5 rounded-full bg-gold align-middle" aria-hidden="true" />
            {{ item }}
          </li>
        </ul>
      </div>

      <!-- Skills -->
      <div class="relative mt-14">
        <p class="reveal-item reveal-item-fade text-[11px] font-medium tracking-[0.18em] text-gold" style="--reveal-i: 0">
          توانمندی‌های حرفه‌ای
        </p>
        <ul class="mt-5 flex flex-wrap gap-2">
          <li
            v-for="(skill, index) in profile.skills"
            :key="skill"
            class="reveal-item reveal-item-fade rounded-full bg-mist/60 px-4 py-2 text-[12px] font-medium text-ink ring-1 ring-mist-deep"
            :style="{ '--reveal-i': index + 1 }"
          >
            {{ skill }}
          </li>
        </ul>
      </div>

      <!-- Pillars -->
      <ol class="relative mt-16 grid grid-cols-1 gap-4 md:grid-cols-3">
        <li
          v-for="(item, index) in pillars"
          :key="item.title"
          class="reveal-item reveal-item-right rounded-[1.5rem] bg-mist/40 p-6 ring-1 ring-mist-deep"
          :style="{ '--reveal-i': index }"
        >
          <span class="text-[11px] font-medium tracking-[0.14em] text-gold">
            {{ String(index + 1).padStart(2, '0') }}
          </span>
          <h3 class="mt-3 text-lg font-semibold text-ink">
            {{ item.title }}
          </h3>
          <p class="mt-3 text-[13px] leading-7 text-ink-muted">
            {{ item.text }}
          </p>
        </li>
      </ol>

      <div class="relative mt-12 flex flex-wrap items-center gap-3">
        <NuxtLink
          v-if="!full"
          to="/about"
          class="reveal-item reveal-item-scale inline-flex items-center rounded-xl bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:bg-gold hover:text-ink"
          style="--reveal-i: 0"
        >
          صفحه کامل درباره ما
        </NuxtLink>
        <NuxtLink
          v-else
          to="/consultation"
          class="reveal-item reveal-item-scale inline-flex items-center rounded-xl bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:bg-gold hover:text-ink"
          style="--reveal-i: 0"
        >
          رزرو نوبت
        </NuxtLink>
        <NuxtLink
          to="/guides"
          class="reveal-item reveal-item-slide inline-flex items-center rounded-xl px-5 py-3 text-sm font-medium text-ink ring-1 ring-mist-deep transition hover:bg-mist"
          style="--reveal-i: 1"
        >
          راهنماهای مراقبت
        </NuxtLink>
        <NuxtLink
          to="/contact"
          class="reveal-item reveal-item-fade inline-flex items-center rounded-xl px-5 py-3 text-sm font-medium text-green-deep ring-1 ring-green-soft transition hover:bg-green-soft/40"
          style="--reveal-i: 2"
        >
          راه‌های ارتباط
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
