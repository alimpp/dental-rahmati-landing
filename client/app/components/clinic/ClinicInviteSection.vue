<script setup lang="ts">
/** دعوت به تور /clinic — توکن‌های تم */
</script>

<template>
  <section class="relative overflow-hidden bg-band text-on-band">
    <div class="absolute inset-0">
      <img
        src="/clinic/02-lobby.jpg"
        alt=""
        class="size-full object-cover opacity-45"
      >
      <div class="absolute inset-0 bg-gradient-to-t from-band via-band/80 to-band/45" />
    </div>

    <div class="relative mx-auto flex max-w-7xl flex-col gap-6 px-4 py-16 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:px-8 lg:py-20">
      <div class="max-w-xl">
        <p class="text-[11px] font-medium tracking-[0.2em] text-gold">
          کلینیک ما
        </p>
        <h2 class="mt-3 text-2xl font-bold leading-snug sm:text-3xl">
          ۱۲ فضای کلینیک جهانشهر را ببینید
        </h2>
        <p class="mt-3 text-[15px] leading-8 text-on-band/80">
          تور آرام و خوانا با عکس هر اتاق و توضیح کوتاه — بدون قفل اسکرول، هم‌رنگ تم سایت.
        </p>
      </div>
      <NuxtLink
        to="/clinic"
        class="inline-flex shrink-0 items-center justify-center rounded-xl bg-gold px-5 py-3 text-sm font-semibold text-on-accent transition hover:opacity-90"
      >
        ورود به تور کلینیک
      </NuxtLink>
    </div>
  </section>
</template>
