import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class TrackViewDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(240)
  path!: string;

  /** Stable per-browser id — used to count each device once per path/day. */
  @IsOptional()
  @IsString()
  @MaxLength(64)
  visitorId?: string;
}
