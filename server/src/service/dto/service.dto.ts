import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateIf,
  ValidateNested,
} from 'class-validator';

export class ServiceSectionDto {
  @IsIn(['text', 'list'])
  type!: 'text' | 'list';

  @IsOptional()
  @IsString()
  @MaxLength(200)
  title?: string | null;

  @ValidateIf((o: ServiceSectionDto) => o.type === 'text')
  @IsOptional()
  @IsString()
  content?: string | null;

  @ValidateIf((o: ServiceSectionDto) => o.type === 'list')
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(20)
  @IsString({ each: true })
  items?: string[] | null;
}

export class CreateServiceDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(220)
  slug!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  icon!: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  coverImage?: string | null;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ServiceSectionDto)
  sections?: ServiceSectionDto[] | null;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  casePathTitle?: string | null;

  @IsOptional()
  @IsString()
  casePathDescription?: string | null;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  requiredDocuments?: string[] | null;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  seoTitle?: string | null;

  @IsOptional()
  @IsString()
  seoDescription?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  seoKeywords?: string | null;

  @IsOptional()
  @IsInt()
  @Min(0)
  sort?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateServiceDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(220)
  slug?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  icon?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  coverImage?: string | null;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ServiceSectionDto)
  sections?: ServiceSectionDto[] | null;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  casePathTitle?: string | null;

  @IsOptional()
  @IsString()
  casePathDescription?: string | null;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  requiredDocuments?: string[] | null;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  seoTitle?: string | null;

  @IsOptional()
  @IsString()
  seoDescription?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  seoKeywords?: string | null;

  @IsOptional()
  @IsInt()
  @Min(0)
  sort?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
