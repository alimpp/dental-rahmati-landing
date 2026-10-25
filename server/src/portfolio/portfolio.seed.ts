import type { CreatePortfolioItemDto } from './dto/portfolio-item.dto';

/**
 * Seed کیس‌های نمونه — تصاویر کلینیک موقتی‌اند؛
 * در ادمین با عکس واقعی دندان/لبخند بیمار جایگزین شوند.
 */
export const PORTFOLIO_SEED: CreatePortfolioItemDto[] = [
  {
    title: 'لبخند یکدست با لمینت سرامیکی',
    slug: 'ceramic-veneers-smile',
    treatment: 'لمینت و ونیر',
    patientAlias: 'خانم م.',
    description:
      'بیمار با ناهماهنگی رنگ و فاصله جزئی بین دندان‌های قدامی مراجعه کرد. پس از طراحی دیجیتال لبخند و انتخاب رنگ هماهنگ با پوست، لمینت‌های سرامیکی نازک نصب شد تا لبخند طبیعی و یکدست به‌دست آید — بدون تغییر بیش‌ازحد فرم صورت.',
    coverImage: '/clinic/06-vip.jpg',
    beforeImage: '/clinic/03-reception.jpg',
    afterImage: '/clinic/06-vip.jpg',
    gallery: [
      { url: '/clinic/03-reception.jpg', caption: 'وضعیت قبل از درمان' },
      { url: '/clinic/06-vip.jpg', caption: 'نتیجه پس از نصب لمینت' },
      { url: '/clinic/07-digital.jpg', caption: 'طراحی دیجیتال لبخند' },
    ],
    sort: 1,
    isActive: true,
  },
  {
    title: 'جایگزینی دندان از‌دست‌رفته با ایمپلنت',
    slug: 'single-tooth-implant',
    treatment: 'ایمپلنت',
    patientAlias: 'آقای ر.',
    description:
      'دندان آسیای از‌دست‌رفته باعث افت جویدن و جابه‌جایی دندان‌های مجاور شده بود. با برنامه‌ریزی دیجیتال، فیکسچر ایمپلنت کاشته شد و پس از دوره یکپارچگی استخوان، روکش نهایی هماهنگ با قوس دندانی تحویل داده شد.',
    coverImage: '/clinic/04-ops-1.jpg',
    beforeImage: '/clinic/05-ops-2.jpg',
    afterImage: '/clinic/04-ops-1.jpg',
    gallery: [
      { url: '/clinic/05-ops-2.jpg', caption: 'فضای خالی قبل از کاشت' },
      { url: '/clinic/08-xray.jpg', caption: 'تصویربرداری و برنامه‌ریزی' },
      { url: '/clinic/04-ops-1.jpg', caption: 'روکش نهایی روی ایمپلنت' },
    ],
    sort: 2,
    isActive: true,
  },
  {
    title: 'ترمیم زیبایی با کامپوزیت ونیر',
    slug: 'composite-veneer-repair',
    treatment: 'زیبایی و ترمیم',
    patientAlias: 'خانم س.',
    description:
      'لب‌پرشدگی و تیرگی لبه‌های دو دندان قدامی با کامپوزیت ونیر در یک جلسه اصلاح شد. هدف حفظ حداکثر بافت سالم دندان و رسیدن به رنگ طبیعی در نور روز و محیط کلینیک بود.',
    coverImage: '/clinic/07-digital.jpg',
    beforeImage: '/clinic/02-lobby.jpg',
    afterImage: '/clinic/07-digital.jpg',
    gallery: [
      { url: '/clinic/02-lobby.jpg', caption: 'قبل از ترمیم' },
      { url: '/clinic/07-digital.jpg', caption: 'بعد از کامپوزیت ونیر' },
      { url: '/clinic/10-lab.jpg', caption: 'کنترل رنگ و جزئیات' },
    ],
    sort: 3,
    isActive: true,
  },
  {
    title: 'مرتب‌سازی قوس با ارتودنسی شفاف',
    slug: 'clear-aligner-case',
    treatment: 'ارتودنسی',
    patientAlias: 'آقای ک.',
    description:
      'نامرتبی خفیف تا متوسط قوس بالا با پلاک‌های شفاف پیگیری شد. بیمار هر دو هفته پلاک را تعویض می‌کرد و در پایان دوره، ردیف دندان‌ها منظم‌تر و لبخند متقارن‌تر شد — بدون براکت فلزی ثابت.',
    coverImage: '/clinic/05-ops-2.jpg',
    beforeImage: '/clinic/09-sterile.jpg',
    afterImage: '/clinic/05-ops-2.jpg',
    gallery: [
      { url: '/clinic/09-sterile.jpg', caption: 'شروع درمان' },
      { url: '/clinic/05-ops-2.jpg', caption: 'نتیجه پایان دوره' },
      { url: '/clinic/12-lounge.jpg', caption: 'پیگیری و نگهداری' },
    ],
    sort: 4,
    isActive: true,
  },
];
