import { LanguageEnum } from "@/enums/language.enum";
import { IsEnum, IsNumber, IsString } from "class-validator";

export class CreateDetailCategoryDto {}

export class CreateDetailCategoryContentDto {
  @IsString()
  title: string;

  @IsEnum(LanguageEnum)
  language: LanguageEnum;

  @IsNumber()
  detailCategoryId: number;
}

export class CreateDetailDto {
  @IsNumber()
  productId: number;

  @IsNumber()
  categoryId: number;
}

export class CreateDetailContentDto {
  @IsString()
  name: string;

  @IsString()
  value: string;

  @IsEnum(LanguageEnum)
  language: LanguageEnum;

  @IsNumber()
  detailId: number;
}
