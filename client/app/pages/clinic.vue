<script setup lang="ts">
import ClinicStoryTour from '~/components/clinic/ClinicStoryTour.vue'
import ServicesSection from '~/modules/service/components/ServicesSection.vue'
import ArticlesPreview from '~/modules/article/components/ArticlesPreview.vue'
import { siteContact } from '~/data/site-contact'

definePageMeta({
  layout: 'default',
})

usePageSeo({
  title: 'تور کلینیک دندانپزشکی در کرج جهانشهر | امیر رحمتی',
  description:
    'بازدید تصویری از ۱۲ فضای کلینیک امیر رحمتی در کرج جهانشهر: ورودی، پذیرش، یونیت درمان، دیجیتال، VIP و استریل.',
  keywords: 'کلینیک دندانپزشکی کرج, کلینیک جهانشهر, تور کلینیک امیر رحمتی, کسری شمالی',
  path: '/clinic',
  image: '/clinic/02-lobby.jpg',
})

const highlights = [
  { title: 'پذیرش دیجیتال', text: 'پرونده و زمان‌بندی شفاف از همان ورود' },
  { title: 'دو یونیت موازی', text: 'کاهش انتظار بدون افت کیفیت درمان' },
  { title: 'مسیر دیجیتال', text: 'اسکن، طراحی و آماده‌سازی دقیق‌تر' },
  { title: 'استریل استاندارد', text: 'چرخه ابزار برای هر جلسه درمان' },
]
</script>

<template>
  <div class="bg-surface">
    <ClinicStoryTour />

    <section
      id="clinic-next"
      class="relative scroll-mt-28 overflow-hidden border-y border-mist-deep bg-mist"
    >
      <div class="pointer-events-none absolute -left-16 top-0 size-72 rounded-full bg-green-deep/15 blur-3xl" />
      <div class="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div class="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div class="lg:col-span-7">
            <p class="text-[11px] font-medium tracking-[0.2em] text-gold">
              ادامه مسیر در کلینیک
            </p>
            <h2 class="mt-3 text-2xl font-bold leading-snug text-ink sm:text-3xl">
              از فضاها تا انتخاب خدمت و مطالعه قبل از نوبت
            </h2>
            <p class="mt-4 max-w-2xl text-[15px] leading-8 text-ink-muted">
              {{ siteContact.address }} — حالا می‌توانید خدمات را مرور کنید، مقاله‌ها را بخوانید یا مستقیم نوبت بگیرید.
            </p>
            <div class="mt-7 flex flex-wrap gap-2">
              <NuxtLink
                to="/consultation"
                class="inline-flex rounded-xl bg-green-deep px-4 py-2.5 text-sm font-bold tracking-wide text-on-primary shadow-[0_8px_22px_rgba(15,118,110,0.35)] ring-1 ring-white/20 transition hover:brightness-110"
              >
                رزرو نوبت
              </NuxtLink>
              <NuxtLink
                to="/practice-areas"
                class="inline-flex rounded-xl bg-surface px-4 py-2.5 text-sm font-semibold text-ink ring-1 ring-mist-deep"
              >
                خدمات
              </NuxtLink>
              <NuxtLink
                to="/articles"
                class="inline-flex rounded-xl bg-surface px-4 py-2.5 text-sm font-semibold text-ink ring-1 ring-mist-deep"
              >
                مقالات
              </NuxtLink>
              <NuxtLink
                to="/contact"
                class="inline-flex rounded-xl bg-surface px-4 py-2.5 text-sm font-semibold text-ink ring-1 ring-mist-deep"
              >
                تماس
              </NuxtLink>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-3 lg:col-span-5">
            <div
              v-for="item in highlights"
              :key="item.title"
              class="rounded-2xl bg-surface p-4 ring-1 ring-mist-deep"
            >
              <p class="text-sm font-semibold text-green-deep">
                {{ item.title }}
              </p>
              <p class="mt-2 text-xs leading-6 text-ink-muted">
                {{ item.text }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <ServicesSection />
    <ArticlesPreview />
  </div>
</template>
