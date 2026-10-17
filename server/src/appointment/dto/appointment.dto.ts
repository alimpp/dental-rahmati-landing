import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';

const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export class CreateSlotDto {
  @IsString()
  @Matches(DATE_RE, { message: 'تاریخ باید به صورت YYYY-MM-DD باشد' })
  date!: string;

  @IsString()
  @Matches(TIME_RE, { message: 'ساعت شروع نامعتبر است' })
  startTime!: string;

  @IsString()
  @Matches(TIME_RE, { message: 'ساعت پایان نامعتبر است' })
  endTime!: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class SlotRangeDto {
  @IsString()
  @Matches(TIME_RE, { message: 'ساعت شروع نامعتبر است' })
  startTime!: string;

  @IsString()
  @Matches(TIME_RE, { message: 'ساعت پایان نامعتبر است' })
  endTime!: string;
}

export class BulkCreateSlotsDto {
  @IsString()
  @Matches(DATE_RE, { message: 'تاریخ باید به صورت YYYY-MM-DD باشد' })
  date!: string;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(40)
  @ValidateNested({ each: true })
  @Type(() => SlotRangeDto)
  slots!: SlotRangeDto[];
}

export class UpdateSlotDto {
  @IsOptional()
  @IsString()
  @Matches(DATE_RE, { message: 'تاریخ باید به صورت YYYY-MM-DD باشد' })
  date?: string;

  @IsOptional()
  @IsString()
  @Matches(TIME_RE, { message: 'ساعت شروع نامعتبر است' })
  startTime?: string;

  @IsOptional()
  @IsString()
  @Matches(TIME_RE, { message: 'ساعت پایان نامعتبر است' })
  endTime?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class CreateBookingDto {
  @IsUUID()
  slotId!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(80)
  firstName!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(80)
  lastName!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(40)
  phone!: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string | null;
}
