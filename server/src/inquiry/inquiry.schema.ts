import { z } from 'zod';

const PERSIAN_DIGITS = '۰۱۲۳۴۵۶۷۸۹';
const ARABIC_DIGITS = '٠١٢٣٤٥٦٧٨٩';

export function toEnglishDigits(value: string): string {
  return value
    .replace(/[۰-۹]/g, (digit) => String(PERSIAN_DIGITS.indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String(ARABIC_DIGITS.indexOf(digit)));
}

function flattenPhone(value: string): string {
  return toEnglishDigits(value).replace(/[\s-]/g, '');
}

export const inquiryFieldErrors = {
  name: 'نام را با حروف و حداقل دو نویسه وارد کنید.',
  phone: 'شماره موبایل را با ۰۹ و ۱۱ رقم وارد کنید.',
  email: 'ایمیل معتبر نیست.',
  subject: 'موضوع باید بین ۳ تا ۱۸۰ نویسه باشد.',
  message: 'شرح پرونده باید حداقل ۲۰ نویسه باشد.',
  source: 'منبع ارسال نامعتبر است.',
} as const;

export const createInquirySchema = z.object({
  name: z
    .string({ error: inquiryFieldErrors.name })
    .trim()
    .min(2, inquiryFieldErrors.name)
    .max(120, inquiryFieldErrors.name)
    .regex(/^[\u0600-\u06FFa-zA-Z\s'\u200c.-]+$/, inquiryFieldErrors.name),
  phone: z
    .string({ error: inquiryFieldErrors.phone })
    .trim()
    .transform(flattenPhone)
    .refine((value) => /^(09\d{9}|\+989\d{9})$/.test(value), inquiryFieldErrors.phone),
  email: z
    .union([z.literal(''), z.string().trim().email(inquiryFieldErrors.email)])
    .optional()
    .nullable()
    .transform((value) => (value ? value : null)),
  subject: z
    .string({ error: inquiryFieldErrors.subject })
    .trim()
    .min(3, inquiryFieldErrors.subject)
    .max(180, inquiryFieldErrors.subject),
  message: z
    .string({ error: inquiryFieldErrors.message })
    .trim()
    .min(20, inquiryFieldErrors.message)
    .max(2000, inquiryFieldErrors.message),
  source: z.enum(['home', 'contact', 'consultation', 'about']).optional().default('home'),
});

export type CreateInquiryInput = z.infer<typeof createInquirySchema>;

export function flattenInquiryErrors(error: {
  issues: Array<{ path: PropertyKey[]; message: string }>
}): Record<string, string> {
  const fields: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? 'form');
    if (!fields[key]) fields[key] = issue.message;
  }
  return fields;
}
