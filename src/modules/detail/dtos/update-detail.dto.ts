import { IsEnum, IsNumber, IsString, IsOptional } from "class-validator";

import { LanguageEnum } from "@enums/language.enum";

export class UpdateDetailCategoryDto {}

export class UpdateDetailCategoryContentDto {
  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsNumber()
  detailCategoryId: number;
}

export class UpdateDetailDto {
  @IsOptional()
  @IsNumber()
  productId: number;

  @IsOptional()
  @IsNumber()
  categoryId: number;
}

export class UpdateDetailContentDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  value: string;

  @IsOptional()
  @IsEnum(LanguageEnum)
  language: LanguageEnum;

  @IsOptional()
  @IsNumber()
  detailId: number;
}
