import { z } from 'zod';
import { toEnglishDigits } from '../inquiry/inquiry.schema';

function flattenPhone(value: string): string {
  return toEnglishDigits(value).replace(/[\s-]/g, '');
}

export const bookingFieldErrors = {
  slotId: 'نوبت انتخاب‌شده نامعتبر است.',
  firstName: 'نام را با حداقل دو نویسه وارد کنید.',
  lastName: 'نام خانوادگی را با حداقل دو نویسه وارد کنید.',
  phone: 'شماره موبایل را با ۰۹ و ۱۱ رقم وارد کنید.',
  notes: 'توضیحات حداکثر ۱۰۰۰ نویسه باشد.',
} as const;

export const createBookingSchema = z.object({
  slotId: z.string({ error: bookingFieldErrors.slotId }).uuid(bookingFieldErrors.slotId),
  firstName: z
    .string({ error: bookingFieldErrors.firstName })
    .trim()
    .min(2, bookingFieldErrors.firstName)
    .max(80, bookingFieldErrors.firstName)
    .regex(/^[\u0600-\u06FFa-zA-Z\s'\u200c.-]+$/, bookingFieldErrors.firstName),
  lastName: z
    .string({ error: bookingFieldErrors.lastName })
    .trim()
    .min(2, bookingFieldErrors.lastName)
    .max(80, bookingFieldErrors.lastName)
    .regex(/^[\u0600-\u06FFa-zA-Z\s'\u200c.-]+$/, bookingFieldErrors.lastName),
  phone: z
    .string({ error: bookingFieldErrors.phone })
    .trim()
    .transform(flattenPhone)
    .refine(
      (value) => /^(09\d{9}|\+989\d{9})$/.test(value),
      bookingFieldErrors.phone,
    ),
  notes: z
    .union([z.literal(''), z.string().trim().max(1000, bookingFieldErrors.notes)])
    .optional()
    .nullable()
    .transform((value) => (value ? value : null)),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;

export function flattenBookingErrors(error: {
  issues: Array<{ path: PropertyKey[]; message: string }>;
}): Record<string, string> {
  const fields: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? 'form');
    if (!fields[key]) fields[key] = issue.message;
  }
  return fields;
}
