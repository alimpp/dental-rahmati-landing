import type { CreatePortfolioItemDto } from './dto/portfolio-item.dto';

/** Served from Nest static uploads after seed copy on boot */
export const PORTFOLIO_BEFORE = '/uploads/images/portfolio-smile-before.png';
export const PORTFOLIO_AFTER = '/uploads/images/portfolio-smile-after.png';

/**
 * کیس‌های نمونه کار — عکس قبل/بعد واقعی روی سرور (`uploads`).
 * در ادمین قابل ویرایش و جایگزینی‌اند.
 */
export const PORTFOLIO_SEED: CreatePortfolioItemDto[] = [
  {
    title: 'لبخند یکدست با لمینت سرامیکی',
    slug: 'ceramic-veneers-smile',
    treatment: 'لمینت و ونیر',
    patientAlias: 'خانم م.',
    description:
      'بیمار با ناهماهنگی رنگ، لبه‌پرشدگی جزئی و فاصله خفیف بین دندان‌های قدامی مراجعه کرد. پس از بررسی لثه و طراحی لبخند دیجیتال، لمینت‌های سرامیکی نازک با رنگ هماهنگ پوست نصب شد تا لبخند طبیعی و یکدست به‌دست آید — بدون تغییر اغراق‌آمیز فرم صورت.',
    coverImage: PORTFOLIO_AFTER,
    beforeImage: PORTFOLIO_BEFORE,
    afterImage: PORTFOLIO_AFTER,
    gallery: [
      { url: PORTFOLIO_BEFORE, caption: 'وضعیت قبل از درمان' },
      { url: PORTFOLIO_AFTER, caption: 'نتیجه نهایی لبخند' },
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
    coverImage: PORTFOLIO_AFTER,
    beforeImage: PORTFOLIO_BEFORE,
    afterImage: PORTFOLIO_AFTER,
    gallery: [
      { url: PORTFOLIO_BEFORE, caption: 'قبل از کاشت ایمپلنت' },
      { url: PORTFOLIO_AFTER, caption: 'پس از روکش نهایی' },
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
    coverImage: PORTFOLIO_AFTER,
    beforeImage: PORTFOLIO_BEFORE,
    afterImage: PORTFOLIO_AFTER,
    gallery: [
      { url: PORTFOLIO_BEFORE, caption: 'قبل از ترمیم' },
      { url: PORTFOLIO_AFTER, caption: 'بعد از کامپوزیت ونیر' },
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
    coverImage: PORTFOLIO_AFTER,
    beforeImage: PORTFOLIO_BEFORE,
    afterImage: PORTFOLIO_AFTER,
    gallery: [
      { url: PORTFOLIO_BEFORE, caption: 'شروع مسیر ارتودنسی' },
      { url: PORTFOLIO_AFTER, caption: 'نتیجه پایان دوره' },
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
    coverImage: PORTFOLIO_AFTER,
    beforeImage: PORTFOLIO_BEFORE,
    afterImage: PORTFOLIO_AFTER,
    gallery: [
      { url: PORTFOLIO_BEFORE, caption: 'قبل از سفیدسازی' },
      { url: PORTFOLIO_AFTER, caption: 'نتیجه روشن‌تر و یکدست' },
    ],
    sort: 5,
    isActive: true,
  },
];
