export const siteContact = {
  name: 'کلینیک دندان‌پزشکی امیر رحمتی',
  address: 'کرج، جهانشهر، خیابان کسری شمالی، کوچه غزال',
  addressHint: 'دسترسی آسان از جهانشهر؛ نزدیک خیابان کسری شمالی',
  hours: 'شنبه تا چهارشنبه ۹ تا ۲۰ | پنج‌شنبه ۹ تا ۱۴',
  hoursNote: 'نوبت‌های عصر با هماهنگی قبلی امکان‌پذیر است.',
  phone: '۰۲۶-۳۴۲۰۰۰۰۰',
  phoneHref: 'tel:+982634200000',
  email: 'info@dentalrahmati.ir',
  bar: 'دکتر امیر رحمتی — دندانپزشک | کلینیک در کرج، جهانشهر',
  responseTime: 'پاسخ اولیه معمولاً در همان روز کاری',
  city: 'کرج',
  district: 'جهانشهر',
  /** تقریبی — جهانشهر، کسری شمالی */
  lat: 35.8294,
  lng: 50.9972,
  mapZoom: 17,
  instagramHandle: 'dentalrahmati',
  instagramUrl: 'https://www.instagram.com/dentalrahmati/',
} as const

export function siteContactMapEmbedUrl() {
  const { lat, lng, mapZoom } = siteContact
  const delta = 0.006
  const bbox = [lng - delta, lat - delta, lng + delta, lat + delta].join('%2C')
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lng}#map=${mapZoom}/${lat}/${lng}`
}

export function siteContactMapLink() {
  const { lat, lng } = siteContact
  return `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=17/${lat}/${lng}`
}
