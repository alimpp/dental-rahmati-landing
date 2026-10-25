import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';

export class PortfolioGalleryImageDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  url!: string;

  @IsOptional()
  @IsString()
  @MaxLength(220)
  caption?: string;
}

export class CreatePortfolioItemDto {
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
  @MaxLength(120)
  treatment!: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  patientAlias?: string | null;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  coverImage?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  beforeImage?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  afterImage?: string | null;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(48)
  @ValidateNested({ each: true })
  @Type(() => PortfolioGalleryImageDto)
  gallery!: PortfolioGalleryImageDto[];

  @IsOptional()
  @IsInt()
  @Min(0)
  sort?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdatePortfolioItemDto {
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
  @MaxLength(120)
  treatment?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  patientAlias?: string | null;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  coverImage?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  beforeImage?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  afterImage?: string | null;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(48)
  @ValidateNested({ each: true })
  @Type(() => PortfolioGalleryImageDto)
  gallery?: PortfolioGalleryImageDto[];

  @IsOptional()
  @IsInt()
  @Min(0)
  sort?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
