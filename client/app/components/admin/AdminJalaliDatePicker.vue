<script setup lang="ts">
import {
  CLINIC_WORK_DAYS,
  JALALI_MONTHS,
  JALALI_WEEKDAYS,
  isoToJalali,
  jalaliMonthLength,
  jalaliToIso,
  jalaliWeekdayIndex,
  toFaDigits,
  toIsoDate,
} from '~/utils/jalali'

const model = defineModel<string>({ default: '' })

const props = withDefaults(
  defineProps<{
    /** Restrict selectable days to clinic work days (Sun/Tue/Thu) */
    workDaysOnly?: boolean
    label?: string
  }>(),
  { workDaysOnly: false, label: 'تاریخ' },
)

const open = ref(false)
const root = ref<HTMLElement | null>(null)

const view = reactive({
  jy: 1404,
  jm: 1,
})

function syncViewFromModel() {
  const iso = model.value || toIsoDate()
  const j = isoToJalali(iso)
  view.jy = j.jy
  view.jm = j.jm
}

watch(model, syncViewFromModel, { immediate: true })

const daysInMonth = computed(() => jalaliMonthLength(view.jy, view.jm))
const startPad = computed(() => jalaliWeekdayIndex(view.jy, view.jm, 1))

const cells = computed(() => {
  const list: { jd: number | null, iso: string, disabled: boolean, selected: boolean }[] = []
  for (let i = 0; i < startPad.value; i += 1) {
    list.push({ jd: null, iso: '', disabled: true, selected: false })
  }
  for (let jd = 1; jd <= daysInMonth.value; jd += 1) {
    const iso = jalaliToIso(view.jy, view.jm, jd)
    const dow = new Date(`${iso}T12:00:00`).getDay()
    const workOk = !props.workDaysOnly || (CLINIC_WORK_DAYS as readonly number[]).includes(dow)
    list.push({
      jd,
      iso,
      disabled: !workOk,
      selected: model.value === iso,
    })
  }
  return list
})

function prevMonth() {
  if (view.jm === 1) {
    view.jm = 12
    view.jy -= 1
  }
  else {
    view.jm -= 1
  }
}

function nextMonth() {
  if (view.jm === 12) {
    view.jm = 1
    view.jy += 1
  }
  else {
    view.jm += 1
  }
}

function pick(iso: string, disabled: boolean) {
  if (disabled || !iso) return
  model.value = iso
  open.value = false
}

function onDoc(e: MouseEvent) {
  if (!root.value?.contains(e.target as Node)) open.value = false
}

onMounted(() => document.addEventListener('click', onDoc))
onBeforeUnmount(() => document.removeEventListener('click', onDoc))

const display = computed(() => {
  if (!model.value) return 'انتخاب تاریخ'
  return new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(`${model.value}T12:00:00`))
})
</script>

<template>
  <div ref="root" class="relative text-sm">
    <span class="mb-1 block text-ink-muted">{{ label }}</span>
    <button
      type="button"
      class="flex w-full items-center justify-between gap-2 rounded-xl border border-mist bg-white px-3 py-2.5 text-right outline-none transition hover:border-green-deep focus:border-green-deep"
      :aria-expanded="open"
      @click.stop="open = !open"
    >
      <span :class="model ? 'font-medium text-ink' : 'text-ink-muted'">{{ display }}</span>
      <AdminIcon src="/icons/clock.svg" size="size-3.5" class="text-ink-muted" />
    </button>

    <div
      v-if="open"
      class="absolute inset-x-0 z-40 mt-2 rounded-2xl border border-mist bg-white p-3 shadow-[0_16px_40px_rgba(15,23,42,0.12)]"
      @click.stop
    >
      <div class="mb-3 flex items-center justify-between gap-2">
        <button type="button" class="rounded-lg px-2 py-1 text-ink-muted hover:bg-mist" @click="nextMonth">‹</button>
        <p class="text-sm font-semibold text-ink">
          {{ JALALI_MONTHS[view.jm - 1] }} {{ toFaDigits(view.jy) }}
        </p>
        <button type="button" class="rounded-lg px-2 py-1 text-ink-muted hover:bg-mist" @click="prevMonth">›</button>
      </div>

      <div class="mb-1 grid grid-cols-7 gap-1 text-center text-[11px] text-ink-muted">
        <span v-for="w in JALALI_WEEKDAYS" :key="w">{{ w }}</span>
      </div>
      <div class="grid grid-cols-7 gap-1">
        <button
          v-for="(cell, i) in cells"
          :key="i"
          type="button"
          class="aspect-square rounded-xl text-[13px] transition"
          :class="[
            !cell.jd ? 'invisible' : '',
            cell.selected ? 'bg-green-deep font-bold text-on-primary' : '',
            cell.jd && !cell.selected && !cell.disabled ? 'hover:bg-green-soft text-ink' : '',
            cell.disabled && cell.jd ? 'cursor-not-allowed text-ink-muted/35' : '',
          ]"
          :disabled="!cell.jd || cell.disabled"
          @click="pick(cell.iso, cell.disabled)"
        >
          <span v-if="cell.jd">{{ toFaDigits(cell.jd) }}</span>
        </button>
      </div>
      <p v-if="workDaysOnly" class="mt-3 text-[11px] leading-5 text-ink-muted">
        فقط یکشنبه، سه‌شنبه و پنج‌شنبه — ساعت کاری ۱۲ تا ۲۱
      </p>
    </div>
  </div>
</template>
