<script setup lang="ts">
import { aboutProfile as profile } from '~/data/about-profile'

usePageSeo({
  title: 'درباره دکتر امیر رحمتی | دندانپزشک کرج جهانشهر',
  description:
    'آشنایی با دکتر امیر رحمتی و کلینیک دندانپزشکی در کرج جهانشهر، کسری شمالی کوچه غزال؛ دیجیتال، ایمپلنت، لمینت و مراقبت خانواده.',
  keywords: 'دکتر امیر رحمتی, بهترین دندانپزشک کرج, کلینیک دندانپزشکی جهانشهر, دندانپزشکی در کرج, کسری شمالی',
  path: '/about',
  image: '/images/doctor-rahmati.jpg',
})

const pillars = [
  {
    title: 'معاینه دقیق',
    text: 'قبل از هر درمان، وضعیت دهان و دندان و انتظارات شما را با هم مرور می‌کنیم تا مسیر از ابتدا روشن باشد.',
  },
  {
    title: 'درمان متناسب با شما',
    text: 'گزینه‌ها را با توجه به سلامت، زمان و بودجه واقعی‌تان پیشنهاد می‌دهیم — نه نسخه یکسان برای همه.',
  },
  {
    title: 'پیگیری تا بهبود',
    text: 'بعد از درمان‌های حساس کنار شما می‌مانیم تا نتیجه پایدار و آرامش‌بخش بماند.',
  },
] as const

const roleParts = profile.roles.split('|').map(part => part.trim())

const gallery = [
  { src: '/clinic/02-lobby.jpg', label: 'لابی' },
  { src: '/clinic/07-digital.jpg', label: 'دیجیتال' },
  { src: '/clinic/06-vip.jpg', label: 'VIP' },
  { src: '/clinic/04-ops-1.jpg', label: 'یونیت' },
] as const

const activePillar = ref(0)
const heroRef = ref<HTMLElement | null>(null)
const tilt = reactive({ x: 0, y: 0 })
const isCompact = ref(false)
let mediaQuery: MediaQueryList | null = null
let pillarTimer: ReturnType<typeof setInterval> | null = null

function onHeroMove(e: PointerEvent) {
  if (isCompact.value) return
  const el = heroRef.value
  if (!el) return
  const r = el.getBoundingClientRect()
  tilt.x = ((e.clientY - r.top) / r.height - 0.5) * -5
  tilt.y = ((e.clientX - r.left) / r.width - 0.5) * 7
}

function onHeroLeave() {
  tilt.x = 0
  tilt.y = 0
}

function onMq(e: MediaQueryListEvent) {
  isCompact.value = e.matches
  if (e.matches) {
    tilt.x = 0
    tilt.y = 0
  }
}

onMounted(() => {
  mediaQuery = window.matchMedia('(max-width: 1023px)')
  isCompact.value = mediaQuery.matches
  mediaQuery.addEventListener('change', onMq)
  pillarTimer = setInterval(() => {
    activePillar.value = (activePillar.value + 1) % pillars.length
  }, 4000)
})

onBeforeUnmount(() => {
  mediaQuery?.removeEventListener('change', onMq)
  if (pillarTimer) clearInterval(pillarTimer)
})
</script>

<template>
  <div class="about-rich text-ink">
    <div class="about-rich-bg pointer-events-none fixed inset-0 -z-10" aria-hidden="true" />

    <!-- Hero -->
    <header
      ref="heroRef"
      class="about-hero relative isolate min-h-[100svh] overflow-hidden"
      @pointermove="onHeroMove"
      @pointerleave="onHeroLeave"
    >
      <div class="pointer-events-none absolute inset-0" aria-hidden="true">
        <div class="about-orb absolute -right-24 top-10 size-[26rem] rounded-full bg-gold/25 blur-3xl" />
        <div class="about-orb about-orb-b absolute -left-20 bottom-20 size-[22rem] rounded-full bg-green-soft/50 blur-3xl" />
        <div class="about-orb about-orb-c absolute left-1/2 top-1/3 size-64 -translate-x-1/2 rounded-full bg-gold/15 blur-3xl" />
      </div>

      <div class="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-12 lg:gap-8 lg:px-8 lg:py-20">
        <div class="order-2 lg:order-1 lg:col-span-5 lg:py-10">
          <SiteReveal variant="soft">
            <p class="reveal-item reveal-item-fade text-[11px] font-semibold tracking-[0.22em] text-green-deep" style="--reveal-i: 0">
              درباره ما · {{ profile.location }}
            </p>
            <h1
              class="reveal-item mt-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-[2.9rem] lg:leading-[1.15]"
              style="--reveal-i: 1"
            >
              {{ profile.name }}
            </h1>
            <p class="reveal-item mt-4 text-lg font-medium leading-8 text-ink/85" style="--reveal-i: 2">
              مراقبت دندانپزشکی که بتوان به آن اعتماد کرد
            </p>
            <p class="reveal-item reveal-item-fade mt-4 max-w-md text-[15px] leading-8 text-ink-muted" style="--reveal-i: 3">
              در جهانشهر کرج، مسیر درمان را شفاف، آرام و متناسب با شما پیش می‌بریم —
              از معاینه تا ایمپلنت و لمینت.
            </p>

            <ul class="mt-6 flex flex-wrap gap-2 py-1">
              <li
                v-for="(role, index) in roleParts"
                :key="role"
                class="reveal-item reveal-item-scale rounded-full bg-panel px-4 py-2.5 text-[12px] font-medium leading-none text-ink shadow-sm ring-1 ring-mist-deep"
                :style="{ '--reveal-i': index + 4 }"
              >
                {{ role }}
              </li>
            </ul>

            <div class="reveal-item reveal-item-scale mt-8 flex flex-wrap gap-3" style="--reveal-i: 7">
              <NuxtLink
                to="/consultation"
                class="inline-flex rounded-2xl bg-green-deep px-5 py-3.5 text-sm font-bold text-on-primary shadow-[0_14px_36px_rgba(15,118,110,0.3)] transition hover:-translate-y-0.5 hover:brightness-110"
              >
                رزرو نوبت
              </NuxtLink>
              <NuxtLink
                to="/clinic"
                class="inline-flex rounded-2xl bg-mist px-5 py-3.5 text-sm font-semibold text-ink ring-1 ring-mist-deep transition hover:-translate-y-0.5 hover:bg-panel"
              >
                تور کلینیک
              </NuxtLink>
            </div>
          </SiteReveal>
        </div>

        <!-- Portrait stage -->
        <div class="order-1 flex w-full justify-center lg:order-2 lg:col-span-7 lg:justify-end">
          <SiteReveal class="w-full max-w-md lg:max-w-[min(100%,28rem)] xl:max-w-[30rem]" variant="zoom" delay="40ms">
            <div
              class="about-stage relative aspect-[4/5] w-full"
              :style="{ transform: isCompact ? undefined : `translate3d(${tilt.y * 1.2}px, ${tilt.x * 1.2}px, 0)` }"
            >
              <div class="about-stage-glow absolute left-1/2 top-1/2 size-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/30 blur-3xl" aria-hidden="true" />

              <!-- Back plates -->
              <div class="about-plate about-plate-a absolute inset-[8%] rounded-[2rem] bg-panel/40 ring-1 ring-mist-deep/60" aria-hidden="true" />
              <div class="about-plate about-plate-b absolute inset-[4%] rounded-[2rem] bg-green-soft/35 ring-1 ring-mist-deep/40" aria-hidden="true" />

              <figure class="about-portrait absolute inset-0 overflow-hidden rounded-[2rem] shadow-[0_30px_80px_rgba(0,0,0,0.28)] ring-1 ring-mist-deep">
                <img
                  src="/images/doctor-rahmati.jpg"
                  :alt="profile.name"
                  class="size-full object-cover object-[center_12%]"
                  width="900"
                  height="1100"
                  fetchpriority="high"
                >
                <div class="absolute inset-0 bg-gradient-to-t from-band/80 via-transparent to-transparent" />
                <figcaption class="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                  <p class="text-[11px] font-semibold tracking-[0.18em] text-gold">
                    {{ profile.barSince }}
                  </p>
                  <p class="mt-1 text-base font-bold text-on-band sm:text-lg">
                    {{ profile.location }} · کسری شمالی، کوچه غزال
                  </p>
                </figcaption>
              </figure>

            </div>
          </SiteReveal>
        </div>
      </div>

      <!-- Stats dock -->
      <div class="relative mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8 lg:pb-16">
        <SiteReveal variant="up" delay="60ms">
          <dl class="grid grid-cols-3 gap-3 sm:gap-4">
            <div
              v-for="(stat, index) in profile.stats"
              :key="stat.label"
              class="about-stat reveal-item reveal-item-scale rounded-[1.35rem] bg-panel px-3 py-5 text-center shadow-[0_12px_32px_rgba(0,0,0,0.12)] ring-1 ring-mist-deep backdrop-blur-sm sm:px-5 sm:py-6"
              :style="{ '--reveal-i': index }"
            >
              <dt class="text-2xl font-bold text-green-deep sm:text-3xl">
                {{ stat.value }}
              </dt>
              <dd class="mt-2 text-[11px] text-ink-muted sm:text-xs">
                {{ stat.label }}
              </dd>
            </div>
          </dl>
        </SiteReveal>
      </div>
    </header>

    <!-- Story + clinic peek -->
    <section class="relative border-t border-mist-deep bg-mist/35">
      <div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div class="grid gap-12 lg:grid-cols-12 lg:gap-14">
          <div class="lg:col-span-7">
            <SiteReveal variant="soft">
              <p class="reveal-item reveal-item-fade text-[11px] font-semibold tracking-[0.2em] text-green-deep" style="--reveal-i: 0">
                داستان کلینیک
              </p>
              <h2 class="reveal-item mt-3 text-2xl font-bold tracking-tight sm:text-3xl" style="--reveal-i: 1">
                از ۱۳۹۵ تا امروز، کنار خانواده شما
              </h2>
              <div class="mt-8 space-y-5">
                <p
                  v-for="(paragraph, index) in profile.story.slice(0, 4)"
                  :key="paragraph"
                  class="reveal-item reveal-item-fade text-[15px] leading-8 text-ink-muted sm:text-base sm:leading-9"
                  :style="{ '--reveal-i': index + 2 }"
                >
                  {{ paragraph }}
                </p>
              </div>
              <details class="reveal-item reveal-item-scale group mt-6 rounded-2xl bg-panel p-5 shadow-sm ring-1 ring-mist-deep" style="--reveal-i: 6">
                <summary class="cursor-pointer list-none text-sm font-semibold text-green-deep marker:content-none [&::-webkit-details-marker]:hidden">
                  <span class="group-open:hidden">ادامه داستان و جزئیات بیشتر</span>
                  <span class="hidden group-open:inline">بستن</span>
                </summary>
                <div class="mt-4 space-y-5 border-t border-mist-deep pt-4">
                  <p
                    v-for="paragraph in profile.story.slice(4)"
                    :key="paragraph"
                    class="text-[15px] leading-8 text-ink-muted"
                  >
                    {{ paragraph }}
                  </p>
                </div>
              </details>
            </SiteReveal>
          </div>

          <div class="lg:col-span-5">
            <SiteReveal variant="left" delay="50ms">
              <div class="about-side-stack space-y-4">
                <div class="overflow-hidden rounded-[1.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.18)] ring-1 ring-mist-deep">
                  <img
                    src="/clinic/01-facade.jpg"
                    alt="نمای کلینیک"
                    class="aspect-[16/11] w-full object-cover"
                    loading="lazy"
                  >
                </div>
                <div class="rounded-[1.5rem] bg-band p-6 text-on-band shadow-[0_20px_50px_rgba(15,23,42,0.18)]">
                  <p class="text-[11px] font-semibold tracking-[0.16em] text-gold">
                    آدرس
                  </p>
                  <p class="mt-2 text-lg font-bold">
                    {{ profile.location }}
                  </p>
                  <p class="mt-2 text-sm leading-7 text-on-band/70">
                    {{ profile.bar }}
                  </p>
                  <a
                    :href="`mailto:${profile.email}`"
                    class="mt-5 inline-flex rounded-xl bg-gold px-4 py-2.5 text-sm font-bold text-on-accent transition hover:brightness-105"
                  >
                    {{ profile.email }}
                  </a>
                </div>
              </div>
            </SiteReveal>
          </div>
        </div>

        <!-- Mini gallery -->
        <SiteReveal variant="up" delay="40ms">
          <ul class="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            <li
              v-for="(item, index) in gallery"
              :key="item.src"
              class="about-gal reveal-item reveal-item-scale group relative overflow-hidden rounded-2xl shadow-sm ring-1 ring-mist-deep"
              :style="{ '--reveal-i': index }"
            >
              <img
                :src="item.src"
                :alt="item.label"
                class="aspect-[4/3] w-full object-cover transition duration-700 group-hover:scale-105"
                loading="lazy"
              >
              <span class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-band/70 to-transparent px-3 pb-3 pt-8 text-xs font-semibold text-on-band">
                {{ item.label }}
              </span>
            </li>
          </ul>
        </SiteReveal>
      </div>
    </section>

    <!-- Credentials -->
    <section class="relative border-t border-mist-deep">
      <div class="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-green-soft/15 to-transparent" aria-hidden="true" />
      <div class="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <SiteReveal variant="fade">
          <div class="mb-10 text-center">
            <p class="text-[11px] font-semibold tracking-[0.2em] text-green-deep">
              مسیر حرفه‌ای
            </p>
            <h2 class="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
              تحصیلات، تجربه و توانمندی‌ها
            </h2>
          </div>
        </SiteReveal>

        <div class="grid gap-5 lg:grid-cols-2 lg:gap-6">
          <SiteReveal variant="right">
            <div class="about-panel h-full rounded-[1.6rem] bg-panel p-6 shadow-[0_16px_48px_rgba(0,0,0,0.12)] ring-1 ring-mist-deep sm:p-7">
              <h3 class="text-sm font-bold text-ink">
                سوابق تحصیلی
              </h3>
              <ol class="mt-6 space-y-4">
                <li
                  v-for="(item, index) in profile.education"
                  :key="item.title"
                  class="flex gap-4 rounded-2xl bg-mist px-4 py-4 ring-1 ring-mist-deep"
                >
                  <span class="inline-flex size-11 shrink-0 items-center justify-center rounded-2xl bg-band font-mono text-sm font-bold text-gold">
                    {{ String(index + 1).padStart(2, '0') }}
                  </span>
                  <div>
                    <p class="font-bold text-ink">
                      {{ item.title }}
                    </p>
                    <p v-if="item.place" class="mt-1 text-sm text-ink-muted">
                      {{ item.place }}
                    </p>
                  </div>
                </li>
              </ol>

              <h3 class="mt-8 text-sm font-bold text-ink">
                نکات برجسته
              </h3>
              <ul class="mt-4 space-y-3">
                <li
                  v-for="item in profile.honors"
                  :key="item"
                  class="flex gap-3 text-sm leading-7 text-ink-muted"
                >
                  <span class="mt-2.5 size-2 shrink-0 rounded-full bg-green-deep" aria-hidden="true" />
                  {{ item }}
                </li>
              </ul>
            </div>
          </SiteReveal>

          <div class="space-y-5">
            <SiteReveal
              v-for="(job, index) in profile.experience"
              :key="job.title"
              :variant="index % 2 === 0 ? 'left' : 'soft'"
              :delay="`${index * 40}ms`"
            >
              <article class="about-panel rounded-[1.6rem] bg-panel p-6 shadow-[0_16px_48px_rgba(0,0,0,0.12)] ring-1 ring-mist-deep sm:p-7">
                <p class="text-[11px] font-semibold tracking-[0.16em] text-green-deep">
                  {{ job.place }}
                </p>
                <h3 class="mt-2 text-lg font-bold text-ink">
                  {{ job.title }}
                </h3>
                <ul class="mt-4 grid gap-2 sm:grid-cols-1">
                  <li
                    v-for="line in job.items"
                    :key="line"
                    class="flex gap-3 rounded-xl bg-mist/80 px-3 py-2.5 text-sm leading-7 text-ink-muted ring-1 ring-mist-deep"
                  >
                    <span class="mt-2 size-1.5 shrink-0 rounded-full bg-gold" aria-hidden="true" />
                    {{ line }}
                  </li>
                </ul>
              </article>
            </SiteReveal>
          </div>
        </div>

        <SiteReveal variant="up" delay="40ms">
          <ul class="mt-8 flex flex-wrap justify-center gap-2 py-1">
            <li
              v-for="(skill, index) in profile.skills"
              :key="skill"
              class="about-skill reveal-item reveal-item-fade rounded-full bg-panel px-4 py-2.5 text-[12px] font-medium text-ink shadow-sm ring-1 ring-mist-deep"
              :style="{ '--reveal-i': index }"
            >
              {{ skill }}
            </li>
          </ul>
        </SiteReveal>
      </div>
    </section>

    <!-- Pillars interactive -->
    <section class="relative border-t border-mist-deep bg-mist/40">
      <div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <SiteReveal variant="fade">
          <div class="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p class="text-[11px] font-semibold tracking-[0.2em] text-green-deep">
                شیوه کار
              </p>
              <h2 class="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
                سه اصل مراقبت
              </h2>
            </div>
            <div class="flex gap-2">
              <button
                v-for="(_, index) in pillars"
                :key="index"
                type="button"
                class="h-2 rounded-full transition-all"
                :class="activePillar === index ? 'w-8 bg-green-deep' : 'w-2 bg-mist-deep'"
                :aria-label="`اصل ${index + 1}`"
                @click="activePillar = index"
              />
            </div>
          </div>
        </SiteReveal>

        <div class="grid gap-4 lg:grid-cols-3">
          <button
            v-for="(item, index) in pillars"
            :key="item.title"
            type="button"
            class="about-pillar rounded-[1.6rem] p-6 text-start transition duration-500 sm:p-7"
            :class="activePillar === index
              ? 'about-pillar-active bg-band text-on-band shadow-[0_24px_60px_rgba(15,23,42,0.22)]'
              : 'bg-panel text-ink shadow-sm ring-1 ring-mist-deep hover:-translate-y-1'"
            @click="activePillar = index"
          >
            <span
              class="inline-flex size-11 items-center justify-center rounded-2xl font-mono text-sm font-bold transition"
              :class="activePillar === index ? 'bg-gold text-on-accent' : 'bg-green-soft text-green-deep'"
            >
              {{ String(index + 1).padStart(2, '0') }}
            </span>
            <h3 class="mt-5 text-xl font-bold">
              {{ item.title }}
            </h3>
            <p
              class="mt-3 text-sm leading-7"
              :class="activePillar === index ? 'text-on-band/75' : 'text-ink-muted'"
            >
              {{ item.text }}
            </p>
          </button>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="relative overflow-hidden">
      <div class="absolute inset-0">
        <img
          src="/clinic/02-lobby.jpg"
          alt=""
          class="size-full object-cover"
          loading="lazy"
        >
        <div class="absolute inset-0 bg-gradient-to-l from-band/92 via-band/85 to-band/75" />
      </div>
      <div class="relative mx-auto flex max-w-7xl flex-col gap-8 px-4 py-16 text-on-band sm:px-6 sm:py-20 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <SiteReveal variant="soft">
          <div class="max-w-xl">
            <p class="text-[11px] font-semibold tracking-[0.2em] text-gold">
              قدم بعد
            </p>
            <h2 class="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
              بیایید مسیر درمان را با هم شروع کنیم
            </h2>
            <p class="mt-3 text-[15px] leading-8 text-on-band/70">
              نوبت بگیرید یا کلینیک را ببینید — طرح درمان را شفاف با شما مرور می‌کنیم.
            </p>
          </div>
        </SiteReveal>
        <SiteReveal variant="scale" delay="40ms">
          <div class="flex flex-wrap gap-3">
            <NuxtLink
              to="/consultation"
              class="inline-flex rounded-2xl bg-gold px-6 py-3.5 text-sm font-bold text-on-accent shadow-[0_14px_36px_color-mix(in_srgb,var(--color-gold)_35%,transparent)] transition hover:-translate-y-0.5 hover:brightness-105"
            >
              رزرو نوبت
            </NuxtLink>
            <NuxtLink
              to="/clinic"
              class="inline-flex rounded-2xl bg-on-band/10 px-6 py-3.5 text-sm font-semibold text-on-band ring-1 ring-on-band/25 transition hover:-translate-y-0.5 hover:bg-on-band/15"
            >
              تور کلینیک
            </NuxtLink>
            <NuxtLink
              to="/contact"
              class="inline-flex rounded-2xl px-6 py-3.5 text-sm font-semibold text-on-band/90 ring-1 ring-on-band/20 transition hover:bg-on-band/10"
            >
              تماس
            </NuxtLink>
          </div>
        </SiteReveal>
      </div>
    </section>
  </div>
</template>

<style scoped>
.about-rich-bg {
  background:
    radial-gradient(ellipse 90% 55% at 100% -10%, color-mix(in srgb, var(--color-gold) 22%, transparent), transparent 55%),
    radial-gradient(ellipse 70% 50% at -10% 30%, color-mix(in srgb, var(--color-green-soft) 45%, transparent), transparent 50%),
    linear-gradient(180deg, var(--color-surface) 0%, var(--color-mist) 42%, var(--color-surface) 100%);
}

.about-orb {
  animation: about-drift 16s ease-in-out infinite;
}
.about-orb-b {
  animation-duration: 20s;
  animation-direction: reverse;
}
.about-orb-c {
  animation-duration: 13s;
}

.about-stage {
  transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
}

.about-plate-a {
  transform: translate(-10px, 8px) rotate(-3deg);
}
.about-plate-b {
  transform: translate(8px, -6px) rotate(2.5deg);
}

.about-portrait {
  animation: about-float 6s ease-in-out infinite;
}

.about-stat {
  transition: transform 0.35s ease, box-shadow 0.35s ease;
}
.about-stat:hover {
  transform: translateY(-4px);
  box-shadow: 0 18px 40px color-mix(in srgb, var(--color-ink) 14%, transparent);
}

.about-panel {
  transition: transform 0.4s ease, box-shadow 0.4s ease;
}
.about-panel:hover {
  transform: translateY(-4px);
  box-shadow: 0 22px 50px color-mix(in srgb, var(--color-ink) 14%, transparent);
}

.about-skill {
  transition: transform 0.3s ease, background-color 0.3s ease, color 0.3s ease;
}
.about-skill:hover {
  transform: translateY(-2px);
  background: var(--color-green-soft);
  color: var(--color-green-deep);
}

.about-gal img {
  transition: transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
}

.about-pillar-active {
  transform: translateY(-6px);
}

@keyframes about-drift {
  0%,
  100% {
    transform: translate3d(0, 0, 0);
  }
  50% {
    transform: translate3d(14px, -18px, 0);
  }
}

@keyframes about-float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .about-orb,
  .about-orb-b,
  .about-orb-c,
  .about-portrait,
  .about-stage {
    animation: none !important;
    transition: none !important;
    transform: none !important;
  }
}

@media (max-width: 1023px) {
  .about-plate-a,
  .about-plate-b,
  .about-portrait {
    transform: none;
    animation: none;
  }
}
</style>
