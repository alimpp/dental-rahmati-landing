import { MODULE_ICONS, MODULE_LABELS, type AdminModuleKey } from '~/modules/admin/types/index.type'

export type AdminPageGroup = 'main' | 'content' | 'system'

export interface AdminPageMeta {
  path: string
  title: string
  description: string
  group: AdminPageGroup
  groupLabel: string
  icon: string
  module?: AdminModuleKey
  hint?: string
}

const GROUP_LABELS: Record<AdminPageGroup, string> = {
  main: 'نمای کلی',
  content: 'محتوا',
  system: 'سیستم',
}

export const ADMIN_PAGE_META: AdminPageMeta[] = [
  {
    path: '/admin',
    title: 'داشبورد',
    description: 'خلاصه بازدید، محتوا و رزروهای ورودی کلینیک.',
    group: 'main',
    groupLabel: GROUP_LABELS.main,
    icon: '/icons/admin-dashboard.svg',
    hint: 'وضعیت کلی پنل در یک نگاه',
  },
  {
    path: '/admin/reports',
    title: MODULE_LABELS.reports,
    description: 'تحلیل بازدید روزانه، هفتگی و ماهانه صفحات و مقالات.',
    group: 'main',
    groupLabel: GROUP_LABELS.main,
    icon: MODULE_ICONS.reports,
    module: 'reports',
    hint: 'بازه زمانی را برای مقایسه تغییر دهید',
  },
  {
    path: '/admin/banners',
    title: MODULE_LABELS.banners,
    description: 'مدیریت بنرهای صفحه اصلی، ترتیب نمایش و وضعیت انتشار.',
    group: 'content',
    groupLabel: GROUP_LABELS.content,
    icon: MODULE_ICONS.banners,
    module: 'banners',
  },
  {
    path: '/admin/services',
    title: MODULE_LABELS.services,
    description: 'خدمات دندانپزشکی نمایش‌داده‌شده در سایت و صفحه اصلی.',
    group: 'content',
    groupLabel: GROUP_LABELS.content,
    icon: MODULE_ICONS.services,
    module: 'services',
  },
  {
    path: '/admin/articles',
    title: MODULE_LABELS.articles,
    description: 'مقالات، دسته‌بندی، تصویر شاخص و وضعیت انتشار.',
    group: 'content',
    groupLabel: GROUP_LABELS.content,
    icon: MODULE_ICONS.articles,
    module: 'articles',
  },
  {
    path: '/admin/catalog',
    title: MODULE_LABELS.catalog,
    description: 'کاتالوگ‌ها با متن کامل، گالری تصاویر و فایل PDF.',
    group: 'content',
    groupLabel: GROUP_LABELS.content,
    icon: MODULE_ICONS.catalog,
    module: 'catalog',
  },
  {
    path: '/admin/guides',
    title: MODULE_LABELS.guides,
    description: 'راهنماهای خواندنی برای کاربران؛ آماده‌سازی قبل از ویزیت و مراقبت پس از درمان.',
    group: 'content',
    groupLabel: GROUP_LABELS.content,
    icon: MODULE_ICONS.guides,
    module: 'guides',
  },
  {
    path: '/admin/stats',
    title: MODULE_LABELS.stats,
    description: 'آمار و اعداد نمایشی نوار آمار صفحه اصلی.',
    group: 'content',
    groupLabel: GROUP_LABELS.content,
    icon: MODULE_ICONS.stats,
    module: 'stats',
  },
  {
    path: '/admin/promises',
    title: MODULE_LABELS.promises,
    description: 'تعهدات و وعده‌های اعتمادساز صفحه اصلی.',
    group: 'content',
    groupLabel: GROUP_LABELS.content,
    icon: MODULE_ICONS.promises,
    module: 'promises',
  },
  {
    path: '/admin/process-steps',
    title: MODULE_LABELS.process_steps,
    description: 'مراحل مسیر درمان از تماس تا پیگیری.',
    group: 'content',
    groupLabel: GROUP_LABELS.content,
    icon: MODULE_ICONS.process_steps,
    module: 'process_steps',
  },
  {
    path: '/admin/testimonials',
    title: MODULE_LABELS.testimonials,
    description: 'نظرات بیماران برای نمایش در صفحه اصلی.',
    group: 'content',
    groupLabel: GROUP_LABELS.content,
    icon: MODULE_ICONS.testimonials,
    module: 'testimonials',
  },
  {
    path: '/admin/faqs',
    title: MODULE_LABELS.faqs,
    description: 'پرسش‌های پرتکرار و پاسخ‌های کوتاه سایت.',
    group: 'content',
    groupLabel: GROUP_LABELS.content,
    icon: MODULE_ICONS.faqs,
    module: 'faqs',
  },
  {
    path: '/admin/appointment-slots',
    title: MODULE_LABELS.appointment_slots,
    description: 'تعریف بازه‌های خالی برای هر روز؛ کاربران فقط این نوبت‌ها را می‌بینند و رزرو می‌کنند.',
    group: 'system',
    groupLabel: GROUP_LABELS.system,
    icon: MODULE_ICONS.appointment_slots,
    module: 'appointment_slots',
    hint: 'برای هر روز چند بازه زمانی اضافه کنید',
  },
  {
    path: '/admin/appointment-bookings',
    title: MODULE_LABELS.appointment_bookings,
    description: 'لیست نوبت‌های رزروشده با مشخصات بیمار؛ لغو رزرو نوبت را دوباره آزاد می‌کند.',
    group: 'system',
    groupLabel: GROUP_LABELS.system,
    icon: MODULE_ICONS.appointment_bookings,
    module: 'appointment_bookings',
    hint: 'رزروهای جدید را پیگیری کنید',
  },
  {
    path: '/admin/inquiries',
    title: MODULE_LABELS.inquiries,
    description: 'پیام‌های فرم تماس سایت (غیر از رزرو نوبت).',
    group: 'system',
    groupLabel: GROUP_LABELS.system,
    icon: MODULE_ICONS.inquiries,
    module: 'inquiries',
    hint: 'پیام‌های جدید را به‌موقع بررسی کنید',
  },
  {
    path: '/admin/admins',
    title: MODULE_LABELS.admins,
    description: 'مدیریت کاربران ادمین، نقش‌ها و سطح دسترسی.',
    group: 'system',
    groupLabel: GROUP_LABELS.system,
    icon: MODULE_ICONS.admins,
    module: 'admins',
  },
  {
    path: '/admin/history',
    title: MODULE_LABELS.history,
    description: 'لاگ تغییرات و فعالیت‌های انجام‌شده در پنل.',
    group: 'system',
    groupLabel: GROUP_LABELS.system,
    icon: MODULE_ICONS.history,
    module: 'history',
  },
]

export function resolveAdminPageMeta(path: string): AdminPageMeta {
  const exact = ADMIN_PAGE_META.find((item) => item.path === path)
  if (exact) return exact
  const nested = ADMIN_PAGE_META
    .filter((item) => item.path !== '/admin' && path.startsWith(`${item.path}/`))
    .sort((a, b) => b.path.length - a.path.length)[0]
  return nested || ADMIN_PAGE_META[0]!
}
