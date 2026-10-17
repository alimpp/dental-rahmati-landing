import {
  IsBoolean,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import type { AdminModuleKey, PermissionAction } from '../permissions';

export class CreateAdminDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  username!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(160)
  displayName!: string;

  @IsString()
  @MinLength(8)
  @MaxLength(120)
  password!: string;

  @IsOptional()
  @IsObject()
  permissions?: Partial<Record<AdminModuleKey, PermissionAction[]>>;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateAdminDto {
  @IsOptional()
  @IsString()
  @MaxLength(160)
  displayName?: string;

  @IsOptional()
  @IsString()
  @MinLength(8)
  @MaxLength(120)
  password?: string;

  @IsOptional()
  @IsObject()
  permissions?: Partial<Record<AdminModuleKey, PermissionAction[]>>;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
