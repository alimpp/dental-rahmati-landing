export const siteContact = {
  name: 'کلینیک دندان‌پزشکی امیر رحمتی',
  address:
    'کرج، جهانشهر، ابتدای بلوار جمهوری، نبش کوچه غزال، ساختمان فاتح، طبقه سوم، واحد ۷',
  addressHint: 'جهانشهر کرج؛ نبش کوچه غزال، ساختمان فاتح',
  hours: 'شنبه تا چهارشنبه ۹ تا ۲۰ | پنج‌شنبه ۹ تا ۱۴',
  hoursNote: 'نوبت‌های عصر با هماهنگی قبلی امکان‌پذیر است.',
  phone: '۰۲۶-۳۴۲۰۰۰۰۰',
  phoneHref: 'tel:+982634200000',
  email: 'info@dentalrahmati.ir',
  bar: 'دکتر امیر رحمتی — دندانپزشک | کلینیک در کرج، جهانشهر',
  responseTime: 'پاسخ اولیه معمولاً در همان روز کاری',
  city: 'کرج',
  district: 'جهانشهر',
  /** جهانشهر، بلوار جمهوری، کوچه غزال — ساختمان فاتح */
  lat: 35.8281539,
  lng: 50.979128,
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
