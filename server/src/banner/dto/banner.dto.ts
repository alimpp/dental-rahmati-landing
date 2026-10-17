import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateBannerDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  image!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title!: string;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  subtitle?: string | null;

  @IsOptional()
  @IsString()
  description?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  link?: string | null;

  @IsOptional()
  @IsInt()
  @Min(0)
  sort?: number;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  button1Text?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  button1Link?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  button2Text?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  button2Link?: string | null;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateBannerDto {
  @IsOptional()
  @IsString()
  @MaxLength(500)
  image?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  subtitle?: string | null;

  @IsOptional()
  @IsString()
  description?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  link?: string | null;

  @IsOptional()
  @IsInt()
  @Min(0)
  sort?: number;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  button1Text?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  button1Link?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  button2Text?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  button2Link?: string | null;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
