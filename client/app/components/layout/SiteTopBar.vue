<script setup lang="ts">
import { siteContact } from '~/data/site-contact'
</script>

<template>
  <div class="site-gold-foil hidden text-ink min-[1440px]:block">
    <div class="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-2.5 2xl:px-8">
      <LayoutTopBarMeta
        icon="/icons/location.svg"
        :label="siteContact.address"
      />

      <div class="flex flex-wrap items-center gap-x-5 gap-y-2">
        <LayoutTopBarMeta
          icon="/icons/clock.svg"
          :label="siteContact.hours"
        />
        <LayoutTopBarMeta
          icon="/icons/phone.svg"
          :label="siteContact.phone"
          :href="siteContact.phoneHref"
        />
      </div>
    </div>
  </div>
</template>
