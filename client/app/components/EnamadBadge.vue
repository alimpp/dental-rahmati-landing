<script setup lang="ts">
withDefaults(
  defineProps<{
    size?: 'sm' | 'md'
  }>(),
  { size: 'sm' },
)

const href =
  'https://trustseal.enamad.ir/?id=7836539&Code=MsttMYlJAng69aTtc1YqD0cVbORKhp1M'
const src =
  'https://trustseal.enamad.ir/logo.aspx?id=7836539&Code=MsttMYlJAng69aTtc1YqD0cVbORKhp1M'
</script>

<template>
  <a
    :href="href"
    target="_blank"
    rel="noopener noreferrer"
    referrerpolicy="origin"
    class="enamad-badge inline-flex shrink-0 items-center justify-center rounded-lg bg-white/95 p-0.5 ring-1 ring-mist/70 transition hover:ring-green-deep/30"
    :aria-label="'نماد اعتماد الکترونیکی'"
  >
    <img
      :src="src"
      alt="نماد اعتماد الکترونیکی"
      referrerpolicy="origin"
      class="block object-contain"
      :class="size === 'md' ? 'h-12 w-auto' : 'h-9 w-auto sm:h-10'"
      width="80"
      height="40"
      loading="lazy"
      decoding="async"
      code="MsttMYlJAng69aTtc1YqD0cVbORKhp1M"
    >
  </a>
</template>
