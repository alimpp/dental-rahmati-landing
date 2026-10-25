<script setup lang="ts">
import { siteContact } from '~/data/site-contact'

const feed = [
  '/clinic/01-facade.jpg',
  '/clinic/04-ops-1.jpg',
  '/clinic/06-vip.jpg',
  '/clinic/07-digital.jpg',
  '/clinic/02-lobby.jpg',
  '/clinic/09-sterile.jpg',
  '/clinic/05-ops-2.jpg',
  '/clinic/08-xray.jpg',
  '/clinic/11-kids.jpg',
  '/clinic/03-reception.jpg',
  '/clinic/10-lab.jpg',
  '/clinic/12-lounge.jpg',
]

/** Duplicate for seamless vertical loop (-50% translate) */
const loopFeed = [...feed, ...feed]

const highlights = [
  'فضای کلینیک و اتاق‌های درمان',
  'نمونه کارهای قبل و بعد',
  'نکات کوتاه مراقبت و زیبایی',
]
</script>

<template>
  <section
    class="ig-section relative isolate flex min-h-[100svh] items-center overflow-hidden bg-[#070b0c] text-white"
    aria-labelledby="ig-home-heading"
  >
    <!-- Atmosphere -->
    <div class="pointer-events-none absolute inset-0" aria-hidden="true">
      <div class="ig-orb ig-orb-a absolute -right-24 top-1/4 size-[28rem] rounded-full bg-green-deep/25 blur-3xl" />
      <div class="ig-orb ig-orb-b absolute -left-20 bottom-0 size-[22rem] rounded-full bg-[#833AB4]/20 blur-3xl" />
      <div class="ig-orb ig-orb-c absolute left-1/3 top-0 size-64 rounded-full bg-gold/10 blur-3xl" />
      <div
        class="absolute inset-0 opacity-[0.07]"
        style="background-image: radial-gradient(circle at 1px 1px, #fff 1px, transparent 0); background-size: 28px 28px"
      />
    </div>

    <div
      class="relative mx-auto grid w-full max-w-7xl items-center gap-10 px-4 py-16 sm:gap-12 sm:px-6 sm:py-20 lg:grid-cols-12 lg:gap-8 lg:px-8 lg:py-0"
      dir="ltr"
    >
      <!-- Copy — physical left on desktop; first on mobile for CTA -->
      <div
        class="order-1 flex flex-col justify-center lg:col-span-5 lg:min-h-[100svh] lg:py-20"
        dir="rtl"
      >
        <p class="reveal-item reveal-item-fade inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.22em] text-gold" style="--reveal-i: 0">
          <span
            class="inline-block size-4 bg-current"
            style="mask: url(/icons/instagram.svg) center / contain no-repeat; -webkit-mask: url(/icons/instagram.svg) center / contain no-repeat"
            aria-hidden="true"
          />
          اینستاگرام کلینیک
        </p>

        <h2
          id="ig-home-heading"
          class="reveal-item mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15]"
          style="--reveal-i: 1"
        >
          کلینیک امیر رحمتی
          <span class="mt-1 block text-white/55">در اکسپلور اینستاگرام</span>
        </h2>

        <p class="reveal-item reveal-item-up mt-5 max-w-md text-[15px] leading-8 text-white/65" style="--reveal-i: 2">
          عکس‌های فضا، مسیر درمان و لحظه‌های کلینیک را هر روز در اینستاگرام دنبال کنید — کوتاه، تصویری و به‌روز.
        </p>

        <ul class="mt-7 space-y-3">
          <li
            v-for="(line, index) in highlights"
            :key="line"
            class="reveal-item reveal-item-left flex items-start gap-3 text-sm text-white/80"
            :style="{ '--reveal-i': index + 3 }"
          >
            <span class="mt-1.5 size-1.5 shrink-0 rounded-full bg-gold" aria-hidden="true" />
            {{ line }}
          </li>
        </ul>

        <div class="reveal-item reveal-item-scale mt-9 flex flex-wrap items-center gap-3" style="--reveal-i: 6">
          <a
            :href="siteContact.instagramUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="ig-cta inline-flex items-center gap-2.5 rounded-xl bg-gradient-to-l from-[#F58529] via-[#DD2A7B] to-[#8134AF] px-6 py-3.5 text-sm font-bold tracking-wide text-white shadow-[0_12px_36px_rgba(221,42,123,0.35)] transition hover:brightness-110"
          >
            <span
              class="size-5 bg-white"
              style="mask: url(/icons/instagram.svg) center / contain no-repeat; -webkit-mask: url(/icons/instagram.svg) center / contain no-repeat"
              aria-hidden="true"
            />
            دنبال کردن در اینستاگرام
          </a>
          <p class="text-sm text-white/45" dir="ltr">
            @{{ siteContact.instagramHandle }}
          </p>
        </div>
      </div>

      <!-- iPhone — physical right on desktop -->
      <div class="order-2 flex items-center justify-center lg:col-span-7 lg:min-h-[100svh]">
        <div class="ig-phone-wrap reveal-item reveal-item-scale relative" style="--reveal-i: 2">
          <div class="ig-phone-glow pointer-events-none absolute -inset-10 rounded-[50%] bg-green-deep/20 blur-3xl" aria-hidden="true" />

          <div
            class="ig-phone relative mx-auto w-[min(72vw,280px)] sm:w-[300px] lg:w-[320px]"
            role="img"
            :aria-label="`پیش‌نمایش اکسپلور اینستاگرام @${siteContact.instagramHandle}`"
          >
            <!-- Side buttons -->
            <span class="absolute -left-[3px] top-[18%] h-8 w-[3px] rounded-l-sm bg-[#2a2f33]" aria-hidden="true" />
            <span class="absolute -left-[3px] top-[28%] h-14 w-[3px] rounded-l-sm bg-[#2a2f33]" aria-hidden="true" />
            <span class="absolute -left-[3px] top-[42%] h-14 w-[3px] rounded-l-sm bg-[#2a2f33]" aria-hidden="true" />
            <span class="absolute -right-[3px] top-[32%] h-16 w-[3px] rounded-r-sm bg-[#2a2f33]" aria-hidden="true" />

            <!-- Titanium frame -->
            <div class="relative overflow-hidden rounded-[2.65rem] bg-gradient-to-br from-[#3a3f44] via-[#1c1f22] to-[#0c0e10] p-[10px] shadow-[0_40px_80px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.12)] ring-1 ring-white/10">
              <div class="relative aspect-[9/19.4] overflow-hidden rounded-[2.15rem] bg-black">
                <!-- Dynamic Island -->
                <div
                  class="absolute left-1/2 top-3 z-20 h-[1.55rem] w-[7.2rem] -translate-x-1/2 rounded-full bg-black shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]"
                  aria-hidden="true"
                >
                  <span class="absolute right-3 top-1/2 size-2 -translate-y-1/2 rounded-full bg-[#0a2540] ring-1 ring-[#1a4a6e]/50" />
                </div>

                <!-- Screen: Instagram Explore -->
                <div class="absolute inset-0 flex flex-col bg-[#000]" dir="rtl">
                  <!-- Status bar -->
                  <div class="relative z-10 flex items-end justify-between px-6 pb-1 pt-3 text-[10px] font-semibold text-white">
                    <span>۹:۴۱</span>
                    <span class="flex items-center gap-1 opacity-90">
                      <span class="tracking-tighter">●●●</span>
                      <span class="ml-0.5 inline-block h-2.5 w-5 rounded-sm border border-white/80">
                        <span class="m-px block h-full w-3/4 rounded-[1px] bg-white" />
                      </span>
                    </span>
                  </div>

                  <!-- IG header -->
                  <div class="relative z-10 border-b border-white/10 px-3 pb-2.5 pt-1">
                    <p class="mb-2 text-center text-[13px] font-semibold tracking-wide text-white">
                      کاوش
                    </p>
                    <div class="flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-[11px] text-white/55">
                      <span aria-hidden="true">⌕</span>
                      <span>جستجو</span>
                    </div>
                  </div>

                  <!-- Scrolling explore grid -->
                  <div class="relative min-h-0 flex-1 overflow-hidden">
                    <div class="ig-explore-track absolute inset-x-0 top-0 grid grid-cols-3 gap-[2px] px-[2px]">
                      <div
                        v-for="(src, index) in loopFeed"
                        :key="`${src}-${index}`"
                        class="relative aspect-square overflow-hidden bg-[#111]"
                      >
                        <img
                          :src="src"
                          alt=""
                          class="size-full object-cover"
                          width="240"
                          height="240"
                          loading="lazy"
                          draggable="false"
                        >
                      </div>
                    </div>
                    <div
                      class="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black to-transparent"
                      aria-hidden="true"
                    />
                  </div>

                  <!-- Tab bar -->
                  <div class="relative z-10 flex items-center justify-around border-t border-white/10 bg-black/90 px-2 py-2.5 text-white/70">
                    <span class="text-sm" aria-hidden="true">⌂</span>
                    <span class="text-sm text-white" aria-hidden="true">⌕</span>
                    <span class="text-sm" aria-hidden="true">＋</span>
                    <span class="text-sm" aria-hidden="true">♡</span>
                    <span class="size-5 overflow-hidden rounded-full ring-1 ring-white/40">
                      <img src="/clinic/01-facade.jpg" alt="" class="size-full object-cover">
                    </span>
                  </div>

                  <!-- Home indicator -->
                  <div class="flex justify-center bg-black pb-2 pt-1" aria-hidden="true">
                    <span class="h-1 w-28 rounded-full bg-white/35" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.ig-phone-wrap {
  animation: ig-float 5.5s ease-in-out infinite;
}

.ig-orb-a {
  animation: ig-orb-drift 12s ease-in-out infinite;
}
.ig-orb-b {
  animation: ig-orb-drift 16s ease-in-out infinite reverse;
}
.ig-orb-c {
  animation: ig-orb-drift 10s ease-in-out infinite 1s;
}

.ig-explore-track {
  animation: ig-explore-scroll 28s linear infinite;
  will-change: transform;
}

.ig-cta:hover {
  transform: translateY(-1px);
}

@keyframes ig-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-12px); }
}

@keyframes ig-orb-drift {
  0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.85; }
  50% { transform: translate(18px, -24px) scale(1.08); opacity: 1; }
}

@keyframes ig-explore-scroll {
  from { transform: translate3d(0, 0, 0); }
  to { transform: translate3d(0, -50%, 0); }
}

@media (prefers-reduced-motion: reduce) {
  .ig-phone-wrap,
  .ig-orb-a,
  .ig-orb-b,
  .ig-orb-c,
  .ig-explore-track {
    animation: none;
  }
}
</style>
