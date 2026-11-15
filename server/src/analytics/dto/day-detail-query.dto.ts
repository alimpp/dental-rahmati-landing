import { IsIn, IsOptional, Matches } from 'class-validator';

export class DayDetailQueryDto {
  /** YYYY-MM-DD for a single day, or YYYY-MM for monthly bucket, or week-start YYYY-MM-DD */
  @Matches(/^\d{4}-\d{2}(-\d{2})?$/)
  bucket!: string;

  @IsOptional()
  @IsIn(['daily', 'weekly', 'monthly'])
  range?: 'daily' | 'weekly' | 'monthly' = 'daily';
}
