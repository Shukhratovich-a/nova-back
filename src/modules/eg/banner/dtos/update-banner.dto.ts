import { IsOptional, IsString } from "class-validator";

export class UpdateBannerDto {
  @IsString()
  @IsOptional()
  posterDesktop?: string;

  @IsString()
  @IsOptional()
  posterMobile?: string;

  @IsString()
  @IsOptional()
  titleRu?: string;

  @IsString()
  @IsOptional()
  titleEn?: string;

  @IsString()
  @IsOptional()
  titleTr?: string;

  @IsString()
  @IsOptional()
  titleAr?: string;

  @IsString()
  @IsOptional()
  descriptionRu?: string;

  @IsString()
  @IsOptional()
  descriptionEn?: string;

  @IsString()
  @IsOptional()
  descriptionTr?: string;

  @IsString()
  @IsOptional()
  descriptionAr?: string;

  @IsString()
  @IsOptional()
  subtitleRu?: string;

  @IsString()
  @IsOptional()
  subtitleEn?: string;

  @IsString()
  @IsOptional()
  subtitleTr?: string;

  @IsString()
  @IsOptional()
  subtitleAr?: string;
}
