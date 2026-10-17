import type { CreateTestimonialDto } from './dto/testimonial.dto';

/** Sample testimonials (fictional) for local/dev. Replace via admin panel. */
export const TESTIMONIAL_SEED: CreateTestimonialDto[] = [
  {
    quote:
      'برای طراحی لبخند و لمینت مراجعه کردم. توضیح مراحل، انتخاب رنگ طبیعی و نتیجه نهایی دقیقاً همان چیزی بود که می‌خواستم. فضای کلینیک آرام و حرفه‌ای است.',
    clientName: 'سارا محمدی',
    roleOrCompany: 'بیمار زیبایی لبخند، کرج جهانشهر',
    avatarUrl: null,
    rating: 5,
    sort: 1,
    isActive: true,
    featured: true,
  },
  {
    quote:
      'ایمپلنت دندان عقب را اینجا انجام دادم. از جراحی تا نصب تاج همه چیز شفاف زمان‌بندی شد و درد بعد از عمل خیلی کمتر از تصورم بود.',
    clientName: 'رضا کریمی',
    roleOrCompany: 'بیمار ایمپلنت',
    avatarUrl: null,
    rating: 5,
    sort: 2,
    isActive: true,
    featured: true,
  },
  {
    quote:
      'فرزندم از دندانپزشکی می‌ترسید؛ با صبوری و بازی‌درمانی، فیشورسیلانت و جرم‌گیری‌اش بدون گریه انجام شد. واقعاً ممنون تیم کلینیک امیر رحمتی.',
    clientName: 'نیلوفر احمدی',
    roleOrCompany: 'والد بیمار کودک',
    avatarUrl: null,
    rating: 5,
    sort: 3,
    isActive: true,
    featured: true,
  },
  {
    quote:
      'عصب‌کشی و روکش دندان آسیاب را در چند جلسه تمام کردند. توضیح دادند چرا هر مرحله لازم است و بعد از درمان هیچ درد شبانه نداشتم.',
    clientName: 'امیرحسین نوری',
    roleOrCompany: 'بیمار درمان ریشه',
    avatarUrl: null,
    rating: 4,
    sort: 4,
    isActive: true,
    featured: true,
  },
];
