<script setup lang="ts">
import {
  siteContact,
  siteContactMapEmbedUrl,
  siteContactMapLink,
} from '~/data/site-contact'
import ContactForm from '~/modules/inquiry/components/ContactForm.vue'

const mapSrc = siteContactMapEmbedUrl()
const mapLink = siteContactMapLink()

const channels = [
  {
    label: 'نشانی کلینیک',
    body: siteContact.address,
    hint: siteContact.addressHint,
  },
  {
    label: 'تلفن',
    body: siteContact.phone,
    href: siteContact.phoneHref,
    hint: siteContact.responseTime,
  },
  {
    label: 'ایمیل',
    body: siteContact.email,
    href: `mailto:${siteContact.email}`,
    hint: 'برای پرسش و ارسال عکس رادیوگرافی',
  },
  {
    label: 'ساعات کاری',
    body: siteContact.hours,
    hint: siteContact.hoursNote,
  },
] as const

const tips = [
  'علائم یا نوع درمان مورد نظر را کوتاه بنویسید تا هماهنگی نوبت دقیق‌تر باشد.',
  'اگر درد حاد یا حساسیت دارید، در پیام ذکر کنید تا اولویت‌بندی شود.',
  'برای مراجعه حضوری، رزرو نوبت قبلی توصیه می‌شود.',
] as const
</script>

<template>
  <section
    id="contact"
    class="relative scroll-mt-24 overflow-hidden bg-white"
  >
    <div class="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-gold to-transparent" />
    <div class="pointer-events-none absolute -left-24 top-20 size-72 rounded-full bg-green-soft/40 blur-3xl" aria-hidden="true" />

    <div class="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
      <div class="max-w-3xl">
        <p class="reveal-item reveal-item-fade text-[11px] font-medium tracking-[0.18em] text-gold" style="--reveal-i: 0">
          تماس با ما
        </p>
        <h2 class="reveal-item mt-3 text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl" style="--reveal-i: 1">
          از همین‌جا نوبت بگیرید
        </h2>
        <p class="reveal-item reveal-item-fade mt-5 text-[15px] leading-8 text-ink-muted" style="--reveal-i: 2">
          برای رزرو نوبت، پرسش درباره درمان یا هماهنگی ویزیت، از فرم استفاده کنید یا مستقیم با کلینیک تماس بگیرید.
          موقعیت کلینیک روی نقشه مشخص شده تا مراجعه حضوری ساده‌تر باشد.
        </p>
      </div>

      <div class="mt-12 grid items-start gap-8 lg:grid-cols-12 lg:gap-12">
        <div class="space-y-4 lg:col-span-5">
          <article
            v-for="(item, index) in channels"
            :key="item.label"
            class="reveal-item reveal-item-left rounded-2xl bg-mist/45 px-5 py-5 ring-1 ring-mist-deep"
            :style="{ '--reveal-i': index + 3 }"
          >
            <p class="text-[11px] font-semibold tracking-[0.12em] text-gold">
              {{ item.label }}
            </p>
            <a
              v-if="'href' in item && item.href"
              :href="item.href"
              class="mt-2 block text-sm font-medium leading-7 text-green-deep transition hover:text-gold"
            >
              {{ item.body }}
            </a>
            <p
              v-else
              class="mt-2 text-sm leading-7 text-ink"
            >
              {{ item.body }}
            </p>
            <p class="mt-2 text-[12px] leading-6 text-ink-muted">
              {{ item.hint }}
            </p>
          </article>

          <ul class="space-y-3 rounded-[1.4rem] bg-ink px-5 py-5 text-white">
            <li
              v-for="(tip, index) in tips"
              :key="tip"
              class="reveal-item reveal-item-fade flex gap-3 text-[13px] leading-7 text-white/75"
              :style="{ '--reveal-i': channels.length + 3 + index }"
            >
              <span class="mt-2 size-1.5 shrink-0 rounded-full bg-gold" aria-hidden="true" />
              {{ tip }}
            </li>
          </ul>
        </div>

        <div
          class="reveal-item reveal-item-scale lg:col-span-7"
          :style="{ '--reveal-i': channels.length + tips.length + 3 }"
        >
          <div class="rounded-[1.6rem] bg-white p-5 shadow-[0_24px_60px_rgba(43,48,54,0.08)] ring-1 ring-mist-deep sm:p-8">
            <p class="text-[11px] font-medium tracking-[0.16em] text-gold">
              فرم تماس
            </p>
            <h3 class="mt-2 text-xl font-semibold tracking-tight text-ink">
              پیام خود را ثبت کنید
            </h3>
            <p class="mt-2 text-[13px] leading-7 text-ink-muted">
              نام، شماره و توضیح کوتاه کافی است. پس از بررسی اولیه، برای هماهنگی وقت با شما تماس می‌گیریم.
            </p>
            <div class="mt-6">
              <ContactForm source="home" default-subject="تماس از صفحه اصلی کلینیک امیر رحمتی" />
            </div>
          </div>
        </div>
      </div>

      <div
        class="reveal-item reveal-item-slide mt-12 overflow-hidden rounded-[1.6rem] ring-1 ring-mist-deep"
        :style="{ '--reveal-i': channels.length + tips.length + 4 }"
      >
        <div class="flex flex-wrap items-center justify-between gap-3 border-b border-mist bg-mist/40 px-5 py-4">
          <div>
            <p class="text-sm font-semibold text-ink">
              موقعیت کلینیک روی نقشه
            </p>
            <p class="mt-1 text-[12px] leading-6 text-ink-muted">
              {{ siteContact.address }}
            </p>
          </div>
          <a
            :href="mapLink"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center rounded-xl bg-ink px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-gold hover:text-ink"
          >
            باز کردن نقشه بزرگ
          </a>
        </div>
        <iframe
          :src="mapSrc"
          title="نقشه موقعیت کلینیک دندان‌پزشکی امیر رحمتی"
          class="block h-72 w-full border-0 sm:h-96"
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
          allowfullscreen
        />
      </div>
    </div>
  </section>
</template>
