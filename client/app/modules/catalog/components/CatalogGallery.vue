<script setup lang="ts">
import type { TCatalogGalleryImage } from '~/modules/catalog/types/index.type'

const props = defineProps<{
  images: TCatalogGalleryImage[]
  title?: string
}>()

const mediaSrc = useMediaSrc()
const active = ref<number | null>(null)
const slideDir = ref<'next' | 'prev'>('next')

const activeImage = computed(() =>
  active.value === null ? null : props.images[active.value] ?? null,
)

function open(index: number) {
  slideDir.value = 'next'
  active.value = index
}

function close() {
  active.value = null
}

function next() {
  if (active.value === null || !props.images.length) return
  slideDir.value = 'next'
  active.value = (active.value + 1) % props.images.length
}

function prev() {
  if (active.value === null || !props.images.length) return
  slideDir.value = 'prev'
  active.value = (active.value - 1 + props.images.length) % props.images.length
}

function onKey(event: KeyboardEvent) {
  if (active.value === null) return
  if (event.key === 'Escape') close()
  // RTL: physical right = next, physical left = previous
  if (event.key === 'ArrowRight') next()
  if (event.key === 'ArrowLeft') prev()
}

/** admin-chevron.svg points down; rotate so arrows face outward (away from center). */
function chevronStyle(point: 'left' | 'right') {
  return {
    maskImage: 'url(/icons/admin-chevron.svg)',
    WebkitMaskImage: 'url(/icons/admin-chevron.svg)',
    maskRepeat: 'no-repeat',
    WebkitMaskRepeat: 'no-repeat',
    maskPosition: 'center',
    WebkitMaskPosition: 'center',
    maskSize: 'contain',
    WebkitMaskSize: 'contain',
    transform: point === 'left' ? 'rotate(90deg)' : 'rotate(-90deg)',
  }
}

onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))

watch(active, (value) => {
  if (!import.meta.client) return
  document.body.style.overflow = value === null ? '' : 'hidden'
})
</script>

<template>
  <section v-if="images.length" id="gallery" class="scroll-mt-28">
    <div class="flex flex-wrap items-end justify-between gap-3">
      <div>
        <p class="text-[11px] font-medium tracking-[0.18em] text-gold">
          گالری تصاویر
        </p>
        <h2 class="mt-2 text-2xl font-semibold tracking-tight text-ink">
          {{ title || 'نگاهی نزدیک‌تر' }}
        </h2>
      </div>
      <p class="text-[12px] text-ink-muted">
        {{ images.length }} تصویر · برای بزرگ‌نمایی کلیک کنید
      </p>
    </div>

    <ul class="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:gap-4">
      <li
        v-for="(image, index) in images"
        :key="`${image.url}-${index}`"
        class="reveal-item reveal-item-scale group"
        :style="{ '--reveal-i': index }"
      >
        <button
          type="button"
          class="relative block aspect-[4/3] w-full overflow-hidden rounded-2xl bg-mist ring-1 ring-mist-deep transition hover:ring-gold/40"
          @click="open(index)"
        >
          <img
            :src="mediaSrc(image.url)"
            :alt="image.caption || `تصویر ${index + 1}`"
            class="size-full object-cover transition duration-700 group-hover:scale-105"
            width="640"
            height="480"
            loading="lazy"
          >
          <span
            v-if="image.caption"
            class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 to-transparent px-3 pb-3 pt-8 text-right text-[11px] leading-5 text-white opacity-0 transition group-hover:opacity-100"
          >
            {{ image.caption }}
          </span>
        </button>
      </li>
    </ul>

    <Teleport to="body">
      <Transition name="gallery-overlay">
        <div
          v-if="activeImage"
          class="fixed inset-0 z-[90] flex items-center justify-center bg-ink/90 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="نمایش بزرگ تصویر"
          @click.self="close"
        >
          <button
            type="button"
            class="absolute left-4 top-4 z-10 rounded-xl bg-white/10 px-3 py-2 text-sm text-white ring-1 ring-white/20 transition hover:bg-white/20"
            @click="close"
          >
            بستن
          </button>
          <!-- Right side: next — arrow points outward (right) -->
          <button
            type="button"
            class="absolute right-4 top-1/2 z-10 flex size-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/20 transition hover:bg-white/20"
            aria-label="تصویر بعدی"
            @click="next"
          >
            <span class="inline-block size-6 bg-white" :style="chevronStyle('right')" aria-hidden="true" />
          </button>
          <!-- Left side: prev — arrow points outward (left) -->
          <button
            type="button"
            class="absolute left-4 top-1/2 z-10 flex size-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/20 transition hover:bg-white/20"
            aria-label="تصویر قبلی"
            @click="prev"
          >
            <span class="inline-block size-6 bg-white" :style="chevronStyle('left')" aria-hidden="true" />
          </button>
          <figure class="relative max-h-[85vh] max-w-5xl overflow-hidden">
            <Transition :name="slideDir === 'next' ? 'gallery-slide-next' : 'gallery-slide-prev'" mode="out-in">
              <div :key="active ?? 0" class="gallery-slide">
                <img
                  :src="mediaSrc(activeImage.url)"
                  :alt="activeImage.caption || title || 'گالری'"
                  class="max-h-[75vh] w-full rounded-2xl object-contain"
                >
                <figcaption
                  v-if="activeImage.caption"
                  class="mt-4 text-center text-sm text-white/80"
                >
                  {{ activeImage.caption }}
                </figcaption>
              </div>
            </Transition>
          </figure>
        </div>
      </Transition>
    </Teleport>
  </section>
</template>

<style scoped>
.gallery-overlay-enter-active,
.gallery-overlay-leave-active {
  transition: opacity 0.28s ease;
}
.gallery-overlay-enter-from,
.gallery-overlay-leave-to {
  opacity: 0;
}

.gallery-slide-next-enter-active,
.gallery-slide-next-leave-active,
.gallery-slide-prev-enter-active,
.gallery-slide-prev-leave-active {
  transition:
    opacity 0.32s ease,
    transform 0.32s cubic-bezier(0.22, 1, 0.36, 1);
}

/* next: new image comes from the right (physical), old exits left */
.gallery-slide-next-enter-from {
  opacity: 0;
  transform: translateX(2.5rem) scale(0.98);
}
.gallery-slide-next-leave-to {
  opacity: 0;
  transform: translateX(-2.5rem) scale(0.98);
}

/* prev: new image comes from the left, old exits right */
.gallery-slide-prev-enter-from {
  opacity: 0;
  transform: translateX(-2.5rem) scale(0.98);
}
.gallery-slide-prev-leave-to {
  opacity: 0;
  transform: translateX(2.5rem) scale(0.98);
}
</style>
