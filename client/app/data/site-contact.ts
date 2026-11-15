export const siteContact = {
  name: 'کلینیک دندان‌پزشکی دکتر امیر رحمتی',
  address:
    'کرج، جهانشهر، خیابان غزال، ساختمان فاتح، طبقه سوم، واحد هفت',
  addressHint: 'جهانشهر کرج؛ خیابان غزال، ساختمان فاتح',
  hours: 'یکشنبه، سه‌شنبه و پنج‌شنبه ۱۲ تا ۲۱',
  hoursNote: 'نوبت‌ها معمولاً از ۱۲:۳۰ تا ۲۲ به‌صورت ساعتی تعریف می‌شوند.',
  phone: '۰۲۶-۳۴۴۴۴۱۱۰',
  phoneHref: 'tel:+982634444110',
  email: 'info@dentalrahmati.ir',
  bar: 'دکتر امیر رحمتی — جراح و دندان‌پزشک | درمان‌های دیجیتال و طراحی لبخند',
  responseTime: 'پاسخ اولیه معمولاً در همان روز کاری',
  city: 'کرج',
  district: 'جهانشهر',
  medicalLicense: '۲۱۹۵۶۶',
  /** جهانشهر، خیابان غزال — ساختمان فاتح (پذیرش۲۴) */
  lat: 35.82824140636249,
  lng: 50.97912939868801,
  mapZoom: 17,
  mapUrl: 'https://maps.app.goo.gl/PF3HoHFnRFbEKwAC6?g_st=ic',
  instagramHandle: 'dr.amir_rahmati',
  instagramUrl: 'https://www.instagram.com/dr.amir_rahmati/',
} as const

export function siteContactMapEmbedUrl() {
  const { lat, lng, mapZoom } = siteContact
  return `https://www.google.com/maps?q=${lat},${lng}&z=${mapZoom}&hl=fa&output=embed`
}

export function siteContactMapLink() {
  return siteContact.mapUrl
}
