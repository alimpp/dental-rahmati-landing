import type { CreateBannerDto } from './dto/banner.dto';

/**
 * Seed banners for کلینیک دندان‌پزشکی امیر رحمتی — کرج، جهانشهر، کسری شمالی.
 * Local assets under client/public/banners.
 */
export const BANNER_SEED: CreateBannerDto[] = [
  {
    image: '/banners/clinic-lobby-hero.jpg',
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
    image: '/banners/clinic-ops-hero.jpg',
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
    image: '/banners/clinic-vip-hero.jpg',
    title: 'سوییت VIP زیبایی لبخند',
    subtitle: 'لمینت و طراحی لبخند با حریم خصوصی',
    description:
      'فضای اختصاصی زیبایی برای لمینت سرامیکی و بلیچینگ — تجربه آرام در کرج.',
    link: '/articles/laminate-karaj',
    sort: 3,
    button1Text: 'مشاوره لمینت',
    button1Link: '/consultation',
    button2Text: 'کلینیک ما',
    button2Link: '/clinic',
    isActive: true,
  },
  {
    image: '/banners/clinic-digital-hero.jpg',
    title: 'دندان پزشکی دیجیتال در کرج',
    subtitle: 'اسکن، CAD/CAM و طرح دقیق',
    description:
      'اتاق دیجیتال برای اسکن داخل دهان و برنامه‌ریزی ایمپلنت و لمینت بدون قالب سنتی ناخوشایند.',
    link: '/articles/digital-dentistry-karaj',
    sort: 4,
    button1Text: 'دیجیتال در کرج',
    button1Link: '/articles/digital-dentistry-karaj',
    button2Text: 'آدرس کلینیک',
    button2Link: '/contact',
    isActive: true,
  },
];
