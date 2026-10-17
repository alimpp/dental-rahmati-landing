import type { CreateBannerDto } from './dto/banner.dto';

/**
 * Seed banners for کلینیک دندان‌پزشکی امیر رحمتی — کرج، جهانشهر، کسری شمالی.
 * Local assets under client/public/banners.
 */
export const BANNER_SEED: CreateBannerDto[] = [
  {
    image: '/banners/clinic-hero.jpg',
    title: 'دندان‌پزشکی دیجیتال در کرج جهانشهر',
    subtitle: 'کلینیک دندان‌پزشکی امیر رحمتی | کسری شمالی',
    description:
      'اسکن داخل دهان، طرح درمان دقیق و ایمپلنت، لمینت و پیشگیری در محله‌ای که دسترسی آسان دارید؛ از معاینه تا لبخند نهایی با تجهیزات روز.',
    link: '/practice-areas',
    sort: 1,
    button1Text: 'رزرو نوبت کرج',
    button1Link: '/consultation',
    button2Text: 'خدمات دیجیتال',
    button2Link: '/articles/digital-dentistry-karaj',
    isActive: true,
  },
  {
    image: '/banners/smile-care.jpg',
    title: 'ایمپلنت و لمینت در کرج',
    subtitle: 'طراحی لبخند طبیعی در جهانشهر',
    description:
      'ایمپلنت تیتانیومی، لمینت سرامیکی و کامپوزیت با برنامه شفاف؛ مشاوره در کلینیک امیر رحمتی کوچه غزال، نزدیک کسری شمالی.',
    link: '/practice-areas/smile-design',
    sort: 2,
    button1Text: 'مشاوره ایمپلنت',
    button1Link: '/consultation',
    button2Text: 'مقاله لمینت کرج',
    button2Link: '/articles/laminate-karaj',
    isActive: true,
  },
  {
    image: '/banners/modern-clinic.jpg',
    title: 'لبخند سالم برای خانواده‌های کرج',
    subtitle: 'از کودکان تا ارتودنسی و اورژانس',
    description:
      'جرم‌گیری، ارتودنسی، عصب‌کشی و مراقبت فوری — درمان بدون ابهام در کلینیک جهانشهر؛ مسیر شما را مرحله‌به‌مرحله همراهی می‌کنیم.',
    link: '/catalog/rahmati-clinic-karaj',
    sort: 3,
    button1Text: 'درخواست نوبت',
    button1Link: '/consultation',
    button2Text: 'آدرس و تماس',
    button2Link: '/contact',
    isActive: true,
  },
];
