<script setup lang="ts">
import { siteContact } from '~/data/site-contact'

/** Explore tiles — mix of square and tall like real Instagram Explore */
const tiles = [
  { src: '/clinic/04-ops-1.jpg', tall: true },
  { src: '/clinic/07-digital.jpg', tall: false },
  { src: '/clinic/02-lobby.jpg', tall: false },
  { src: '/clinic/06-vip.jpg', tall: false },
  { src: '/clinic/09-sterile.jpg', tall: true },
  { src: '/clinic/08-xray.jpg', tall: false },
  { src: '/clinic/05-ops-2.jpg', tall: false },
  { src: '/clinic/03-reception.jpg', tall: false },
  { src: '/clinic/10-lab.jpg', tall: true },
  { src: '/clinic/01-facade.jpg', tall: false },
  { src: '/clinic/11-kids.jpg', tall: false },
  { src: '/clinic/12-lounge.jpg', tall: false },
]

const loopTiles = [...tiles, ...tiles]

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
    <div class="pointer-events-none absolute inset-0" aria-hidden="true">
      <div class="ig-orb ig-orb-a absolute -right-24 top-1/4 size-[28rem] rounded-full bg-green-deep/25 blur-3xl" />
      <div class="ig-orb ig-orb-b absolute -left-20 bottom-0 size-[22rem] rounded-full bg-[#833AB4]/20 blur-3xl" />
      <div
        class="absolute inset-0 opacity-[0.06]"
        style="background-image: radial-gradient(circle at 1px 1px, #fff 1px, transparent 0); background-size: 28px 28px"
      />
    </div>

    <div
      class="relative mx-auto grid w-full max-w-7xl items-center gap-10 px-4 py-16 sm:gap-12 sm:px-6 sm:py-20 lg:grid-cols-12 lg:gap-8 lg:px-8 lg:py-0"
      dir="ltr"
    >
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
          <a
            :href="siteContact.instagramUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="text-sm text-white/70 transition hover:text-white"
            dir="ltr"
          >
            @{{ siteContact.instagramHandle }}
          </a>
        </div>
      </div>

      <div class="order-2 flex items-center justify-center lg:col-span-7 lg:min-h-[100svh]">
        <a
          :href="siteContact.instagramUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="ig-phone-wrap reveal-item reveal-item-scale relative block"
          style="--reveal-i: 2"
          :aria-label="`باز کردن اینستاگرام @${siteContact.instagramHandle}`"
        >
          <div class="ig-phone-glow pointer-events-none absolute -inset-8 rounded-[50%] bg-green-deep/15 blur-3xl" aria-hidden="true" />

          <div class="ig-phone relative mx-auto w-[min(74vw,292px)] sm:w-[310px] lg:w-[328px]">
            <span class="absolute -left-[2px] top-[17%] h-7 w-[3px] rounded-l-[2px] bg-[#2c3034]" aria-hidden="true" />
            <span class="absolute -left-[2px] top-[27%] h-12 w-[3px] rounded-l-[2px] bg-[#2c3034]" aria-hidden="true" />
            <span class="absolute -left-[2px] top-[40%] h-12 w-[3px] rounded-l-[2px] bg-[#2c3034]" aria-hidden="true" />
            <span class="absolute -right-[2px] top-[30%] h-14 w-[3px] rounded-r-[2px] bg-[#2c3034]" aria-hidden="true" />

            <div class="relative overflow-hidden rounded-[2.55rem] bg-[#1a1c1e] p-[9px] shadow-[0_28px_70px_rgba(0,0,0,0.5)] ring-1 ring-white/12">
              <div class="relative aspect-[9/19.5] overflow-hidden rounded-[2.05rem] bg-black">
                <div
                  class="absolute left-1/2 top-[11px] z-20 h-[26px] w-[108px] -translate-x-1/2 rounded-full bg-black"
                  aria-hidden="true"
                />

                <div class="absolute inset-0 flex flex-col bg-black" dir="rtl">
                  <div class="relative z-10 flex items-end justify-between px-5 pb-1 pt-2.5 text-[10px] font-semibold text-white">
                    <span>۹:۴۱</span>
                    <span class="flex items-center gap-1 opacity-85">
                      <span class="tracking-tighter">●●●</span>
                      <span class="inline-block h-2.5 w-5 rounded-[3px] border border-white/80">
                        <span class="m-px block h-full w-3/4 rounded-[1px] bg-white" />
                      </span>
                    </span>
                  </div>

                  <div class="relative z-10 px-3 pb-2 pt-1">
                    <p class="mb-2 text-center text-[13px] font-semibold text-white">
                      کاوش
                    </p>
                    <div class="flex items-center gap-2 rounded-xl bg-[#262626] px-3 py-[9px] text-[12px] text-white/55">
                      <span aria-hidden="true">⌕</span>
                      <span>جستجو</span>
                    </div>
                  </div>

                  <div class="relative min-h-0 flex-1 overflow-hidden">
                    <div class="ig-explore-track absolute inset-x-0 top-0 grid grid-cols-3 gap-[1.5px] px-[1.5px] auto-rows-[minmax(0,1fr)]">
                      <div
                        v-for="(tile, index) in loopTiles"
                        :key="`${tile.src}-${index}`"
                        class="relative overflow-hidden bg-[#111]"
                        :class="tile.tall ? 'row-span-2 aspect-[3/6]' : 'aspect-square'"
                      >
                        <img
                          :src="tile.src"
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
                      class="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-black to-transparent"
                      aria-hidden="true"
                    />
                  </div>

                  <div class="relative z-10 flex items-center justify-around border-t border-white/10 bg-black px-1 py-2.5 text-white/65">
                    <span class="text-[15px]" aria-hidden="true">⌂</span>
                    <span class="text-[15px] text-white" aria-hidden="true">⌕</span>
                    <span class="text-[15px]" aria-hidden="true">＋</span>
                    <span class="text-[15px]" aria-hidden="true">▷</span>
                    <span class="size-[22px] overflow-hidden rounded-full ring-1 ring-white/35">
                      <img src="/clinic/01-facade.jpg" alt="" class="size-full object-cover">
                    </span>
                  </div>

                  <div class="flex justify-center bg-black pb-1.5 pt-0.5" aria-hidden="true">
                    <span class="h-[4px] w-[108px] rounded-full bg-white/30" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.ig-phone-wrap {
  animation: ig-float 7s ease-in-out infinite;
}

.ig-orb-a {
  animation: ig-orb-drift 14s ease-in-out infinite;
}
.ig-orb-b {
  animation: ig-orb-drift 18s ease-in-out infinite reverse;
}

.ig-explore-track {
  animation: ig-explore-scroll 36s linear infinite;
  will-change: transform;
}

.ig-cta:hover {
  transform: translateY(-1px);
}

@keyframes ig-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

@keyframes ig-orb-drift {
  0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.8; }
  50% { transform: translate(14px, -18px) scale(1.05); opacity: 1; }
}

@keyframes ig-explore-scroll {
  from { transform: translate3d(0, 0, 0); }
  to { transform: translate3d(0, -50%, 0); }
}

@media (prefers-reduced-motion: reduce) {
  .ig-phone-wrap,
  .ig-orb-a,
  .ig-orb-b,
  .ig-explore-track {
    animation: none;
  }
}
</style>
