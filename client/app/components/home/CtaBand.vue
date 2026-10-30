<script setup lang="ts">
import { siteContact } from '~/data/site-contact'
</script>

<template>
  <section class="cta-band relative isolate overflow-hidden bg-band">
    <div class="home-glow-dark pointer-events-none absolute inset-0" aria-hidden="true" />
    <div class="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-gold to-transparent" />
    <div class="cta-ring pointer-events-none absolute -left-20 top-1/2 size-96 -translate-y-1/2 rounded-full border border-gold/20" aria-hidden="true" />
    <div class="cta-ring cta-ring-delay pointer-events-none absolute -left-4 top-1/2 size-60 -translate-y-1/2 rounded-full border border-gold/25" aria-hidden="true" />

    <div class="relative mx-auto flex max-w-7xl flex-col items-start gap-8 px-4 py-16 sm:px-6 sm:py-20 lg:flex-row lg:items-center lg:justify-between lg:px-8 lg:py-24">
      <div class="max-w-2xl">
        <p class="reveal-item reveal-item-fade text-[11px] font-medium tracking-[0.18em] text-gold" style="--reveal-i: 0">
          قدم اول
        </p>
        <h2 class="reveal-item mt-3 text-3xl font-semibold leading-tight tracking-tight text-on-band sm:text-4xl" style="--reveal-i: 1">
          لبخند شما، با نگاه تخصصی بررسی می‌شود
        </h2>
        <p class="reveal-item reveal-item-fade mt-4 text-[15px] leading-8 text-on-band/70" style="--reveal-i: 2">
          نوبت اولیه را رزرو کنید یا مستقیم تماس بگیرید. طرح درمان را با شما مرور می‌کنیم.
        </p>
      </div>

      <div class="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
        <NuxtLink
          to="/consultation"
          class="reveal-item reveal-item-scale inline-flex items-center justify-center rounded-xl bg-green-deep px-7 py-3.5 text-sm font-bold tracking-wide text-on-primary shadow-[0_10px_28px_rgba(15,118,110,0.4)] ring-1 ring-on-band/25 transition duration-300 hover:-translate-y-0.5 hover:brightness-110"
          style="--reveal-i: 3"
        >
          رزرو نوبت
        </NuxtLink>
        <a
          :href="siteContact.phoneHref"
          class="reveal-item reveal-item-slide inline-flex items-center justify-center gap-2 rounded-xl px-7 py-3.5 text-sm font-medium text-on-band ring-1 ring-on-band/30 transition duration-300 hover:-translate-y-0.5 hover:bg-on-band/10 hover:ring-gold"
          style="--reveal-i: 4"
        >
          <span class="size-1.5 rounded-full bg-green-deep" aria-hidden="true" />
          {{ siteContact.phone }}
        </a>
      </div>
    </div>
  </section>
</template>
