import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";

import { StatusEnum } from "@enums/status.enum";

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  code?: string;

  @IsNumber()
  @IsOptional()
  subcategoryId?: number;

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
  mainImage?: string;

  @IsString()
  @IsOptional()
  boxImage?: string;

  @IsString()
  @IsOptional()
  schemeImage?: string;

  @IsEnum(StatusEnum)
  @IsOptional()
  status?: StatusEnum;
}
