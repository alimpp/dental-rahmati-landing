<script setup lang="ts">
/**
 * تور ادیتوریال — کاملاً روی توکن‌های تم
 */
import { CLINIC_ROOMS } from '~/data/clinic-rooms'
import { siteContact } from '~/data/site-contact'

const rooms = CLINIC_ROOMS
const activeId = ref(rooms[0]!.id)
const stripRef = ref<HTMLElement | null>(null)

function scrollToRoom(id: string) {
  const el = document.getElementById(`clinic-room-${id}`)
  if (!el) return
  el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  activeId.value = id
}

function onStripWheel(e: WheelEvent) {
  const strip = stripRef.value
  if (!strip) return
  if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return
  if (strip.scrollWidth > strip.clientWidth + 8) {
    strip.scrollLeft -= e.deltaY
    e.preventDefault()
  }
}

let roomObserver: IntersectionObserver | null = null

onMounted(() => {
  const nodes = rooms
    .map(r => document.getElementById(`clinic-room-${r.id}`))
    .filter((n): n is HTMLElement => !!n)

  if (!nodes.length || typeof IntersectionObserver === 'undefined') return

  roomObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter(e => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
      const top = visible[0]
      if (!top?.target?.id) return
      const id = top.target.id.replace('clinic-room-', '')
      if (id) activeId.value = id
    },
    {
      root: null,
      rootMargin: '-28% 0px -42% 0px',
      threshold: [0.15, 0.35, 0.55],
    },
  )

  nodes.forEach(n => roomObserver!.observe(n))
})

onBeforeUnmount(() => {
  roomObserver?.disconnect()
  roomObserver = null
})

useHead({
  link: rooms.slice(0, 4).map(s => ({
    rel: 'preload' as const,
    as: 'image' as const,
    href: s.image,
  })),
})
</script>

<template>
  <div class="clinic-tour bg-surface text-ink">
    <header class="relative isolate min-h-[70vh] overflow-hidden">
      <img
        src="/clinic/01-facade.jpg"
        alt=""
        class="absolute inset-0 size-full object-cover"
        fetchpriority="high"
      >
      <div class="absolute inset-0 bg-gradient-to-t from-band via-band/60 to-band/30" />
      <div class="relative mx-auto flex min-h-[70vh] max-w-7xl flex-col justify-end px-4 pb-14 pt-28 sm:px-6 lg:px-8 lg:pb-16">
        <p class="text-[11px] font-medium tracking-[0.22em] text-gold">
          کلینیک ما · کرج جهانشهر
        </p>
        <h1 class="mt-4 max-w-3xl text-3xl font-bold leading-snug text-on-band sm:text-5xl sm:leading-[1.2]">
          قدم‌زدن در فضاهای کلینیک امیر رحمتی
        </h1>
        <p class="mt-5 max-w-2xl text-[15px] leading-8 text-on-band/80">
          {{ siteContact.address }} — از ورودی تا یونیت، VIP، دیجیتال و استریل را با اسکرول آرام ببینید.
          از نوار بندانگشتی می‌توانید به هر فضا بپرید.
        </p>
        <div class="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            class="inline-flex rounded-xl bg-gold px-5 py-3 text-sm font-semibold text-on-accent transition hover:opacity-90"
            @click="scrollToRoom(rooms[0]!.id)"
          >
            شروع تور فضاها
          </button>
          <NuxtLink
            to="/consultation"
            class="inline-flex rounded-xl bg-green-deep px-5 py-3 text-sm font-bold tracking-wide text-on-primary shadow-[0_8px_22px_rgba(15,118,110,0.4)] ring-1 ring-white/25 transition hover:brightness-110"
          >
            رزرو نوبت
          </NuxtLink>
        </div>
      </div>
    </header>

    <div class="sticky top-[var(--clinic-header-offset,4.5rem)] z-20 border-y border-mist-deep bg-surface/95 backdrop-blur-md">
      <div class="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <p class="hidden shrink-0 text-[11px] tracking-[0.18em] text-gold sm:block">
          فضاها
        </p>
        <div
          ref="stripRef"
          class="flex min-w-0 flex-1 gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          @wheel="onStripWheel"
        >
          <button
            v-for="(room, i) in rooms"
            :key="room.id"
            type="button"
            class="group relative h-16 w-[4.75rem] shrink-0 overflow-hidden rounded-xl ring-2 transition sm:h-[4.5rem] sm:w-24"
            :class="activeId === room.id
              ? 'ring-gold'
              : 'ring-mist-deep hover:ring-green-deep/50'"
            :aria-current="activeId === room.id ? 'true' : undefined"
            @click="scrollToRoom(room.id)"
          >
            <img
              :src="room.image"
              :alt="room.title"
              class="size-full object-cover transition duration-300 group-hover:scale-105"
              loading="lazy"
            >
            <span class="absolute inset-0 bg-band/25" />
            <span class="absolute inset-x-0 bottom-1 text-center font-mono text-[10px] text-on-band">
              {{ String(i + 1).padStart(2, '0') }}
            </span>
          </button>
        </div>
      </div>
    </div>

    <div class="relative mx-auto max-w-7xl lg:grid lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-10 lg:px-8">
      <nav
        class="sticky top-[calc(var(--clinic-header-offset,4.5rem)+5.5rem)] z-10 hidden max-h-[calc(100vh-8rem)] self-start overflow-y-auto py-10 lg:block"
        aria-label="فهرست فضاهای کلینیک"
      >
        <ol class="space-y-1 border-s border-mist-deep ps-3">
          <li
            v-for="room in rooms"
            :key="room.id"
          >
            <button
              type="button"
              class="w-full rounded-lg px-3 py-2 text-right text-sm transition"
              :class="activeId === room.id
                ? 'bg-green-soft font-semibold text-green-deep'
                : 'text-ink-muted hover:bg-mist hover:text-ink'"
              @click="scrollToRoom(room.id)"
            >
              {{ room.eyebrow }}
            </button>
          </li>
        </ol>
      </nav>

      <div class="px-4 sm:px-6 lg:px-0">
        <article
          v-for="(room, i) in rooms"
          :id="`clinic-room-${room.id}`"
          :key="room.id"
          class="scroll-mt-[calc(var(--clinic-header-offset,4.5rem)+5.75rem)] border-b border-mist py-14 last:border-b-0 sm:py-16 lg:py-20"
        >
          <SiteReveal :variant="i % 2 === 0 ? 'up' : 'soft'" delay="40ms">
            <div
              class="grid items-center gap-8 lg:grid-cols-12 lg:gap-10"
              :class="i % 2 === 1 ? 'lg:[&>*:first-child]:order-2' : ''"
            >
              <div class="relative overflow-hidden rounded-[1.5rem] bg-mist ring-1 ring-mist-deep lg:col-span-7">
                <div class="aspect-[16/11] sm:aspect-[5/3]">
                  <img
                    :src="room.image"
                    :alt="room.title"
                    class="size-full object-cover"
                    :loading="i < 2 ? 'eager' : 'lazy'"
                  >
                </div>
                <span class="absolute top-4 inset-inline-start-4 rounded-full bg-surface/90 px-3 py-1 font-mono text-[11px] font-semibold text-green-deep ring-1 ring-mist-deep backdrop-blur-sm">
                  {{ String(i + 1).padStart(2, '0') }} / {{ String(rooms.length).padStart(2, '0') }}
                </span>
              </div>

              <div class="lg:col-span-5">
                <p class="text-[11px] font-medium tracking-[0.2em] text-gold">
                  {{ room.eyebrow }}
                </p>
                <h2 class="mt-3 text-2xl font-bold leading-snug text-ink sm:text-3xl">
                  {{ room.title }}
                </h2>
                <p class="mt-4 text-[15px] leading-8 text-ink-muted">
                  {{ room.description }}
                </p>
                <div class="mt-7 flex flex-wrap gap-2">
                  <button
                    v-if="i < rooms.length - 1"
                    type="button"
                    class="inline-flex rounded-xl bg-mist px-4 py-2.5 text-sm font-semibold text-ink ring-1 ring-mist-deep transition hover:bg-green-soft hover:text-green-deep"
                    @click="scrollToRoom(rooms[i + 1]!.id)"
                  >
                    فضای بعد: {{ rooms[i + 1]!.eyebrow }}
                  </button>
                  <NuxtLink
                    v-else
                    to="#clinic-next"
                    class="inline-flex rounded-xl bg-green-deep px-4 py-2.5 text-sm font-semibold text-on-primary"
                  >
                    ادامه: خدمات و مقالات
                  </NuxtLink>
                </div>
              </div>
            </div>
          </SiteReveal>
        </article>
      </div>
    </div>
  </div>
</template>

<style scoped>
.clinic-tour {
  --clinic-header-offset: 4.75rem;
}
</style>
