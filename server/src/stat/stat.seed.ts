import type { CreateStatDto } from './dto/stat.dto';

/** Matches the homepage StatsStrip component. */
export const STAT_SEED: CreateStatDto[] = [
  {
    value: '+۱۲',
    label: 'سال تجربه تخصصی دندان‌پزشکی',
    icon: '/icons/stat-experience.svg',
    sort: 1,
    isActive: true,
  },
  {
    value: '+۸۵۰۰',
    label: 'مراجعه‌کننده راضی',
    icon: '/icons/stat-cases.svg',
    sort: 2,
    isActive: true,
  },
  {
    value: '+۲۰',
    label: 'خدمت تخصصی از پیشگیری تا زیبایی',
    icon: '/icons/stat-lawyer.svg',
    sort: 3,
    isActive: true,
  },
  {
    value: '۹۷٪',
    label: 'رضایت از تجربه درمان',
    icon: '/icons/stat-success.svg',
    sort: 4,
    isActive: true,
  },
];
