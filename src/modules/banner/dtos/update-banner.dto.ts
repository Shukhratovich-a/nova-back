import { IsOptional, IsString } from "class-validator";

export class UpdateBannerDto {
  @IsString()
  @IsOptional()
  poster?: string;
}

export class UpdateBannerContentDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  subtitle?: string;
}
