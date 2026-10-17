import type { CreateProcessStepDto } from './dto/process-step.dto';

/** Matches the homepage CasePathSection component. */
export const PROCESS_STEP_SEED: CreateProcessStepDto[] = [
  {
    title: 'رزرو نوبت و پذیرش',
    description:
      'نوبت آنلاین یا تلفنی ثبت می‌شود؛ شرح مختصر مشکل و سوابق پزشکی را دریافت می‌کنیم.',
    sort: 1,
    isActive: true,
  },
  {
    title: 'معاینه و تصویربرداری',
    description:
      'معاینه بالینی، در صورت نیاز رادیوگرافی یا اسکن، و تشخیص دقیق وضعیت دهان و دندان.',
    sort: 2,
    isActive: true,
  },
  {
    title: 'طرح درمان و شروع کار',
    description:
      'گزینه‌ها، زمان‌بندی و هزینه را مرور می‌کنید؛ سپس درمان با کنترل درد و استاندارد استریل آغاز می‌شود.',
    sort: 3,
    isActive: true,
  },
  {
    title: 'مراقبت و پیگیری',
    description:
      'آموزش بهداشت خانگی، نوبت کنترل و پیگیری نتیجه تا لبخند و عملکرد جویدن پایدار بماند.',
    sort: 4,
    isActive: true,
  },
];
