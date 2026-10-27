import type { CreateBannerDto } from './dto/banner.dto';

/** Served from Nest uploads after seed copy on boot (looping clinic B-roll) */
export const BANNER_PPE = '/uploads/images/banner-ppe.mp4';
export const BANNER_ASSIST = '/uploads/images/banner-assist.mp4';
export const BANNER_ARRIVE = '/uploads/images/banner-arrive.mp4';
export const BANNER_CLEAN = '/uploads/images/banner-clean.mp4';

/**
 * Seed banners — کلینیک امیر رحمتی.
 * Media: longer clinic motion clips (Mixkit free license), stored on server uploads.
 */
export const BANNER_SEED: CreateBannerDto[] = [
  {
    image: BANNER_PPE,
    title: 'کلینیک مدرن در قلب جهانشهر کرج',
    subtitle: 'دکتر امیر رحمتی | کسری شمالی، کوچه غزال',
    description:
      'فضای روشن، پذیرش منظم و دندان‌پزشکی دیجیتال — از معاینه تا ایمپلنت و لمینت در محیطی که اعتماد می‌سازد.',
    link: '/clinic',
    sort: 1,
    button1Text: 'تور کلینیک ما',
    button1Link: '/clinic',
    button2Text: 'رزرو نوبت',
    button2Link: '/consultation',
    isActive: true,
  },
  {
    image: BANNER_ASSIST,
    title: 'اتاق درمان و دقت جراحی',
    subtitle: 'یونیت‌های به‌روز برای ایمپلنت و ترمیم',
    description:
      'نور جراحی، استریل استاندارد و طرح درمان شفاف در کلینیک امیر رحمتی جهانشهر.',
    link: '/practice-areas',
    sort: 2,
    button1Text: 'خدمات کلینیک',
    button1Link: '/practice-areas',
    button2Text: 'مقاله ایمپلنت کرج',
    button2Link: '/articles/implant-karaj',
    isActive: true,
  },
  {
    image: BANNER_ARRIVE,
    title: 'تجربه آرام و حرفه‌ای بیمار',
    subtitle: 'از پذیرش تا یونیت درمان',
    description:
      'مسیر درمان شفاف، تیم همراه و فضای آرامش‌بخش برای هر جلسه در کرج جهانشهر.',
    link: '/consultation',
    sort: 3,
    button1Text: 'رزرو نوبت',
    button1Link: '/consultation',
    button2Text: 'کلینیک ما',
    button2Link: '/clinic',
    isActive: true,
  },
  {
    image: BANNER_CLEAN,
    title: 'مراقبت دقیق و بهداشت حرفه‌ای',
    subtitle: 'پاکسازی، پیشگیری و زیبایی لبخند',
    description:
      'جرم‌گیری، بلیچینگ و مراقبت‌های پیشگیرانه با استاندارد استریل در کلینیک امیر رحمتی.',
    link: '/articles/digital-dentistry-karaj',
    sort: 4,
    button1Text: 'خدمات کلینیک',
    button1Link: '/practice-areas',
    button2Text: 'آدرس کلینیک',
    button2Link: '/contact',
    isActive: true,
  },
];
