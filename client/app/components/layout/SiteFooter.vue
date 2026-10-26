<script setup lang="ts">
import { siteContact } from '~/data/site-contact'
import { useSiteTheme } from '~/composables/useSiteTheme'

const year = new Date().getFullYear()
const { openPicker } = useSiteTheme()

const columns = [
  {
    title: 'کلینیک',
    links: [
      { label: 'خانه', to: '/' },
      { label: 'کلینیک ما', to: '/clinic' },
      { label: 'درباره ما', to: '/about' },
      { label: 'راهنماها', to: '/guides' },
      { label: 'نمونه کارها', to: '/portfolio' },
    ],
  },
  {
    title: 'خدمات',
    links: [
      { label: 'خدمات', to: '/practice-areas' },
      { label: 'مقالات', to: '/articles' },
      { label: 'رزرو نوبت', to: '/consultation' },
      { label: 'تماس با ما', to: '/contact' },
    ],
  },
] as const
</script>

<template>
  <footer class="relative overflow-hidden bg-band text-on-band">
    <SiteReveal variant="up">
    <div class="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-gold to-transparent" />
    <div class="pointer-events-none absolute -left-20 bottom-0 size-72 rounded-full bg-green-deep/20 blur-3xl" />

    <div class="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
      <div class="grid gap-10 lg:grid-cols-12 lg:gap-12">
        <div class="lg:col-span-5">
          <p class="text-[11px] font-medium tracking-[0.2em] text-gold">
            {{ siteContact.name }}
          </p>
          <p class="mt-4 max-w-md text-[15px] leading-8 text-on-band/75">
            مراقبت دندانپزشکی با رویکرد دقیق و آرام؛ از معاینه و پیشگیری تا ترمیم، زیبایی و ایمپلنت — همراه شما تا لبخندی سالم.
          </p>
          <p class="mt-5 text-sm leading-7 text-on-band/70">
            {{ siteContact.bar }}
          </p>
          <NuxtLink
            to="/consultation"
            class="mt-7 inline-flex rounded-xl bg-green-deep px-5 py-2.5 text-sm font-bold tracking-wide text-on-primary shadow-[0_8px_22px_rgba(15,118,110,0.35)] ring-1 ring-white/20 transition hover:brightness-110"
          >
            رزرو نوبت
          </NuxtLink>
        </div>

        <div class="grid grid-cols-2 gap-8 lg:col-span-4">
          <div v-for="col in columns" :key="col.title">
            <p class="text-xs font-semibold tracking-wide text-gold">
              {{ col.title }}
            </p>
            <ul class="mt-4 space-y-2.5">
              <li v-for="link in col.links" :key="link.to">
                <NuxtLink
                  :to="link.to"
                  class="text-sm text-on-band/75 transition hover:text-gold"
                >
                  {{ link.label }}
                </NuxtLink>
              </li>
            </ul>
          </div>
        </div>

        <div class="lg:col-span-3">
          <p class="text-xs font-semibold tracking-wide text-gold">
            ارتباط
          </p>
          <ul class="mt-4 space-y-3 text-sm leading-7 text-on-band/75">
            <li>{{ siteContact.address }}</li>
            <li>
              <a :href="siteContact.phoneHref" class="transition hover:text-gold">{{ siteContact.phone }}</a>
            </li>
            <li>
              <a :href="`mailto:${siteContact.email}`" class="transition hover:text-gold">{{ siteContact.email }}</a>
            </li>
            <li>{{ siteContact.hours }}</li>
          </ul>
        </div>
      </div>

      <div class="mt-12 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-6 text-[11px] text-on-band/45">
        <p>© {{ year }} {{ siteContact.name }}. همه حقوق محفوظ است.</p>
        <div class="flex items-center gap-4">
          <ThemeIconButton
            tone="on-band"
            label="تغییر تم سایت"
            class="size-9 rounded-full"
            @click="openPicker"
          />
          <p>کرج · جهانشهر · کسری شمالی</p>
        </div>
      </div>
    </div>
    </SiteReveal>
  </footer>
</template>
