export const ADMIN_MODULES = [
  'banners',
  'services',
  'articles',
  'catalog',
  'inquiries',
  'appointment_slots',
  'appointment_bookings',
  'admins',
  'history',
  'reports',
  'stats',
  'promises',
  'process_steps',
  'testimonials',
  'faqs',
  'guides',
  'themes',
] as const;

export const PERMISSION_ACTIONS = ['view', 'create', 'edit', 'delete'] as const;

export type AdminModuleKey = (typeof ADMIN_MODULES)[number];
export type PermissionAction = (typeof PERMISSION_ACTIONS)[number];
export type AdminPermissions = Partial<
  Record<AdminModuleKey, PermissionAction[]>
>;

export const MODULE_LABELS: Record<AdminModuleKey, string> = {
  banners: 'بنرها',
  services: 'خدمات',
  articles: 'مقالات',
  catalog: 'کاتالوگ',
  inquiries: 'پیام‌های تماس',
  appointment_slots: 'نوبت‌های خالی',
  appointment_bookings: 'رزروهای نوبت',
  admins: 'ادمین‌ها',
  history: 'تاریخچه',
  reports: 'گزارش بازدید',
  stats: 'آمار صفحه اصلی',
  promises: 'تعهدات صفحه اصلی',
  process_steps: 'مسیر درمان',
  testimonials: 'نظرات بیماران',
  faqs: 'سوالات متداول',
  guides: 'راهنماها',
  themes: 'تم‌ها',
};

export const ACTION_LABELS: Record<PermissionAction, string> = {
  view: 'دیدن',
  create: 'ایجاد',
  edit: 'ویرایش',
  delete: 'حذف',
};

export function emptyPermissions(): AdminPermissions {
  return Object.fromEntries(
    ADMIN_MODULES.map((key) => [key, [] as PermissionAction[]]),
  ) as AdminPermissions;
}

export function hasPermission(
  user:
    | {
        isSuperAdmin?: boolean;
        isActive?: boolean;
        permissions?: AdminPermissions | null;
      }
    | undefined,
  module: AdminModuleKey,
  action: PermissionAction,
): boolean {
  if (!user || user.isActive === false) return false;
  if (user.isSuperAdmin) return true;
  const allowed = user.permissions?.[module] ?? [];
  return allowed.includes(action);
}
