export const ADMIN_MODULES = [
  'banners',
  'services',
  'articles',
  'catalog',
  'stats',
  'promises',
  'process_steps',
  'testimonials',
  'faqs',
  'guides',
  'inquiries',
  'appointment_slots',
  'appointment_bookings',
  'admins',
  'history',
  'reports',
] as const

export const PERMISSION_ACTIONS = ['view', 'create', 'edit', 'delete'] as const

export type AdminModuleKey = (typeof ADMIN_MODULES)[number]
export type PermissionAction = (typeof PERMISSION_ACTIONS)[number]
export type AdminPermissions = Partial<Record<AdminModuleKey, PermissionAction[]>>

export interface TAdminUser {
  id: string
  username: string
  displayName: string
  isSuperAdmin: boolean
  isActive: boolean
  permissions: AdminPermissions | null
  createdAt?: string | null
  updatedAt?: string | null
}

export interface TLoginPayload {
  username: string
  password: string
}

export interface TLoginResult {
  token: string
  user: TAdminUser
}

export interface TCreateAdminPayload {
  username: string
  displayName: string
  password: string
  permissions?: AdminPermissions
  isActive?: boolean
}

export interface TUpdateAdminPayload {
  displayName?: string
  password?: string
  permissions?: AdminPermissions
  isActive?: boolean
}

export interface TAuditLog {
  id: string
  actorId: string | null
  actorUsername: string
  module: string
  action: string
  entityId: string | null
  summary: string
  payload: Record<string, unknown> | null
  createdAt: string
}

export interface THistoryPage {
  items: TAuditLog[]
  total: number
  page: number
  limit: number
  pageCount: number
}

export interface TDashboardTotals {
  visits: number
  visitsToday: number
  visitsWeek: number
  articleVisits: number
  articles: number
  banners: number
  services: number
  catalog: number
  guides: number
  inquiries: number
}

export interface TDashboardPoint {
  day: string
  visits: number
  articleVisits: number
}

export interface TDashboardPath {
  path: string
  label: string
  visits: number
}

export interface TUploadFile {
  url: string
  name: string
  mime: string
  size: number
}

export interface TDashboard {
  totals: TDashboardTotals
  series: TDashboardPoint[]
  pages: TDashboardPath[]
  articles: TDashboardPath[]
}

export type VisitReportRange = 'daily' | 'weekly' | 'monthly'

export interface TVisitReport {
  range: VisitReportRange
  totals: {
    visits: number
    articleVisits: number
    uniquePaths: number
    prevVisits: number
    changePercent: number
  }
  series: TDashboardPoint[]
  pages: TDashboardPath[]
}

export interface TPermissionCatalog {
  modules: { key: AdminModuleKey; label: string }[]
  actions: { key: PermissionAction; label: string }[]
}

export const MODULE_LABELS: Record<AdminModuleKey, string> = {
  banners: 'بنرها',
  services: 'خدمات',
  articles: 'مقالات',
  catalog: 'کاتالوگ',
  stats: 'آمار صفحه اصلی',
  promises: 'تعهدات صفحه اصلی',
  process_steps: 'مسیر درمان',
  testimonials: 'نظرات بیماران',
  faqs: 'سوالات متداول',
  guides: 'راهنماها',
  inquiries: 'پیام‌های تماس',
  appointment_slots: 'نوبت‌های خالی',
  appointment_bookings: 'رزروهای نوبت',
  admins: 'ادمین‌ها',
  history: 'تاریخچه',
  reports: 'گزارش بازدید',
}

export const MODULE_ICONS: Record<AdminModuleKey, string> = {
  banners: '/icons/admin-banner.svg',
  services: '/icons/practice.svg',
  articles: '/icons/articles.svg',
  catalog: '/icons/catalog.svg',
  stats: '/icons/admin-report.svg',
  promises: '/icons/about.svg',
  process_steps: '/icons/practice.svg',
  testimonials: '/icons/admin-user.svg',
  faqs: '/icons/contact.svg',
  guides: '/icons/articles.svg',
  inquiries: '/icons/contact.svg',
  appointment_slots: '/icons/clock.svg',
  appointment_bookings: '/icons/admin-file.svg',
  admins: '/icons/admin-shield.svg',
  history: '/icons/clock.svg',
  reports: '/icons/admin-report.svg',
}

export const ACTION_ICONS: Record<PermissionAction, string> = {
  view: '/icons/admin-file.svg',
  create: '/icons/admin-plus.svg',
  edit: '/icons/admin-edit.svg',
  delete: '/icons/admin-delete.svg',
}

export const ACTION_LABELS: Record<PermissionAction, string> = {
  view: 'دیدن',
  create: 'ایجاد',
  edit: 'ویرایش',
  delete: 'حذف',
}

export function emptyPermissions(): AdminPermissions {
  return Object.fromEntries(ADMIN_MODULES.map((key) => [key, [] as PermissionAction[]])) as AdminPermissions
}

export function canAccess(
  user: TAdminUser | null | undefined,
  module: AdminModuleKey,
  action: PermissionAction,
): boolean {
  if (!user || !user.isActive) return false
  if (user.isSuperAdmin) return true
  return Boolean(user.permissions?.[module]?.includes(action))
}
