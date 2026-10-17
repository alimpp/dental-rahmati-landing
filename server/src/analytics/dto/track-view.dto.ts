import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class TrackViewDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(240)
  path!: string;
}
