import { IsIn, IsOptional } from 'class-validator';

export class ReportsQueryDto {
  @IsOptional()
  @IsIn(['daily', 'weekly', 'monthly'])
  range?: 'daily' | 'weekly' | 'monthly' = 'daily';
}
