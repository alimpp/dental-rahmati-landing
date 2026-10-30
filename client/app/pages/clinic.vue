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
      class="clinic-next relative scroll-mt-28 overflow-hidden border-y border-mist-deep bg-mist"
    >
      <div class="pointer-events-none absolute -left-16 top-0 size-72 rounded-full bg-green-deep/20 blur-3xl" />
      <div class="pointer-events-none absolute -right-10 bottom-0 size-56 rounded-full bg-gold/15 blur-3xl" />
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
                class="inline-flex rounded-2xl bg-green-deep px-4 py-2.5 text-sm font-bold tracking-wide text-on-primary shadow-[0_12px_28px_rgba(15,118,110,0.32)] ring-1 ring-on-band/20 transition hover:-translate-y-0.5 hover:brightness-110"
              >
                رزرو نوبت
              </NuxtLink>
              <NuxtLink
                to="/practice-areas"
                class="inline-flex rounded-2xl bg-surface px-4 py-2.5 text-sm font-semibold text-ink ring-1 ring-mist-deep transition hover:-translate-y-0.5"
              >
                خدمات
              </NuxtLink>
              <NuxtLink
                to="/articles"
                class="inline-flex rounded-2xl bg-surface px-4 py-2.5 text-sm font-semibold text-ink ring-1 ring-mist-deep transition hover:-translate-y-0.5"
              >
                مقالات
              </NuxtLink>
              <NuxtLink
                to="/contact"
                class="inline-flex rounded-2xl bg-surface px-4 py-2.5 text-sm font-semibold text-ink ring-1 ring-mist-deep transition hover:-translate-y-0.5"
              >
                تماس
              </NuxtLink>
            </div>
          </div>
          <div class="clinic-next-cards grid grid-cols-2 gap-3 perspective-[1200px] lg:col-span-5">
            <div
              v-for="(item, index) in highlights"
              :key="item.title"
              class="clinic-next-card rounded-2xl bg-panel p-4 ring-1 ring-mist-deep"
              :style="{ '--i': index }"
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

<style scoped>
.clinic-next-card {
  transform: translateZ(calc(8px + var(--i) * 6px)) rotateY(calc(var(--i) * 0.8deg));
  box-shadow:
    0 10px 24px rgba(15, 23, 42, 0.05),
    0 20px 40px rgba(15, 118, 110, 0.06);
  transition:
    transform 0.4s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.4s ease;
}

.clinic-next-card:hover {
  transform: translateZ(28px) translateY(-4px) rotateY(0deg);
  box-shadow:
    0 16px 32px rgba(15, 23, 42, 0.08),
    0 28px 56px rgba(15, 118, 110, 0.12);
}

@media (prefers-reduced-motion: reduce) {
  .clinic-next-card {
    transform: none !important;
    transition: none !important;
  }
}
</style>
