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
