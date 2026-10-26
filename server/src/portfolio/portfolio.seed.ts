import type { CreatePortfolioItemDto } from './dto/portfolio-item.dto';

/**
 * کیس‌های نمونه کار — عکس‌ها از منابع آزاد (Pexels) به‌عنوان تصویر آموزشی/نمونه؛
 * در ادمین با عکس واقعی بیماران کلینیک قابل جایگزینی‌اند.
 */
export const PORTFOLIO_SEED: CreatePortfolioItemDto[] = [
  {
    title: 'لبخند یکدست با لمینت سرامیکی',
    slug: 'ceramic-veneers-smile',
    treatment: 'لمینت و ونیر',
    patientAlias: 'خانم م.',
    description:
      'بیمار با ناهماهنگی رنگ، لبه‌پرشدگی جزئی و فاصله خفیف بین دندان‌های قدامی مراجعه کرد. پس از بررسی لثه و طراحی لبخند دیجیتال، لمینت‌های سرامیکی نازک با رنگ هماهنگ پوست نصب شد تا لبخند طبیعی و یکدست به‌دست آید — بدون تغییر اغراق‌آمیز فرم صورت.',
    coverImage: '/portfolio/smile-after-01.jpg',
    beforeImage: '/portfolio/teeth-close-01.jpg',
    afterImage: '/portfolio/smile-after-01.jpg',
    gallery: [
      { url: '/portfolio/teeth-close-01.jpg', caption: 'وضعیت قبل از درمان' },
      { url: '/portfolio/veneer-proc-01.jpg', caption: 'مرحله آماده‌سازی و ونیر' },
      { url: '/portfolio/veneer-proc-02.jpg', caption: 'نصب لمینت سرامیکی' },
      { url: '/portfolio/smile-after-01.jpg', caption: 'نتیجه نهایی لبخند' },
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
      'دندان آسیای از‌دست‌رفته باعث افت جویدن و تمایل به جابه‌جایی دندان‌های مجاور شده بود. با تصویربرداری و برنامه‌ریزی، فیکسچر ایمپلنت کاشته شد و پس از دوره یکپارچگی استخوان، روکش نهایی هماهنگ با قوس دندانی تحویل داده شد تا جویدن و زیبایی بازیابی شود.',
    coverImage: '/portfolio/dental-exam-01.jpg',
    beforeImage: '/portfolio/dental-tools-01.jpg',
    afterImage: '/portfolio/dental-exam-01.jpg',
    gallery: [
      { url: '/portfolio/dental-tools-01.jpg', caption: 'ارزیابی و آماده‌سازی' },
      { url: '/clinic/08-xray.jpg', caption: 'تصویربرداری و برنامه‌ریزی' },
      { url: '/clinic/04-ops-1.jpg', caption: 'محیط جراحی استریل' },
      { url: '/portfolio/dental-exam-01.jpg', caption: 'کنترل پس از درمان' },
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
      'لب‌پرشدگی و تیرگی لبه‌های دو دندان قدامی در یک جلسه با کامپوزیت ونیر اصلاح شد. هدف حفظ حداکثر بافت سالم دندان و رسیدن به رنگ طبیعی در نور روز بود تا لبخند بدون ظاهر مصنوعی بازگردد.',
    coverImage: '/portfolio/smile-after-02.jpg',
    beforeImage: '/portfolio/teeth-close-02.jpg',
    afterImage: '/portfolio/smile-after-02.jpg',
    gallery: [
      { url: '/portfolio/teeth-close-02.jpg', caption: 'قبل از ترمیم' },
      { url: '/portfolio/dental-care-01.jpg', caption: 'فرم‌دهی کامپوزیت' },
      { url: '/portfolio/smile-after-02.jpg', caption: 'بعد از کامپوزیت ونیر' },
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
      'نامرتبی خفیف تا متوسط قوس بالا با پلاک‌های شفاف پیگیری شد. بیمار هر دو هفته پلاک را تعویض می‌کرد و با کنترل‌های دوره‌ای در کلینیک، در پایان دوره ردیف دندان‌ها منظم‌تر و لبخند متقارن‌تر شد — بدون براکت فلزی ثابت.',
    coverImage: '/portfolio/smile-after-03.jpg',
    beforeImage: '/portfolio/orthodontics-01.jpg',
    afterImage: '/portfolio/smile-after-03.jpg',
    gallery: [
      { url: '/portfolio/orthodontics-01.jpg', caption: 'شروع مسیر ارتودنسی' },
      { url: '/portfolio/dental-care-01.jpg', caption: 'کنترل و بهداشت حین درمان' },
      { url: '/portfolio/smile-after-03.jpg', caption: 'نتیجه پایان دوره' },
    ],
    sort: 4,
    isActive: true,
  },
  {
    title: 'سفیدسازی حرفه‌ای و یکدست‌سازی رنگ',
    slug: 'professional-whitening',
    treatment: 'بلیچینگ',
    patientAlias: 'خانم ن.',
    description:
      'تیرگی ناشی از نوشیدنی و سابقه سیگار با بلیچینگ مطب و محافظ لثه کنترل شد. پس از جلسه درمان و دستورالعمل مراقبت خانگی کوتاه، رنگ دندان‌ها روشن‌تر و یکدست‌تر شد تا پایه مناسبی برای ترمیم‌های زیبایی بعدی باشد.',
    coverImage: '/portfolio/smile-after-04.jpg',
    beforeImage: '/portfolio/dental-care-01.jpg',
    afterImage: '/portfolio/smile-after-04.jpg',
    gallery: [
      { url: '/portfolio/dental-care-01.jpg', caption: 'قبل از سفیدسازی' },
      { url: '/portfolio/veneer-proc-02.jpg', caption: 'جلسه بلیچینگ در مطب' },
      { url: '/portfolio/smile-after-04.jpg', caption: 'نتیجه روشن‌تر و یکدست' },
    ],
    sort: 5,
    isActive: true,
  },
];
