import { BadRequestException, PipeTransform } from '@nestjs/common';
import type { ZodType } from 'zod';

type ZodIssueBag = {
  issues: Array<{ path: PropertyKey[]; message: string }>;
};

function flattenZodErrors(error: ZodIssueBag): Record<string, string> {
  const fields: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? 'form');
    if (!fields[key]) fields[key] = issue.message;
  }
  return fields;
}

export class ZodValidationPipe implements PipeTransform {
  constructor(private readonly schema: ZodType) {}

  transform(value: unknown) {
    const parsed = this.schema.safeParse(value);
    if (parsed.success) return parsed.data;

    const errors = flattenZodErrors(parsed.error);
    throw new BadRequestException({
      success: false,
      message: Object.values(errors).join('، '),
      errors,
    });
  }
}
