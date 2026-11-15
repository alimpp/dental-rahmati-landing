/** Format a YYYY-MM-DD (or Date) as Persian calendar label. */
export function formatJalaliDate(
  value: string | Date,
  options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  },
): string {
  const date = typeof value === 'string'
    ? new Date(`${value.slice(0, 10)}T12:00:00`)
    : value
  if (Number.isNaN(date.getTime())) return String(value)
  return new Intl.DateTimeFormat('fa-IR-u-ca-persian', options).format(date)
}

export function formatJalaliShort(value: string | Date): string {
  return formatJalaliDate(value, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function toIsoDate(date = new Date()): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export type JalaliParts = { jy: number, jm: number, jd: number }

const G_DAYS = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334]

/** Gregorian → Jalali (jalaali algorithm). */
export function toJalali(gy: number, gm: number, gd: number): JalaliParts {
  const gy2 = gm > 2 ? gy + 1 : gy
  let days = 355666
    + (365 * gy)
    + Math.floor((gy2 + 3) / 4)
    - Math.floor((gy2 + 99) / 100)
    + Math.floor((gy2 + 399) / 400)
    + gd
    + G_DAYS[gm - 1]!
  let jy = -1595 + 33 * Math.floor(days / 12053)
  days %= 12053
  jy += 4 * Math.floor(days / 1461)
  days %= 1461
  if (days > 365) {
    jy += Math.floor((days - 1) / 365)
    days = (days - 1) % 365
  }
  const jm = days < 186
    ? 1 + Math.floor(days / 31)
    : 7 + Math.floor((days - 186) / 30)
  const jd = 1 + (days < 186 ? days % 31 : (days - 186) % 30)
  return { jy, jm, jd }
}

/** Jalali → Gregorian. */
export function toGregorian(jy: number, jm: number, jd: number): { gy: number, gm: number, gd: number } {
  jy += 1595
  let days = -355668
    + (365 * jy)
    + Math.floor(jy / 33) * 8
    + Math.floor(((jy % 33) + 3) / 4)
    + jd
    + (jm < 7 ? (jm - 1) * 31 : (jm - 7) * 30 + 186)
  let gy = 400 * Math.floor(days / 146097)
  days %= 146097
  if (days > 36524) {
    gy += 100 * Math.floor(--days / 36524)
    days %= 36524
    if (days >= 365) days += 1
  }
  gy += 4 * Math.floor(days / 1461)
  days %= 1461
  if (days > 365) {
    gy += Math.floor((days - 1) / 365)
    days = (days - 1) % 365
  }
  const gd = days + 1
  const salA = [0, 31, (gy % 4 === 0 && gy % 100 !== 0) || gy % 400 === 0 ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  let gm = 0
  let remaining = gd
  for (gm = 1; gm <= 12 && remaining > salA[gm]!; gm += 1) {
    remaining -= salA[gm]!
  }
  return { gy, gm, gd: remaining }
}

export function isoToJalali(iso: string): JalaliParts {
  const [y, m, d] = iso.slice(0, 10).split('-').map(Number)
  return toJalali(y!, m!, d!)
}

export function jalaliToIso(jy: number, jm: number, jd: number): string {
  const { gy, gm, gd } = toGregorian(jy, jm, jd)
  return `${gy}-${String(gm).padStart(2, '0')}-${String(gd).padStart(2, '0')}`
}

export function jalaliMonthLength(jy: number, jm: number): number {
  if (jm <= 6) return 31
  if (jm <= 11) return 30
  // Esfand: leap if ((jy+12)%33)%4 === 1? classic: leap when ((jy % 33) % 4) === 1 for some; use jalaali leap
  return isJalaliLeap(jy) ? 30 : 29
}

export function isJalaliLeap(jy: number): boolean {
  const breaks = [
    -61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181, 1210, 1635, 2060, 2097, 2192, 2262, 2324, 2394, 2456, 3178,
  ]
  const bl = breaks.length
  let jp = breaks[0]!
  let jump = 0
  for (let i = 1; i < bl; i += 1) {
    const jm = breaks[i]!
    jump = jm - jp
    if (jy < jm) break
    jp = jm
  }
  let n = jy - jp
  if (jump - n < 6) n = n - jump + Math.floor((jump + 4) / 33) * 33
  let leap = (((n + 1) % 33) - 1) % 4
  if (leap === -1) leap = 4
  return leap === 0
}

export const JALALI_MONTHS = [
  'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
  'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند',
] as const

export const JALALI_WEEKDAYS = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'] as const

/** JS getDay(): 0=Sun … 6=Sat. Clinic work days: Sun, Tue, Thu. */
export const CLINIC_WORK_DAYS = [0, 2, 4] as const

export function isClinicWorkIso(iso: string): boolean {
  const d = new Date(`${iso.slice(0, 10)}T12:00:00`)
  if (Number.isNaN(d.getTime())) return false
  return (CLINIC_WORK_DAYS as readonly number[]).includes(d.getDay())
}

/** Hourly appointment ranges: 12:30 → 22:00 (تا ۱۰ شب). */
export function clinicHourlySlots(): { startTime: string, endTime: string, label: string }[] {
  const slots: { startTime: string, endTime: string, label: string }[] = []
  // 12:30, 13:30, … 21:30 (end 22:30) — last start that lands at 22:00 window
  for (let h = 12; h <= 21; h += 1) {
    const startH = h
    const startM = 30
    let endH = h + 1
    let endM = 30
    if (endH > 22 || (endH === 22 && endM > 0)) {
      endH = 22
      endM = 0
    }
    const startTime = `${String(startH).padStart(2, '0')}:${String(startM).padStart(2, '0')}`
    const endTime = `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`
    if (startTime >= endTime) continue
    if (startTime > '21:30') continue
    slots.push({
      startTime,
      endTime,
      label: `${toFaDigits(startTime)} – ${toFaDigits(endTime)}`,
    })
  }
  return slots
}

export function toFaDigits(value: string | number): string {
  return String(value).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)]!)
}

/** Weekday index for Jalali calendar grid start (Sat=0 … Fri=6). */
export function jalaliWeekdayIndex(jy: number, jm: number, jd: number): number {
  const { gy, gm, gd } = toGregorian(jy, jm, jd)
  const js = new Date(gy, gm - 1, gd).getDay() // 0 Sun
  // Convert to Sat-first: Sat=0 … Fri=6
  return (js + 1) % 7
}
