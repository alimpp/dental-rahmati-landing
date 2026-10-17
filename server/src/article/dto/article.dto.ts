import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDateString,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  ValidateIf,
  ValidateNested,
} from 'class-validator';

export class ArticleSectionDto {
  @IsIn(['text', 'list', 'image'])
  type!: 'text' | 'list' | 'image';

  @IsOptional()
  @IsString()
  @MaxLength(200)
  title?: string | null;

  @ValidateIf((o: ArticleSectionDto) => o.type === 'text')
  @IsOptional()
  @IsString()
  content?: string | null;

  @ValidateIf((o: ArticleSectionDto) => o.type === 'list')
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(20)
  @IsString({ each: true })
  items?: string[] | null;

  @ValidateIf((o: ArticleSectionDto) => o.type === 'image')
  @IsOptional()
  @IsString()
  @MaxLength(500)
  src?: string | null;

  @ValidateIf((o: ArticleSectionDto) => o.type === 'image')
  @IsOptional()
  @IsString()
  @MaxLength(200)
  alt?: string | null;

  @ValidateIf((o: ArticleSectionDto) => o.type === 'image')
  @IsOptional()
  @IsString()
  @MaxLength(240)
  caption?: string | null;
}

export class CreateArticleDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(220)
  title!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(240)
  slug!: string;

  @IsString()
  @IsNotEmpty()
  excerpt!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  category!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  author!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  coverImage!: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ArticleSectionDto)
  sections?: ArticleSectionDto[] | null;

  @IsOptional()
  @IsString()
  @MaxLength(220)
  seoTitle?: string | null;

  @IsOptional()
  @IsString()
  seoDescription?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  seoKeywords?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  ogImage?: string | null;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(40)
  readingMinutes?: number;

  @IsOptional()
  @IsDateString()
  publishedAt?: string | null;

  @IsOptional()
  @IsBoolean()
  featured?: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  sort?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateArticleDto {
  @IsOptional()
  @IsString()
  @MaxLength(220)
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(240)
  slug?: string;

  @IsOptional()
  @IsString()
  excerpt?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  category?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  author?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  coverImage?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ArticleSectionDto)
  sections?: ArticleSectionDto[] | null;

  @IsOptional()
  @IsString()
  @MaxLength(220)
  seoTitle?: string | null;

  @IsOptional()
  @IsString()
  seoDescription?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  seoKeywords?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  ogImage?: string | null;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(40)
  readingMinutes?: number;

  @IsOptional()
  @IsDateString()
  publishedAt?: string | null;

  @IsOptional()
  @IsBoolean()
  featured?: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  sort?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class ArticleListQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number = 9;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  category?: string;

  @IsOptional()
  @IsString()
  all?: string;
}
